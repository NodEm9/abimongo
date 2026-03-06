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
  BulkWriteOptions,
  BulkWriteResult,
} from 'mongodb';
import {
  User,
  Document,
  AbimongoModelOptions,
  EventType,
  DbProvider,
} from '../types';
import { AbimongoSchema } from './AbimongoSchema';
import { AbiMongoError } from '../utils/error/abimongoError-handler';
import { ErrorType } from '../utils/error/errorTypes';
import { Abimongo } from './AbimongoClient'
import { ObjectId } from 'mongodb';
import EventEmitter from 'events';
import { PubSub } from "graphql-subscriptions";
import { MultiTenantManager } from '../tanancy/MultiTenantManager';
import { redis } from '../redis-manager/redisClient';
import { getGCSettings } from '../decorators/gcSettings';
import {
  castId,
  DB_CHANGE_EVENT,
  AbimongoModelRegistry,
  ensureRedis
} from '../utils';
import { ModelContext } from '../types';


const pubsub = new PubSub();


/**
 * Represents a model for MongoDB operations with support for schema validation, middleware, and multi-tenancy.
 * @template T - The type of the document in the collection.
 */
export class AbimongoModel<T extends Document> {
  private _provider!: DbProvider
  private _collectionName!: string;
  private _collectionOverride?: Collection<T>;
  private _schema!: AbimongoSchema<T>;
  private _initialized = false;
  private _defaultCtx?: ModelContext;
  private _gcConfig?: AbimongoModelOptions<T>["gcConfig"];
  private eventEmitter = new EventEmitter();

  constructor(options: AbimongoModelOptions<T>) {
    if (!options) {
      const message = "AbimongoModel options are required.";
      throw AbiMongoError(
        ErrorType.AbiMongoModelError,
        message,
        new Error(message).stack,
        ErrorType.NULL_OR_UNDEFINED
      );
    };

    if (!options.collectionName) {
      const message = "collectionName is required.";
      throw AbiMongoError(
        ErrorType.AbiMongoModelError,
        message,
        new Error(message).stack,
        ErrorType.NULL_OR_UNDEFINED
      );
    }

    this._collectionName = options.collectionName;
    this._schema = options.schema ?? new AbimongoSchema<T>({} as Record<keyof T, any>);

    this._provider = options.provider ?? Abimongo.init();

    this._collectionOverride = options.collection;
    this._gcConfig = options.gcConfig;

    if (options.ctx?.db) {
      const fixedDb = options.ctx.db;
      this._provider = {
        db: async () => fixedDb,
      };
    }

    if (options.ctx?.tenantId || options.ctx?.dbName) {
      this._defaultCtx = {
        tenantId: options.ctx?.tenantId,
        dbName: options.ctx?.dbName,
      };
    }

    const gcMeta = getGCSettings(options.schema);
    if (gcMeta) {
      AbimongoModelRegistry.registerModel(this);
    }

    // Initialize middleware hooks
    this.initMiddleware();
  }

  private resolveCtx(ctx?: ModelContext): ModelContext | undefined {
    return ctx ?? this._defaultCtx;
  }

  // private async getCollection(ctx?: ModelContext): Promise<Collection<T>> {
  //   if (this._collectionOverride) return this._collectionOverride;
  //   const db = await this._provider.db(this.resolveCtx(ctx));
  //   return db.collection<T>(this._collectionName);
  // };

  private async getCollection(ctx?: ModelContext): Promise<Collection<T>> {
    if (this._collectionOverride) {
      return this._collectionOverride;
    }

    this.ensureConfigured();

    // if (!this._provider || typeof this._provider.db !== "function") {
    //   throw new Error(
    //     "AbimongoModel: provider is invalid. Expected a DbProvider with a db(ctx) method."
    //   );
    // }

    const db = await this._provider.db(this.resolveCtx(ctx));

    if (!db || typeof (db as any).collection !== "function") {
      throw new Error(
        `AbimongoModel: provider.db() did not return a valid Db instance for collection "${this._collectionName}".`
      );
    }

    return db.collection<T>(this._collectionName);
  }

