/* eslint-disable prefer-const */
import 'dotenv/config'
import {
  Collection,
  Db,
  Filter,
  OptionalUnlessRequiredId,
  UpdateFilter,
  AggregateOptions,
  ClientSession,
  AnyBulkWriteOperation,
  MongoClient,
  ChangeStreamDocument,
  ChangeStream,
} from 'mongodb';
import {
  User,
  Document,
  AbimongoModelOptions,
  EventType,
} from '../types';
import { AbimongoSchema } from './AbimongoSchema';
import { AbiMongoError } from '../utils/error/abimongoError-handler';
import { ErrorType } from '../utils/error/errorTypes';
import { AbimongoClient } from './AbimongoClient'
import { castId, DB_CHANGE_EVENT, AbimongoModelRegistry } from '../utils';
import { ObjectId } from 'mongodb';
import EventEmitter from 'events';
import { PubSub } from "graphql-subscriptions";
import { MultiTenantManager } from '../tanancy/MultiTenantManager';
import { redis } from '../redis-manager/redisClient';
import { getGCSettings } from '../decorators/gcSettings';


const pubsub = new PubSub();

/**
 * Represents a model for MongoDB operations with support for schema validation, middleware, and multi-tenancy.
 * @template T - The type of the document in the collection.
 */
export class AbimongoModel<T extends Document> {
  private _collection!: Collection<T>;
  private _schema?: AbimongoSchema<T>;
  private tenantId?: string;
  private client!: MongoClient;
  private uri: string = 'mongodb://127.0.0.1:27017';

  public collectionName: string
  private db!: Db;
  private eventEmitter = new EventEmitter();

  constructor(options: AbimongoModelOptions<T>) {
    const { db, client, tenantId, collectionName, schema } = options;
    const errorMessage = `AbimongoModel: One of 'db', 'client', or 'tenantId' is required to resolve a database instance.`;
    const error = new Error(errorMessage).stack;
    const cause = ErrorType.NULL_OR_UNDEFINED;

    if (options === null || options === undefined) {
      throw AbiMongoError(
        ErrorType.AbiMongoModelError,
        errorMessage,
        error,
        cause
      )
    }

    if (db) {
      this.db = db;
    } else if (tenantId) {
      this.getResolvedTenant(tenantId)
        .then((resolved) => {
          if (!resolved) throw new Error(`Tenant "${tenantId}" is not registered.`);
          this.db = resolved.db();
        })
    } else if (client) {
      this.db = client.db();
    }

    this.collectionName = collectionName;
    this._schema = schema;

    // Initialize middleware hooks
    this.initMiddleware();

    const gcMeta = getGCSettings(schema);
    if (gcMeta) {
      AbimongoModelRegistry.registerModel(this);
    }

  }

  private getResolvedTenant(tenantId?: string): Promise<MongoClient | undefined> {
    const getTenantDB = async () => {
      const resolved = await MultiTenantManager.getClient(tenantId as string);
      return resolved
    }
    if (tenantId) {
      return getTenantDB() as Promise<MongoClient | undefined>;
    } else {
      const resolved = MultiTenantManager.getClient(this.tenantId as string);
      if (!resolved) throw new Error(`Tenant "${this.tenantId}" is not registered.`);
      return resolved as Promise<MongoClient | undefined>;
    }
  };

  /**
   * Subscribes to events emitted by the model.
   * @param {EventType} event - The event type to subscribe to.
   * @param {(...args: any[]) => void} listener - The callback function to execute when the event is emitted.
   */
  on(event: EventType, listener: (...args: any[]) => void) {
    this.eventEmitter.on(event, listener);
  }
  once(event: EventType, listener: (...args: any[]) => void) {
    this.eventEmitter.once(event, listener);
  }
  off(event: EventType, listener: (...args: any[]) => void) {
    this.eventEmitter.off(event, listener);
  }
  removeListener(event: EventType, listener: (...args: any[]) => void) {
    this.eventEmitter.removeListener(event, listener);
  }

  /**
   * Initializes the database connection and collection.
   * @throws {Error} If the collection name is not provided.
   */
  async init(): Promise<void> {
    try {

      const db = await AbimongoClient.getDatabase(
        this.tenantId as string,
        this.uri
      );
      if (!this._collection) {
        if (!this.collectionName) {
          throw new Error('Collection name is required.');
        }
      }

      this._collection = db.collection<T>(this.collectionName || 'defaultCollection');
      this.db = db
      this.client = this.client as MongoClient;
      this._schema = this.schema || new AbimongoSchema<T>({} as Record<keyof T, any>);

    } catch (error: any) {
      // logger?.error(`AbimongoModel initialization error: ${error}`);
      throw AbiMongoError(
        ErrorType.AbiMongoModelError,
        `Failed to initialize AbimongoModel: ${error.message}`,
        error.stack,
        ErrorType.INITIALIZATION_ERROR
      );
    }
  }

  async registerModel(options: AbimongoModelOptions<T>): Promise<void> {
    const { db, client, tenantId, collectionName, schema } = options;
    if (db) {
      this.db = db;
    } else if (client) {
      this.client = client;
      this.db = client.db();
    } else if (tenantId) {
      const resolved = await this.getResolvedTenant(tenantId);
      if (!resolved) throw new Error(`Tenant "${tenantId}" is not registered.`);
      this.db = resolved.db();
    }

    if (!collectionName) {
      throw new Error('Collection name is required.');
    }
    this._collection = collectionName
      ? this.db.collection<T>(collectionName)
      : this.db.collection<T>('defaultCollection');


    if (schema) {
      this._schema = schema;
    } else {
      this._schema = new AbimongoSchema<T>({} as Record<keyof T, any>);
    }

    await this.init();
  }

  /**
   * Gets the MongoDB collection associated with this model.
   * @returns {Collection<T>} The MongoDB collection.
   */
  get collection(): Collection<T> {
    return this._collection;
  }

  /**
   * Gets the schema associated with this model.
   * @returns {AbimongoSchema<T>} The schema for the model.
   */
  get schema(): AbimongoSchema<T> {
    return this._schema as AbimongoSchema<T>;
  }

  /**
   * Validates a document against the schema.
   * @param {OptionalUnlessRequiredId<T>} doc - The document to validate.
   * @returns {Promise<T>} The validated document.
   */
  public validate(doc: OptionalUnlessRequiredId<T>): Promise<T> {
    for (const key in this.schema.getSchema()) {
      const field = this.schema.getSchema()[key];
      if (field.required && !(key in doc)) {
        console.error(`[error]: Field "${key}" is required but not provided.`);
        throw new Error(`Field "${key}" is required but not provided.`);
      }
      if (field.type === ObjectId && key in doc) {
         (doc as any)[key] = castId(doc[key]);
      }
      if (field.type === Array && key in doc) {
        doc[key] = doc[key].map(castId);
      }
      if (field.type === Object && key in doc) {
        for (const nestedKey in field.type.schema.getSchema) {
          const nestedField = field.type.schema.getSchema[nestedKey];
          if (nestedField.type.value === ObjectId && nestedKey in doc[key]) {
            doc[key][nestedKey] = castId(doc[key][nestedKey]);
          }
        }
      }

      if (key in doc && field.type === ObjectId) {
        (doc as any)[key] = castId(doc[key]);
      }
    };
    return doc as Promise<T>;
  }

  /**
   * Creates a new document in the collection.
   * @param {OptionalUnlessRequiredId<T>} doc - The document to create.
   * @returns {Promise<T>} The created document with its `_id`.
   */
  async create(doc: OptionalUnlessRequiredId<T>): Promise<T> {
    await this.init();
    this.validate(doc);

    await this.schema.executeHooks('pre-save', doc);
    if (this.schema) {
      this.schema.validate(doc);
    }
    const result = await this.db.collection(this._collection.collectionName).insertOne(doc); // Ensure write concern is set to majority
    await this.schema.executeHooks('post-save', doc);
    await pubsub.publish(`${DB_CHANGE_EVENT}_${this._collection}`, JSON.stringify({ documentInserted: { action: "create", doc } }));

    return { ...doc, _id: result.insertedId } as T;
  }

  /**
   * Finds documents in the collection that match the filter.
   * @param {Filter<T>} [filter={}] - The filter to apply.
   * @returns {Promise<T[]>} An array of matching documents.
   */
  async find(filter: Filter<T> = {}): Promise<T[]> {
    await this.init();
    const results = await this.collection.find(filter).toArray();
    return results?.length > 0 ? results.map(r => (
      { ...r, _id: r._id.toString() } as T & { _id: string } // Convert ObjectId to string
    )) : [] as T[];
  }

  /**
   * Finds a single document in the collection that matches the filter.
   * @param {Filter<T>} filter - The filter to apply.
   * @returns {Promise<T | null>} The matching document or `null` if not found.
   * @throws {Error} If the filter is not a valid object.
   */
  async findOne(filter: Filter<T>): Promise<T | null> {
    await this.init();
    if (!filter || typeof filter !== 'object') {
      console.error('[error]: Filter must be a valid object.');
      throw new Error('Filter must be a valid object.');
    }

    const result = await this.collection.findOne(filter);
    return result as T | null;
  }

  /**
   * Updates a single document in the collection.
   * @param {Filter<T>} filter - The filter to find the document.
   * @param {UpdateFilter<T>} update - The update operation to apply.
   * @returns {Promise<void>} Resolves when the update is complete.
   */
  async updateOne(filter: Filter<T>, update: UpdateFilter<T>): Promise<void> {
    await this.init();
    await this.schema.executeHooks('pre-update', { filter, update });
    await this.collection.updateOne(filter, update);
    await this.schema.executeHooks('post-update', { filter, update });
    await pubsub.publish(`${DB_CHANGE_EVENT}`, JSON.stringify({ documentUpdated: { action: "update", filter, update } }));
  }