  private async getResolvedTenant(tenantId: string): Promise<MongoClient> {
    const client = await MultiTenantManager.getClient(tenantId);
    if (!client) throw new Error(`Tenant "${tenantId}" is not registered.`);
    return client;
  }

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
  };

  private ensureConfigured(): void {
    if (!this._collectionName || typeof this._collectionName !== "string") {
      throw new Error("AbimongoModel: collectionName is not configured.");
    }

    if (!this._provider || typeof this._provider.db !== "function") {
      throw new Error(
        "AbimongoModel: provider is not configured. Provide a valid DbProvider with a db(ctx) method."
      );
    }
  }

  /**
   * Initializes the database connection and collection.
   * @throws {Error} If the collection name is not provided.
   */
  async init(): Promise<void> {
    if (this._initialized) return;

    try {
      this.ensureConfigured();

      if (!this._schema) {
        this._schema = new AbimongoSchema<T>({} as Record<keyof T, any>);
      }

      await this.getCollection();

      if (!this._provider) throw new Error("AbimongoModel: provider not set.");
      if (!this._collectionName) throw new Error("AbimongoModel: collectionName not set.");
      // Ensure schema exists
      if (!this._schema) this._schema = this.schema ?? new AbimongoSchema<T>({} as Record<keyof T, any>);


      // Initialize middleware hooks once
      this.initMiddleware?.();
      this.getCollection();

      // 5) Optional: ensure GC index (if enabled in schema metadata)
      const gcMeta = getGCSettings(this._schema);
      if (gcMeta?.gcConfig?.enableGC) {
        await this.ensureGCIndex(gcMeta.gcConfig);
      }

      this._initialized = true;
    } catch (error: any) {
      throw AbiMongoError(
        ErrorType.AbiMongoModelError,
        `Failed to initialize AbimongoModel: ${error?.message ?? String(error)}`,
        error?.stack,
        ErrorType.INITIALIZATION_ERROR
      );
    }
  };

  bind(ctx: ModelContext): AbimongoModel<T> {
    const clone = Object.create(this) as AbimongoModel<T>;
    clone._defaultCtx = { ...this._defaultCtx, ...ctx };
    return clone;
  }

  async registerModel(options: AbimongoModelOptions<T>): Promise<void> {
    const { ctx, collectionName, schema, collection } = options;

    if (!collectionName) throw new Error("Collection name is required.");

    this._collectionName = collectionName;

    // explicit collection override (tests / advanced)
    if (collection) {
      this._collectionOverride = collection;
    }

    // resolveDb priority: ctx.db > tenantId > (already set / default)
    if (ctx?.db) {
      this._provider.db = async () => ctx.db!;
    } else if (ctx?.tenantId) {
      const client = await this.getResolvedTenant(ctx.tenantId);
      this._provider.db = async () => client?.db() as Db;
    } else {
      // if _provider.db is not set elsewhere, this should error
      if (!this._provider.db) {
        throw new Error("AbimongoModel: p_provider.db is not configured (db/client/tenantId/AbimongoClient required).");
      }
    }

    this._schema = schema ?? new AbimongoSchema<T>({} as any);

    await this.init();
  }

  private async ensureGCIndex(gc: NonNullable<AbimongoModelOptions<T>['gcConfig']>): Promise<void> {
    if (this._gcConfig?.enableGC && this._gcConfig.ttl) {
      const col = await this.getCollection();
      const field =
        this._gcConfig.field ??
        this._gcConfig.updatedAtField ??
        this._gcConfig.createdAtField ??
        "updatedAt";

      await col.createIndex(
        { [field]: 1 },
        {
          expireAfterSeconds: this._gcConfig.ttl,
          name:
            this._gcConfig.indexName ??
            `${this._collectionName}_${field}_ttl`,
          background: true,
        }
      );
    }
  }

  /**
   * Gets the schema associated with this model.
   * @returns {AbimongoSchema<T>} The schema for the model.
   */
  get schema(): AbimongoSchema<T> {
    return this._schema as AbimongoSchema<T>;
  }
  private validate(doc: OptionalUnlessRequiredId<T>): void {
    if (this._schema) {
      this._schema.validate(doc);
    }
  }

  /**
   * Validates a document against the schema.
   * @param {OptionalUnlessRequiredId<T>} doc - The document to validate.
   * @returns {Promise<T>} The validated document.
   */
  // public validate(doc: OptionalUnlessRequiredId<T>): Promise<T> {
  //   for (const key in this.schema.getSchema()) {
  //     const field = this.schema.getSchema()[key];
  //     if (field.required && !(key in doc)) {
  //       console.error(`[error]: Field "${key}" is required but not provided.`);
  //       throw new Error(`Field "${key}" is required but not provided.`);
  //     }
  //     if (field.type === ObjectId && key in doc) {
  //       (doc as any)[key] = castId(doc[key]);
  //     }
  //     if (field.type === Array && key in doc) {
  //       doc[key] = doc[key].map(castId);
  //     }
  //     if (field.type === Object && key in doc) {
  //       for (const nestedKey in field.type.schema.getSchema) {
  //         const nestedField = field.type.schema.getSchema[nestedKey];
  //         if (nestedField.type.value === ObjectId && nestedKey in doc[key]) {
  //           doc[key][nestedKey] = castId(doc[key][nestedKey]);
  //         }
  //       }
  //     }

  //     if (key in doc && field.type === ObjectId) {
  //       (doc as any)[key] = castId(doc[key]);
  //     }
  //   };
  //   return doc as Promise<T>;
  // }

  /**
   * Creates a new document in the collection.
   * @param {OptionalUnlessRequiredId<T>} doc - The document to create.
   * @returns {Promise<T>} The created document with its `_id`.
   */
  async create(doc: OptionalUnlessRequiredId<T>, ctx?: ModelContext): Promise<T> {
    await this.init();
    this.validate(doc);

    await this.schema.executeHooks('pre-save', doc);
    this.schema.validate(doc);

    const col = await this.getCollection(ctx);
    const result = await col.insertOne(doc, ctx?.session ? { session: ctx.session } : undefined);

    await this._schema.executeHooks("post-save", doc);

    // Use collection name string for event key, not the collection object
    await pubsub.publish(
      `${DB_CHANGE_EVENT}_${this._collectionName}`,
      JSON.stringify({ documentInserted: { action: "create", doc } })
    );

    return { ...doc, _id: result.insertedId } as T;
  }

  /**
   * Finds documents in the collection that match the filter.
   * @param {Filter<T>} [filter={}] - The filter to apply.
   * @returns {Promise<T[]>} An array of matching documents.
   */
  async find(filter: Filter<T> = {}, ctx?: ModelContext): Promise<T[]> {
    await this.init();

    const col = await this.getCollection(ctx);
    const cursor = col.find(filter, ctx?.session ? { session: ctx.session } : undefined);

    const results = await cursor.toArray();
    return results?.length
      ? results.map(r => (
        { ...r, _id: r._id.toString() } as T & { _id: string } // Convert ObjectId to string
      ))
      : [] as T[];
  }

  /**
   * Finds a single document in the collection that matches the filter.
   * @param {Filter<T>} filter - The filter to apply.
   * @returns {Promise<T | null>} The matching document or `null` if not found.
   * @throws {Error} If the filter is not a valid object.
   */
  async findOne(filter: Filter<T>, ctx?: ModelContext): Promise<T | null> {
    await this.init();
    if (!filter || typeof filter !== 'object') {
      console.error('[error]: Filter must be a valid object.');
      throw new Error('Filter must be a valid object.');
    }

    const col = await this.getCollection(ctx);
    const result = await col?.findOne(filter, ctx?.session ? { session: ctx.session } : undefined);
    return result as T | null;
  }

  /**
   * Updates a single document in the collection.
   * @param {Filter<T>} filter - The filter to find the document.
   * @param {UpdateFilter<T>} update - The update operation to apply.
   * @returns {Promise<void>} Resolves when the update is complete.
   */
  async updateOne(
    filter: Filter<T>,
    update: UpdateFilter<T>,
    ctx?: ModelContext
  ): Promise<void> {
    await this.init();

    await this.schema.executeHooks('pre-update', { filter, update });
    const col = await this.getCollection(ctx);

    await col.updateOne(filter, update, ctx?.session ? { session: ctx.session } : undefined);
    await this.schema.executeHooks('post-update', { filter, update });

    await pubsub.publish(`${DB_CHANGE_EVENT}`, JSON.stringify({ documentUpdated: { action: "update", filter, update } }));
  }

  /**
   * Performs a bulk insert of documents into the collection.
   * @param {OptionalUnlessRequiredId<T>[]} docs - An array of documents to insert.
   * @returns {Promise<void>} Resolves when the bulk insert is complete.
   */
  async bulkInsert(docs: OptionalUnlessRequiredId<T>[], ctx?: ModelContext): Promise<void> {
    await this.init();
    if (!docs || docs.length === 0) return;
    this.validate(docs[0][0]); // Validate the first document
    await this.schema.executeHooks('pre-save', docs);
    const col = await this.getCollection(ctx);
    await col.insertMany(docs, { ordered: false, session: ctx?.session });
    await pubsub.publish(`${DB_CHANGE_EVENT}`, { documentInserted: { action: "bulkInsert", docs } });
  }

  /**
   * Performs a bulk update of multiple documents in the collection.
   * @param {Array<{ filter: Partial<T>; update: Partial<T> }>} updates - Array of update operations.
   * @returns {Promise<void>} Resolves when the bulk update is complete.
   */
  async bulkUpdate(updates: { filter: Partial<T>; update: Partial<T> }[], ctx?: ModelContext): Promise<void> {
    await this.init();
    const bulkOps: AnyBulkWriteOperation<T>[] = updates.map(({ filter, update }) => ({
      updateOne: { filter: filter as Filter<T>, update: { $set: update } },
    }))
    const col = await this.getCollection(ctx);
    await col.bulkWrite(bulkOps, { ordered: false, session: ctx?.session });
    await pubsub.publish(`${DB_CHANGE_EVENT}`, { documentInserted: { action: "bulkUpdate", updates } });

  }

  /**
   * Middleware for handling cascading deletes, aggregate, save and updates.
   * @returns {void}
   * @private 
   */
  private initMiddleware() {
    if (!this._schema) return;
    this.schema.pre('save', async (doc: OptionalUnlessRequiredId<T>) => {
      const relationships = this.schema.getRelationships();
      for (const { ref, localField } of relationships) {
        const relatedCollection = (await this.getCollection()).db?.collection(ref);
        const filter = { [localField]: doc._id };
        await relatedCollection?.updateMany(filter, { $set: { [localField]: doc._id } });
      }
    });

    this.schema.pre('deleteOne', async (doc: OptionalUnlessRequiredId<T>) => {
      const relationships = this.schema.getRelationships();
      for (const { ref, localField } of relationships) {
        const relatedCollection = (await this.getCollection()).db?.collection(ref);
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
  async deleteOne(filter: Filter<T>, ctx?: ModelContext): Promise<void> {
    await this.init();
    const col = await this.getCollection(ctx);
    const doc = await col.findOne(filter, ctx?.session ? { session: ctx.session } : undefined);
    if (doc) {
      // Trigger pre-delete middleware
      await this.schema.triggerMiddleware('deleteOne', doc);
      await col.deleteOne(filter, { session: ctx?.session });
      await pubsub.publish(`${DB_CHANGE_EVENT}`, { documentDeleted: { action: "delete", filter } });
    }
  };

  /**
   * Deletes multiple documents from the collection.
   * @param {Filter<T>} filter - The filter to find the documents to delete.
   * @returns {Promise<void>} Resolves when the documents are deleted.
   */
  async deleteMany(filter: Filter<T>, ctx?: ModelContext): Promise<void> {
    await this.init();

    const col = await this.getCollection(ctx);
    const docs = await col.find(filter, ctx?.session ? { session: ctx.session } : undefined).toArray();
    if (docs.length > 0) {
      // Trigger pre-delete middleware
      await this.schema.triggerMiddleware('deleteMany', docs);
      await col.deleteMany(filter, { session: ctx?.session });
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

  async createWithTransaction(
    doc: OptionalUnlessRequiredId<T>,
    ctx?: ModelContext
  ): Promise<T> {
    await this.init();

    return this.withTransaction(async (session) => {
      this.validate(doc);
      await this._schema.executeHooks?.("pre-save", doc);

      const col = await this.getCollection(ctx);

      const result = await col.insertOne(
        doc,
        { session }
      );

      const createdDoc = {
        ...doc,
        _id: result.insertedId,
      } as T;

      await this._schema.executeHooks?.("post-save", createdDoc);

      await pubsub.publish(
        `${DB_CHANGE_EVENT}_${this._collectionName}`,
        JSON.stringify({
          documentInserted: {
            action: "create",
            doc: createdDoc,
          },
        })
      );

      return createdDoc;
    }, ctx);
  };

  async bulkWriteWithTransaction(
    operations: AnyBulkWriteOperation<T>[],
    options: BulkWriteOptions = {},
    ctx?: ModelContext
  ): Promise<BulkWriteResult> {
    await this.init();

    return this.withTransaction(async (session) => {
      const col = await this.getCollection(ctx);

      await this._schema.executeHooks?.("pre-bulkWrite", operations);

      const result = await col.bulkWrite(
        operations,
        { ...options, session }
      );

      await this._schema.executeHooks?.("post-bulkWrite", result);

      await pubsub.publish(
        `${DB_CHANGE_EVENT}_${this._collectionName}`,
        JSON.stringify({
          bulkWrite: {
            action: "bulkWrite",
            result,
          },
        })
      );

      return result;
    }, ctx);
  }

  /**
   * Deletes a document with a transaction.
   * @param {Filter<T>} filter - The filter to find the document to delete.
   * @returns {Promise<void>} Resolves when the document is deleted.
   */

  async deleteWithTransaction(
    filter: Filter<T>,
    ctx?: ModelContext
  ): Promise<boolean> {
    await this.init();

    return this.withTransaction(async (session) => {
      const col = await this.getCollection(ctx);

      const existingDoc = await col.findOne(
        filter,
        { session }
      );

      await this._schema.executeHooks?.("pre-delete", existingDoc);
      const result = await col.deleteOne(
        filter,
        { session }
      );

      await this._schema.executeHooks?.("post-delete", existingDoc);
      return result.deletedCount === 1;

    }, ctx);
  }
  // async deleteWithTransaction(filter: Filter<T>, ctx?: ModelContext): Promise<void> {
  //   await this.init();
  //   let session: ClientSession | undefined;
  //   session = (await this._provider.db()).client.startSession(ctx?.session ? ctx.session : undefined);
  //   session?.startTransaction();
  //   try {
  //     const col = await this.getCollection(ctx);
  //     const doc = await col.findOne(filter, ctx?.session ? { session: ctx.session } : undefined);
  //     if (doc) {
  //       await this.schema.triggerMiddleware('deleteOne', doc);
  //       await col.deleteOne(filter, { session });
  //       await session?.commitTransaction();
  //     }
  //   } catch (error) {
  //     await session?.abortTransaction();
  //     throw error;
  //   } finally {
  //     session?.endSession();
  //   }
  // }

  /**
   * Updates a document with a transaction.
   * @param {Filter<T>} filter - The filter to find the document to update.
   * @param {UpdateFilter<T>} update - The update operation to perform.
   * @returns {Promise<void>} Resolves when the document is updated.
   */
  async updateWithTransaction(
    filter: Filter<T>,
    update: UpdateFilter<T>,
    ctx?: ModelContext
  ): Promise<T | null> {
    await this.init();

    return this.withTransaction(async (session) => {
      const col = await this.getCollection(ctx);

      const existingDoc = await col.findOne(filter, { session });
      if (!existingDoc) return null;

      const updatedDoc = {
        ...existingDoc,
        ...(update.$set || {}),
      };

      this.validate(updatedDoc as OptionalUnlessRequiredId<T>);
      await this._schema.executeHooks?.("pre-update", updatedDoc);

      await col.updateOne(filter, update, { session });

      const result = await col.findOne(filter, { session });

      await this._schema.executeHooks?.("post-update", result);

      return result
        ? ({
          ...result,
          _id: result._id?.toString?.() ?? result._id,
        } as T)
        : null;
    }, ctx);
  }
  // async updateWithTransaction(filter: Filter<T>, update: UpdateFilter<T>, ctx?: ModelContext): Promise<void> {
  //   await this.init();
  //   let session: ClientSession | undefined;
  //   session = (await this._provider.db()).client.startSession(ctx?.session ? ctx.session : undefined);
  //   session?.startTransaction();
  //   try {
  //     const col = await this.getCollection(ctx);
  //     await col.updateOne(filter, update, { session });
  //     await session?.commitTransaction();
  //   } catch (error) {
  //     await session?.abortTransaction();
  //     throw error;
  //   } finally {
  //     session?.endSession();
  //   }
  // }

  private async getSession(ctx?: ModelContext): Promise<ClientSession> {
    if (!this._provider?.startSession) {
      throw new Error(
        "Transaction support is not available. Provider does not implement startSession()."
      );
    }

    return this._provider.startSession(ctx);
  }

  /**
   * Finds a document in the cache by its key.
   * @param {string} key - The cache key.
   * @returns {Promise<any>} The cached result or `null` if not found.
   */
  async findCached(key: string): Promise<any> {
    const result = await ensureRedis.call(key);

    if (result) {
      await AbimongoModel.trackCacheHit(key);
      return result;
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
    try {
      await redis.set(key, data, ttl);
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
  async findOneAndUpdate(
    filter: Filter<T>,
    update: UpdateFilter<T>,
    ctx?: ModelContext
  ): Promise<T | null> {
    await this.init();
    const col = await this.getCollection(ctx);
    const result = await col.findOneAndUpdate(filter, update, { returnDocument: 'after' });
    return result as T | null;
  }

  /**
   * Finds a document and deletes it from the collection.
   * @param {Filter<T>} filter - The filter to find the document.
   * @returns {Promise<T | null>} The deleted document or `null` if not found.
   */
  async findOneAndDelete(filter: Filter<T>, ctx: ModelContext): Promise<T | null> {
    await this.init();
    const col = await this.getCollection(ctx);
    const result = await col.findOneAndDelete(filter);
    return result as T | null;
  }

  /**
   * Finds a document and replaces it with a new document.
   * @param {Filter<T>} filter - The filter to find the document.
   * @param {T} replacement - The new document to replace the found document.
   * @returns {Promise<T | null>} The replaced document or `null` if not found.
   */
  async findOneAndReplace(filter: Filter<T>, replacement: T, ctx?: ModelContext): Promise<T | null> {
    await this.init();
    const col = await this.getCollection(ctx);
    const result = await col.findOneAndReplace(filter, replacement, { returnDocument: 'after' });
    return result as T | null;
  }

  /**
   * Finds a document and upserts it (inserts if not found).
   * @param {Filter<T>} filter - The filter to find the document.
   * @param {UpdateFilter<T>} update - The update operation to perform.
   * @returns {Promise<T | null>} The updated or inserted document.
   */
  async findOneAndUpsert(
    filter: Filter<T>,
    update: UpdateFilter<T>,
    ctx?: ModelContext
  ): Promise<T | null> {
    await this.init();
    const col = await this.getCollection(ctx);
    const result = await col.findOneAndUpdate(filter, update, { upsert: true, returnDocument: 'after', session: ctx?.session });
    return result as T | null;
  }

  /**
   * Finds a document and upserts it (inserts if not found) with a transaction.
   * @param {Filter<T>} filter - The filter to find the document.
   * @param {UpdateFilter<T>} update - The update operation to perform.
   * @returns {Promise<T | null>} The updated or inserted document.
   */
  async findOneAndUpsertWithTransaction(
    filter: Filter<T>,
    update: UpdateFilter<T>,
    ctx?: ModelContext
  ): Promise<T | null> {
    await this.init();

    return this.withTransaction(async (session) => {
      const col = await this.getCollection(ctx);

      const result = await col.findOneAndUpdate(filter, update, { upsert: true, returnDocument: 'after', session });
      await this._schema.executeHooks?.("update", result);
      return result as T | null;
    }, ctx);
  }

  /**
   * Finds a document and upserts it (inserts if not found) with a transaction and user authorization.
   * @param {Filter<T>} filter - The filter to find the document.
   * @param {UpdateFilter<T>} update - The update operation to perform.
   * @param {User} user - The user performing the operation.
   * @returns {Promise<T | null>} The updated or inserted document.
   */
  async findOneAndUpsertWithTransactionSecure(
    filter: Filter<T>,
    update: UpdateFilter<T>,
    user: User,
    ctx?: ModelContext
  ): Promise<T | null> {
    await this.init();

    return this.withTransaction(async (session) => {
      if (user.role !== 'admin') throw new Error('Unauthorized');
      const col = await this.getCollection(ctx);

      const result = await col.findOneAndUpdate(filter, update, { upsert: true, returnDocument: 'after', session });
      await this._schema.executeHooks?.("update", result);

      return result as T | null;
    }, ctx);
  }


  /**
   * Deletes a document securely with user authorization.
   * @param {Filter<T>} filter - The filter to find the document.
   * @param {User} user - The user performing the operation.
   * @returns {Promise<void>} Resolves when the document is deleted.
   */
  async deleteSecure(
    filter: Filter<T>,
    user: User,
    ctx?: ModelContext
  ): Promise<void> {
    await this.init();
    if (user.role !== 'admin') throw new Error('Unauthorized');
    const col = await this.getCollection(ctx);
    await col.deleteOne(filter);
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
    session?: ClientSession,
    ctx?: ModelContext
  ): Promise<U[]> {
    try {
      await this.init();
      const col = await this.getCollection(ctx);
      const cursor = col.aggregate<U>(pipeline, { ...options, session: ctx?.session || session });
      this.schema.triggerMiddleware('aggregate', cursor);
      this.eventEmitter.emit('aggregate', cursor.bufferedCount());

      await pubsub.publish("DB_CHANGE", { dbChange: { action: "aggregate", pipeline } });
      return await cursor.toArray();
    } catch (error) {
      console.error(`Aggregation error: ${error}`);
      throw error;
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
    options: AggregateOptions = {},
    ctx?: ModelContext
  ): Promise<U[]> {
    await this.init();

    return this.withTransaction(async (session) => {
      const col = await this.getCollection(ctx);

      const cursor = col.aggregate<U>(pipeline, {
        ...options,
        session,
      });

      const result = await cursor.toArray();

      await this._schema.executeHooks?.("aggregate", result);

      await pubsub.publish(
        `${DB_CHANGE_EVENT}_${this._collectionName}`,
        JSON.stringify({
          aggregate: {
            action: "aggregate",
            result,
          },
        })
      );

      return result as U[];
    }, ctx);
  }

  async runInTransaction<T>(
    ctx?: ModelContext
  ): Promise<T> {
    await this.init();

    return this.withTransaction(async (session) => {
      const col = await this.getCollection(ctx);
      const cursor = col.find({}, { session });
      const result = await cursor.toArray();
      if (!result) throw new Error('Transaction failed: No results found');

      this.schema.triggerMiddleware('transaction', result);
      await pubsub.publish('DB_CHANGE', { dbChange: { action: 'transaction', result } });
      return result as unknown as T;
    }, ctx);
  }

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
    const col = await this.getCollection();
    return col.aggregate<U>(pipeline, options).stream();
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
    const col = await this.getCollection();
    const result = await col.aggregate<T>(pipeline).toArray();
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
   * This method uses the _id field for pagination, which is more efficient than using skip.
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

    const col = await this.getCollection();
    const results = await col.find(query).limit(pageSize).toArray();
    return results.map(({ _id, ...rest }) => rest as unknown as T);
  };

  /**
   * Watches changes in the collection using MongoDB Change Streams.
   * @param {(change: ChangeStreamDocument<T>) => void} callback - A function to invoke when a change occurs.
   * @returns {ChangeStream<T>} The change stream instance.
   */
  async watchChanges(callback: (change: ChangeStreamDocument<T>) => void): Promise<ChangeStream<T>> {
    const col = await this.getCollection();
    const changeStream = col.watch();
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
    const col = await this.getCollection();
    await col.createIndex(indexSpecs);
  }

  /**
   * Drops an index from the collection by its name.
   * @param {string} indexName - The name of the index to drop.
   * @returns {Promise<void>} Resolves when the index is dropped.
   */
  async dropIndex(indexName: string): Promise<void> {
    await this.init();
    const col = await this.getCollection();
    await col.dropIndex(indexName);
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

  getContext(): { ctx: ModelContext } {
    return { ctx: {} as ModelContext };
  }

  /**
   * Instance method to invalidate cache patterns for this model's tenant context.
   * @param {string} pattern - Redis pattern to match keys (supports wildcards).
   * @returns {Promise<number>} Number of keys invalidated.
   */
  async invalidateModelPattern(pattern: string, ctx?: ModelContext): Promise<number> {
    await this.init();

    const tenantPrefix = ctx?.tenantId ? `tenant:${ctx.tenantId}:` : "";
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
    const cacheKey = `document:${this._collectionName}:${doc._id}`;
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
    const col = await this.getCollection();
    return col.db.command(dbCommand);
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

    const col = await this.getCollection();
    const expiredDocs = await col.find(filter).toArray();

    for (const doc of expiredDocs) {
      if (config.softDelete) {
        await col.updateOne({ _id: doc?._id } as Filter<T>, { $set: { deletedAt: new Date() } as any });
      } else {
        if (config.archiveBeforeDelete) {
          await col.db.collection('abimongo_archives').insertOne({
            ...doc,
            _archivedAt: new Date(),
            _from: col.collectionName
          });
        }
        await col.deleteOne({ _id: doc._id } as Filter<T>);
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
          const col = await this.getCollection();
          const docs = await col.find(filter as Filter<T>).toArray();

          const key = cacheKey || `${this._collectionName}:${JSON.stringify(filter)}`;
          await AbimongoModel.cacheResult(key, docs, ttl);
        }
      } else {
        // Warm all documents (be careful with large collections)
        const col = await this.getCollection();
        const totalDocs = await col.countDocuments();

        if (totalDocs > 1000) {
          console.warn(`Collection ${this._collectionName} has ${totalDocs} documents. Consider using specific queries for cache warming.`);
          return;
        }

        const docs = await col.find({}).toArray();

        // Use Promise.all with batching for better performance
        const batchSize = 50;
        for (let i = 0; i < docs.length; i += batchSize) {
          const batch = docs.slice(i, i + batchSize);
          const cachePromises = batch.map(doc => {
            const cacheKey = `document:${this._collectionName}:${doc._id}`;
            return AbimongoModel.cacheResult(cacheKey, doc, defaultTtl);
          });

          await Promise.all(cachePromises);
        }
      }

      console.log(`Cache warming completed for collection: ${this._collectionName}`);
    } catch (error) {
      console.error(`Failed to warm cache for collection ${this._collectionName}:`, error);
      throw error;
    }
  }

  private async withTransaction<R>(
    operation: (session: ClientSession) => Promise<R>,
    ctx?: ModelContext
  ): Promise<R> {
    const session = await this.getSession(ctx);
    session.startTransaction();

    try {
      const result = await operation(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

};