  /**
   * Performs a bulk insert of documents into the collection.
   * @param {OptionalUnlessRequiredId<T>[]} docs - An array of documents to insert.
   * @returns {Promise<void>} Resolves when the bulk insert is complete.
   */
  async bulkInsert(docs: OptionalUnlessRequiredId<T>[]): Promise<void> {
    await this.init();
    if (!docs || docs.length === 0) return;
    this.validate(docs[0][0]); // Validate the first document
    await this.schema.executeHooks('pre-save', docs);
    await this.collection.insertMany(docs, { ordered: false }); // Parallel insertion
    await pubsub.publish(`${DB_CHANGE_EVENT}`, { documentInserted: { action: "bulkInsert", docs } });
  }

  /**
   * Performs a bulk update of multiple documents in the collection.
   * @param {Array<{ filter: Partial<T>; update: Partial<T> }>} updates - Array of update operations.
   * @returns {Promise<void>} Resolves when the bulk update is complete.
   */
  async bulkUpdate(updates: { filter: Partial<T>; update: Partial<T> }[]): Promise<void> {
    await this.init();
    const bulkOps: AnyBulkWriteOperation<T>[] = updates.map(({ filter, update }) => ({
      updateOne: { filter: filter as Filter<T>, update: { $set: update } },
    }))
    await this.collection.bulkWrite(bulkOps);
    await pubsub.publish(`${DB_CHANGE_EVENT}`, { documentInserted: { action: "bulkUpdate", updates } });

  }

  /**
   * @description Middleware for handling cascading deletes, aggregate, save and updates.
   * @returns {void}
   * @private 
   */
  private initMiddleware() {
    if (!this._schema) return;
    this.schema.pre('save', async (doc: OptionalUnlessRequiredId<T>) => {
      const relationships = this.schema.getRelationships();
      for (const { ref, localField } of relationships) {
        const relatedCollection = this.db?.collection(ref);
        const filter = { [localField]: doc._id };
        await relatedCollection?.updateMany(filter, { $set: { [localField]: doc._id } });
      }
    });

    this.schema.pre('deleteOne', async (doc: OptionalUnlessRequiredId<T>) => {
      const relationships = this.schema.getRelationships();
      for (const { ref, localField } of relationships) {
        const relatedCollection = this.db?.collection(ref);
        const filter = { [localField]: doc._id };
        await relatedCollection?.deleteMany(filter);
      }
    });

    this.schema.pre('aggregate', async (pipeline: Array<Record<string, any>>) => {
      const relationships = this.schema.getRelationships();
      for (const { ref, localField } of relationships) {
        pipeline.unshift({
          $lookup: {
            from: ref,
            localField: localField as string,
            foreignField: '_id',
            as: ref,
          },
        });
      }
    });

    this.schema.post('aggregate', async (result: Document[]) => {
      for (const doc of [result]) {
        const relationships = this.schema.getRelationships();
        for (const { ref } of relationships) {
          delete doc[Number(ref)];
        }
        await pubsub.publish("DB_CHANGE", { dbChange: { action: "aggregate", result } });
      }
    });
  };

  getSchema(): AbimongoSchema<T> {
    return this.schema;
  }

  /**
   * Deletes a single document from the collection.
   * @param {Filter<T>} filter - The filter to find the document to delete.
   * @returns {Promise<void>} Resolves when the document is deleted.
   */
  async deleteOne(filter: Filter<T>): Promise<void> {
    await this.init();
    const doc = await this.collection.findOne(filter);
    if (doc) {
      // Trigger pre-delete middleware
      await this.schema.triggerMiddleware('deleteOne', doc);
      await this.collection.deleteOne(filter);
      await pubsub.publish(`${DB_CHANGE_EVENT}`, { documentDeleted: { action: "delete", filter } });
    }
  };

  /**
   * Deletes multiple documents from the collection.
   * @param {Filter<T>} filter - The filter to find the documents to delete.
   * @returns {Promise<void>} Resolves when the documents are deleted.
   */
  async deleteMany(filter: Filter<T>): Promise<void> {
    await this.init();
    const docs = await this.collection.find(filter).toArray();
    if (docs.length > 0) {
      // Trigger pre-delete middleware
      await this.schema.triggerMiddleware('deleteMany', docs);
      await this.collection.deleteMany(filter);
      await pubsub.publish(`${DB_CHANGE_EVENT}`, { documentDeleted: { action: "deleteMany", filter } });
    }
  }

  /**
   * Populates a single field in a document with data from a related model.
   * @param {T} doc - The document to populate.
   * @param {keyof T} field - The field to populate.
   * @param {AbimongoModel<K>} relatedModel - The related model to fetch data from.
   * @returns {Promise<(T & { [key in keyof K]?: K }) | null>} The populated document.
   */
  async populateOne<K extends Document>(
    doc: T,
    field: keyof T,
    relatedModel: AbimongoModel<K>
  ): Promise<(T & { [key in keyof K]?: K }) | null> {
    await this.init();
    if (!doc[field]) return doc;
    const relatedDoc = await relatedModel.findOne({ _id: doc[field] });
    return { ...doc, [field]: relatedDoc };
  }

  /**
   * Populates a field in a document with an array of related documents.
   * @param {T} doc - The document to populate.
   * @param {keyof T} field - The field to populate.
   * @param {AbimongoModel<K>} relatedModel - The related model to fetch data from.
   * @returns {Promise<(T & { [key in keyof K]?: K[] }) | null>} The populated document.
   */
  async populateMany<K extends Document>(
    doc: T,
    field: keyof T,
    relatedModel: AbimongoModel<K>
  ): Promise<(T & { [key in keyof K]?: K[] }) | null> {
    await this.init();
    if (!doc[field] || !Array.isArray(doc[field])) return doc;
    const relatedDocs = await relatedModel.find({ _id: { $in: doc[field] } });
    return { ...doc, [field]: relatedDocs };
  }

  /**
   * Deletes a document with a transaction.
   * @param {Filter<T>} filter - The filter to find the document to delete.
   * @returns {Promise<void>} Resolves when the document is deleted.
   */
  async deleteWithTransaction(filter: Filter<T>): Promise<void> {
    await this.init();
    let session: ClientSession | undefined;
    session = await this.client?.startSession();
    session?.startTransaction();
    try {
      const doc = await this.collection.findOne(filter);
      if (doc) {
        await this.schema.triggerMiddleware('deleteOne', doc);
        await this.collection.deleteOne(filter, { session });
        await session?.commitTransaction();
      }
    } catch (error) {
      await session?.abortTransaction();
      throw error;
    } finally {
      session?.endSession();
    }
  }

  /**
   * Updates a document with a transaction.
   * @param {Filter<T>} filter - The filter to find the document to update.
   * @param {UpdateFilter<T>} update - The update operation to perform.
   * @returns {Promise<void>} Resolves when the document is updated.
   */
  async updateWithTransaction(filter: Filter<T>, update: UpdateFilter<T>): Promise<void> {
    await this.init();
    let session: ClientSession | undefined;
    session = await this.client?.startSession();
    session?.startTransaction();
    try {
      await this.collection.updateOne(filter, update, { session });
      await session?.commitTransaction();
    } catch (error) {
      await session?.abortTransaction();
      throw error;
    } finally {
      session?.endSession();
    }
  }

  /**
   * Finds a document in the cache by its key.
   * @param {string} key - The cache key.
   * @returns {Promise<any>} The cached result or `null` if not found.
   */
  async findCached(key: string): Promise<any> {
    const result = await redis.get(key);

    if (result) {
      await AbimongoModel.trackCacheHit(key);
      return JSON.parse(result);
    } else {
      await AbimongoModel.trackCacheMiss(key);
      return null;
    }
  }

  /**
   * Caches a result with a specified key and time-to-live (TTL).
   * @param {string} key - The cache key.
   * @param {any} data - The data to cache.
   * @param {number} [ttl=3600] - The time-to-live in seconds.
   * @returns {Promise<void>} Resolves when the data is cached.
   */
  static async cacheResult(key: string, data: any, ttl = 3600): Promise<void> {
    if (!key || typeof key !== 'string') {
      throw new Error('Cache key must be a non-empty string');
    }

    try {
      await redis.setEx(key, ttl, JSON.stringify(data));
    } catch (error) {
      console.error('Error caching result:', error);
      throw new Error(`Failed to cache result for key "${key}": ${error}`);
    }
  }

  /**
   * Clears a cached result by its key.
   * @param {string} key - The cache key.
   * @returns {Promise<void>} Resolves when the cache is cleared.
   */
  static async clearCache(key: string): Promise<void> {
    if (!key || typeof key !== 'string') {
      throw new Error('Cache key must be a non-empty string');
    }

    try {
      await redis.del(key);
    } catch (error) {
      console.error('Error clearing cache:', error);
      throw new Error(`Failed to clear cache for key "${key}": ${error}`);
    }
  }

  /**
   * Finds a document and updates it in the collection.
   * @param {Filter<T>} filter - The filter to find the document.
   * @param {UpdateFilter<T>} update - The update operation to perform.
   * @returns {Promise<T | null>} The updated document or `null` if not found.
   */
  async findOneAndUpdate(filter: Filter<T>, update: UpdateFilter<T>): Promise<T | null> {
    await this.init();
    const result = await this.collection.findOneAndUpdate(filter, update, { returnDocument: 'after' });
    return result as T | null;
  }

  /**
   * Finds a document and deletes it from the collection.
   * @param {Filter<T>} filter - The filter to find the document.
   * @returns {Promise<T | null>} The deleted document or `null` if not found.
   */
  async findOneAndDelete(filter: Filter<T>): Promise<T | null> {
    await this.init();
    const result = await this.collection.findOneAndDelete(filter);
    return result as T | null;
  }

  /**
   * Finds a document and replaces it with a new document.
   * @param {Filter<T>} filter - The filter to find the document.
   * @param {T} replacement - The new document to replace the found document.
   * @returns {Promise<T | null>} The replaced document or `null` if not found.
   */
  async findOneAndReplace(filter: Filter<T>, replacement: T): Promise<T | null> {
    await this.init();
    const result = await this.collection.findOneAndReplace(filter, replacement, { returnDocument: 'after' });
    return result as T | null;
  }

  /**
   * Finds a document and upserts it (inserts if not found).
   * @param {Filter<T>} filter - The filter to find the document.
   * @param {UpdateFilter<T>} update - The update operation to perform.
   * @returns {Promise<T | null>} The updated or inserted document.
   */
  async findOneAndUpsert(filter: Filter<T>, update: UpdateFilter<T>): Promise<T | null> {
    await this.init();
    const result = await this.collection.findOneAndUpdate(filter, update, { upsert: true, returnDocument: 'after' });
    return result as T | null;
  }

  /**
   * Finds a document and upserts it (inserts if not found) with a transaction.
   * @param {Filter<T>} filter - The filter to find the document.
   * @param {UpdateFilter<T>} update - The update operation to perform.
   * @returns {Promise<T | null>} The updated or inserted document.
   */
  async findOneAndUpsertWithTransaction(filter: Filter<T>, update: UpdateFilter<T>): Promise<T | null> {
    await this.init();
    let session: ClientSession | undefined;
    session = await this.client?.startSession();
    session?.startTransaction();
    try {
      const result = await this.collection.findOneAndUpdate(filter, update, { upsert: true, returnDocument: 'after', session });
      await session?.commitTransaction();
      return result as T | null;
    } catch (error) {
      await session?.abortTransaction();
      throw error;
    } finally {
      session?.endSession();
    }
  }

  /**
   * Finds a document and upserts it (inserts if not found) with a transaction and user authorization.
   * @param {Filter<T>} filter - The filter to find the document.
   * @param {UpdateFilter<T>} update - The update operation to perform.
   * @param {User} user - The user performing the operation.
   * @returns {Promise<T | null>} The updated or inserted document.
   */
  async findOneAndUpsertWithTransactionSecure(filter: Filter<T>, update: UpdateFilter<T>, user: User): Promise<T | null> {
    await this.init();
    let session: ClientSession | undefined;
    session = await this.client?.startSession();
    session?.startTransaction();
    try {
      if (user.role !== 'admin') throw new Error('Unauthorized');
      const result = await this.collection.findOneAndUpdate(filter, update, { upsert: true, returnDocument: 'after', session });
      await session?.commitTransaction();
      return result as T | null;
    } catch (error) {
      await session?.abortTransaction();
      throw error;
    } finally {
      session?.endSession();
    }
  }


  /**
   * Deletes a document securely with user authorization.
   * @param {Filter<T>} filter - The filter to find the document.
   * @param {User} user - The user performing the operation.
   * @returns {Promise<void>} Resolves when the document is deleted.
   */
  async deleteSecure(filter: Filter<T>, user: User): Promise<void> {
    await this.init();
    if (user.role !== 'admin') throw new Error('Unauthorized');
    await this.collection.deleteOne(filter);
  }

  /**
   * Aggregates documents in the collection using a pipeline.
   * @param {object[]} pipeline - The aggregation pipeline.
   * @param {AggregateOptions} [options={}] - The aggregation options.
   * @param {ClientSession} [session] - The session for transactions.
   * @returns {Promise<U[]>} The aggregation result as an array.
   * @throws {Error} If the aggregation fails or the session cannot be started
   */
  async aggregate<U extends Document>(
    pipeline: object[],
    options: AggregateOptions = {},
    session?: ClientSession
  ): Promise<U[]> {
    try {
      await this.init();
      const cursor = this.collection.aggregate<U>(pipeline, { ...options, session });
      this.schema.triggerMiddleware('aggregate', cursor);
      this.eventEmitter.emit('aggregate', cursor.bufferedCount());

      await pubsub.publish("DB_CHANGE", { dbChange: { action: "aggregate", pipeline } });
      return await cursor.toArray();
    } catch (error) {
      console.log(`Aggregation error: ${error}`);
      options.session?.endSession()
      return [] as U[]; // Return an empty array on error
    }
  };

  /**
   * Aggregates documents in the collection using a pipeline with a transaction.
   * @param {object[]} pipeline - The aggregation pipeline.
   * @param {AggregateOptions} [options={}] - The aggregation options.
   * @returns {Promise<U[]>} The aggregation result as an array.
   * @throws {Error} If the aggregation fails or the session cannot be started
   */
  async aggregateWithTransaction<U extends Document>(
    pipeline: object[],
    options: AggregateOptions = {}
  ): Promise<U[]> {
    await this.init();
    const session = await this.client?.startSession();
    session?.startTransaction();
    try {
      const result = await this.aggregate<U>(pipeline, options, session);
      await session?.commitTransaction();
      this.schema.triggerMiddleware('aggregate', result);

      await pubsub.publish("DB_CHANGE", { dbChange: { action: "aggregate", result } });
      return result;
    } catch (error) {
      await session?.abortTransaction();
      throw error;
    } finally {
      session?.endSession();
    }
  };

  /**
   * Streaming aggregation - returns a cursor for large datasets
   * @param pipeline - MongoDB aggregation pipeline
   * @param options - Aggregation options
   * @returns {Cursor<U>} Aggregation cursor for streaming results
   */
  async streamAggregation<U extends Document>(
    pipeline: object[],
    options: AggregateOptions = {}
  ) {
    this.schema.triggerMiddleware('aggregate', pipeline);
    await pubsub.publish("DB_CHANGE", { dbChange: { action: "aggregate", pipeline } });
    return this.collection.aggregate<U>(pipeline, options).stream();
  }

  /**
   * Aggregates documents in the collection using a pipeline with caching.
   * @param {object[]} pipeline - The aggregation pipeline.
   * @param {string} cacheKey - The cache key.
   * @param {number} [cacheDuration=300] - The cache duration in seconds.
   * @returns {Promise<T[]>} The aggregation result as an array.
   * @throws {Error} If the pipeline is not valid or the cache key is not a string.
   */
  async aggregateWithCache(
    pipeline: object[],
    cacheKey: string,
    cacheDuration = 300
  ): Promise<T[]> {
    await this.init();
    // Check if the pipeline is valid Array
    if (!Array.isArray(pipeline)) {
      console.error('[error]: Pipeline must be an array of objects.');
      throw new Error('Pipeline must be an array of objects.');
    }
    const cachedResult = await redis.get(cacheKey);

    if (cachedResult) {
      console.info(`[info]: Cache hit: ${cacheKey}`);
      return JSON.parse(cachedResult) as T[]; // Return cached result
    } else if (typeof cacheKey !== 'string') {
      console.error('[error]: Cache key must be a string.');
      throw new Error('Cache key must be a string.');
    } else {
      console.info(`[info]: Cache miss: ${cacheKey}`);
    }

    // If not cached, fetch from MongoDB
    const result = await this.collection.aggregate<T>(pipeline).toArray();
    await redis.set(cacheKey, JSON.stringify(result) || ''); // Set cache with expiration
    await redis.expire(cacheKey, cacheDuration); // Set expiration time

    console.info('Cache set:', cacheKey);
    // Trigger post-aggregation middleware
    this.schema.triggerMiddleware('aggregate', result);
    await pubsub.publish("DB_CHANGE", { dbChange: { action: "aggregate", result } });
    return result as T[] || [];
  }

  /**
   * Cursor-based pagination using _id comparison instead of skip.
   * @param filter - The filter for documents.
   * @param pageSize - Number of documents per page.
   * @param lastId - Last document _id from the previous page.
   * @returns {Promise<T[]>} Array of documents for the current page.
   * @description This method uses the _id field for pagination, which is more efficient than using skip.
   * 
   */
  async paginatedFind(
    filter: Partial<T>,
    pageSize: number,
    lastId?: string): Promise<T[]> {
    await this.init();
    const query: any = filter;

    if (lastId) {
      query._id = { $gt: new ObjectId(lastId) }; // Fetch only newer documents
    }

    const results = await this.collection.find(query).limit(pageSize).toArray();
    return results.map(({ _id, ...rest }) => rest as unknown as T);
  };

  /**
   * Watches changes in the collection using MongoDB Change Streams.
   * @param {(change: ChangeStreamDocument<T>) => void} callback - A function to invoke when a change occurs.
   * @returns {ChangeStream<T>} The change stream instance.
   */
  watchChanges(callback: (change: ChangeStreamDocument<T>) => void): ChangeStream<T> {
    const changeStream = this.collection.watch();
    changeStream.on("change", callback);
    return changeStream;
  }

  /**
   * Creates an index on the specified fields in the collection.
   * @param {Partial<Record<keyof T, 1 | -1>>} fields - The fields to index.
   * @returns {Promise<void>} Resolves when the index is created.
   */
  async createIndex(fields: Partial<Record<keyof T, 1 | -1>>): Promise<void> {
    await this.init();
    const indexSpecs = Object.entries(fields) as [string, 1 | -1][];
    await this.collection.createIndex(indexSpecs);
  }

  /**
   * Drops an index from the collection by its name.
   * @param {string} indexName - The name of the index to drop.
   * @returns {Promise<void>} Resolves when the index is dropped.
   */
  async dropIndex(indexName: string): Promise<void> {
    await this.init();
    await this.collection.dropIndex(indexName);
  }

  /**
   * Invalidates multiple cache entries matching a pattern.
   * @param {string} pattern - Redis pattern to match keys (supports wildcards).
   * @returns {Promise<number>} Number of keys invalidated.
   */
  static async invalidatePattern(pattern: string): Promise<number> {
    if (!pattern || typeof pattern !== 'string') {
      throw new Error('Pattern must be a non-empty string');
    }

    let deletedCount = 0;
    let cursor = 0;

    try {
      do {
        // Use SCAN to iterate through keys matching the pattern
        const result = await redis.scan(cursor, {
          MATCH: pattern,
          COUNT: 100
        });

        // Extract cursor and keys from the result
        const nextCursor = Array.isArray(result) ? Number(result[0]) : 0;
        const keys = Array.isArray(result) ? result[1] : [];

        if (keys && keys.length > 0) {
          // Delete keys in batches using multi (transaction) for better performance
          const multi = redis.multi();
          keys.forEach(key => multi.del(key));

          const results = await multi.exec() as any;

          // Count successful deletions
          if (results) {
            deletedCount += results.filter((entry: any) => {
              // redis v4 multi.exec() can return array entries as either [err, result] or direct replies
              if (Array.isArray(entry)) {
                const err = entry[0];
                const val = entry[1];
                return !err && val === 1;
              }
              return entry === 1;
            }).length;
          }
        }

        cursor = nextCursor;
      } while (cursor !== 0);

      console.log(`Cache invalidation completed for pattern: ${pattern}, deleted ${deletedCount} keys`);
      return deletedCount;

    } catch (error) {
      console.error('Error invalidating cache pattern:', error);
      throw new Error(`Failed to invalidate cache pattern "${pattern}": ${error}`);
    }
  }

  /**
   * Instance method to invalidate cache patterns for this model's tenant context.
   * @param {string} pattern - Redis pattern to match keys (supports wildcards).
   * @returns {Promise<number>} Number of keys invalidated.
   */
  async invalidateModelPattern(pattern: string): Promise<number> {
    await this.init();

    // Add tenant prefix if in multi-tenant context
    const tenantPrefix = this.tenantId ? `tenant:${this.tenantId}:` : '';
    const fullPattern = `${tenantPrefix}${pattern}`;

    return AbimongoModel.invalidatePattern(fullPattern);
  }

  /**
   * Invalidates the cache for the specified document.
   * @param {T} doc - The document for which to invalidate the cache.
   * @returns {Promise<void>} Resolves when the cache is invalidated.
   */
  async invalidateDocumentCache(doc: T): Promise<void> {
    await this.init();
    const cacheKey = `document:${this.collectionName}:${doc._id}`;
    await redis.del(cacheKey);
  };

  /**
   * Retrieves cache statistics for monitoring and optimization.
   * @param {string} [tenantId] - Optional tenant ID to get tenant-specific stats.
   * @returns {Promise<CacheStats>} Object containing cache statistics.
   */
  static async getCacheStats(tenantId?: string): Promise<any> {
    try {
      const info = await redis.info('memory');
      const keyspaceInfo = await redis.info('keyspace');

      // Get total keys count
      const dbMatch = keyspaceInfo.match(/db0:keys=(\d+)/);
      const totalKeys = dbMatch ? parseInt(dbMatch[1]) : 0;

      // Get memory usage in bytes
      const memoryMatch = info.match(/used_memory:(\d+)/);
      const memoryUsage = memoryMatch ? parseInt(memoryMatch[1]) : 0;

      // Get hit/miss stats using the correct keys
      const hits = await redis.get('cache:stats:hits') || '0';
      const misses = await redis.get('cache:stats:misses') || '0';
      const totalRequests = parseInt(hits) + parseInt(misses);
      const hitRate = totalRequests > 0 ? Math.round((parseInt(hits) / totalRequests) * 100) : 0;
      const missRate = totalRequests > 0 ? Math.round((parseInt(misses) / totalRequests) * 100) : 0;

      // Get tenant-specific keys if tenantId provided
      let tenantKeys = 0;
      if (tenantId) {
        const pattern = `tenant:${tenantId}:*`;
        let cursor = 0;
        do {
          const result = await redis.scan(cursor, { MATCH: pattern, COUNT: 100 });
          const nextCursor = Array.isArray(result) ? Number(result[0]) : 0;
          const keys = Array.isArray(result) ? result[1] : [];
          tenantKeys += keys.length;
          cursor = nextCursor;
        } while (cursor !== 0);
      }

      const stats = {
        totalKeys,
        tenantKeys: tenantId ? tenantKeys : undefined,
        memoryUsage: Math.round(memoryUsage / 1024 / 1024), // Convert to MB
        memoryUsageBytes: memoryUsage,
        hitRate,
        missRate,
        totalHits: parseInt(hits),
        totalMisses: parseInt(misses),
        totalRequests,
        tenantId: tenantId || null,
        timestamp: new Date().toISOString()
      };

      return stats;
    } catch (error) {
      console.error('Error getting cache stats:', error);
      throw new Error(`Failed to get cache stats: ${error}`);
    }
  }

  /**
   * Runs a custom command on the collection.
   * @param {string} command - The command to run.
   * @param {...any} args - The arguments for the command.
   * @returns {Promise<any>} The result of the command.
   */
  async runCommand(command: string, ...args: any[]): Promise<any> {
    await this.init();
    const dbCommand = { [command]: 1, ...args };
    return this.db.command(dbCommand);
  }

  /**
   * Runs the garbage collector for expired documents.
   * @returns {Promise<void>} Resolves when the garbage collection is complete.
   */
  async runGC(): Promise<void> {
    const config = this.schema.getGCConfig();
    if (!config || !config.ttlField || !config.expiresIn) return;
    const expireDate = new Date(Date.now() - Number(config.expiresIn));

    const filter: any = { [config.ttlField]: { $lt: expireDate } };
    if (config.softDelete) filter.deletedAt = null;

    const expiredDocs = await this.collection.find(filter).toArray();

    for (const doc of expiredDocs) {
      if (config.softDelete) {
        await this.collection.updateOne({ _id: doc?._id } as Filter<T>, { $set: { deletedAt: new Date() } as any });
      } else {
        if (config.archiveBeforeDelete) {
          await this.db.collection('abimongo_archives').insertOne({
            ...doc,
            _archivedAt: new Date(),
            _from: this.collection.collectionName
          });
        }
        await this.collection.deleteOne({ _id: doc._id } as Filter<T>);
      }
    }
  }

  /**
   * Starts the automatic garbage collection process.
   * @param {number} intervalMs - The interval in milliseconds for the garbage collection to run.
   */
  startAutoGC(intervalMs = 3600000): void {
    setInterval(() => this.runGC().catch(console.error), intervalMs);
  }

  private static async trackCacheMiss(key: string): Promise<void> {
    try {
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format

      // Use pipeline for atomic operations
      const pipeline = redis.multi();
      pipeline.incr('cache:stats:misses');
      pipeline.incr(`cache:stats:misses:${today}`);
      pipeline.expire(`cache:stats:misses:${today}`, 86400 * 7); // Expire daily stats after 7 days

      await pipeline.exec();
    } catch (error) {
      // Don't throw, just log - cache tracking shouldn't break the app
      console.warn('Failed to track cache miss:', error);
    }
  };

  private static async trackCacheHit(key: string): Promise<void> {
    try {
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format

      // Use pipeline for atomic operations
      const pipeline = redis.multi();
      pipeline.incr('cache:stats:hits');
      pipeline.incr(`cache:stats:hits:${today}`);
      pipeline.expire(`cache:stats:hits:${today}`, 86400 * 7); // Expire daily stats after 7 days

      await pipeline.exec();
    } catch (error) {
      // Don't throw, just log - cache tracking shouldn't break the app
      console.warn('Failed to track cache hit:', error);
    }
  };

  /**
   * Pre-populates cache with frequently accessed data.
   * @param {CacheWarmQuery[]} queries - Array of queries to pre-cache.
   * @returns {Promise<void>} Resolves when cache warming is complete.
   */
  async warmCache(queries?: { filter?: Partial<T>; cacheKey?: string; ttl?: number }[], defaultTtl = 3600): Promise<void> {
    try {
      await this.init();

      if (queries && queries.length > 0) {
        // Warm specific queries
        for (const query of queries) {
          const { filter = {}, cacheKey, ttl = defaultTtl } = query;
          const docs = await this.collection.find(filter as Filter<T>).toArray();

          const key = cacheKey || `${this.collectionName}:${JSON.stringify(filter)}`;
          await AbimongoModel.cacheResult(key, docs, ttl);
        }
      } else {
        // Warm all documents (be careful with large collections)
        const totalDocs = await this.collection.countDocuments();

        if (totalDocs > 1000) {
          console.warn(`Collection ${this.collectionName} has ${totalDocs} documents. Consider using specific queries for cache warming.`);
          return;
        }

        const docs = await this.collection.find({}).toArray();

        // Use Promise.all with batching for better performance
        const batchSize = 50;
        for (let i = 0; i < docs.length; i += batchSize) {
          const batch = docs.slice(i, i + batchSize);
          const cachePromises = batch.map(doc => {
            const cacheKey = `document:${this.collectionName}:${doc._id}`;
            return AbimongoModel.cacheResult(cacheKey, doc, defaultTtl);
          });

          await Promise.all(cachePromises);
        }
      }

      console.log(`Cache warming completed for collection: ${this.collectionName}`);
    } catch (error) {
      console.error(`Failed to warm cache for collection ${this.collectionName}:`, error);
      throw error;
    }
  }

};