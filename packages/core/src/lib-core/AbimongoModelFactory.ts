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
  ChangeStreamDocument,
  ChangeStream,
  BulkWriteOptions,
  BulkWriteResult,
  ObjectId,
} from 'mongodb';
import type { FindOneAndDeleteOptions, WithId } from 'mongodb';
import {
  User,
  Document,
  AbimongoModelOptions,
  EventType,
  DbProvider,
  ModelResult,
  ModelResultArray,
  AbimongoMiddlewareOperation,
  AbimongoMiddlewareHandler,
  AbimongoMiddlewareContext,
} from '../types';
import { AbimongoSchema } from './AbimongoSchema';
import { AbiMongoError } from '../utils/error/abimongoError-handler';
import { ErrorType } from '../utils/error/errorTypes';
import { Abimongo } from './AbimongoClient'
import EventEmitter from 'events';
import { PubSub } from "graphql-subscriptions";
import { MultiTenantManager, TenantConfig } from '../tanancy/MultiTenantManager';
import { redis } from '../redis-manager/redisClient';
import { getGCSettings } from '../decorators/gcSettings';
import {
  DB_CHANGE_EVENT,
  AbimongoModelRegistry,
  ensureRedis
} from '../utils';
import { ModelContext } from '../types';
import { AbimongoContext } from '../context/AbimongoContext';
import { measureQuery } from '../instrumentation/measureQueryWithErrors';
import { debugLog } from '../debug/debugLog';
import { runManualTransaction } from '../context';


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

  private beforeMiddlewares = new Map<
    AbimongoMiddlewareOperation,
    AbimongoMiddlewareHandler<T>[]
  >();

  private afterMiddlewares = new Map<
    AbimongoMiddlewareOperation,
    AbimongoMiddlewareHandler<T>[]
  >();

  private _softDeleteConfig?: {
    deletedAtField: string;
    isDeletedField: string;
  };

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

  private mergeCtx(ctx?: ModelContext): ModelContext | undefined {
    const runtimeCtx = AbimongoContext.get();

    const merged: ModelContext = {
      tenantId: ctx?.tenantId ?? this._defaultCtx?.tenantId ?? runtimeCtx.tenantId,
      dbName: ctx?.dbName ?? this._defaultCtx?.dbName ?? runtimeCtx.dbName,
      db: ctx?.db ?? this._defaultCtx?.db,
      collectionName:
        ctx?.collectionName ??
        this._defaultCtx?.collectionName ??
        runtimeCtx.collectionName,
      config: ctx?.config ?? this._defaultCtx?.config,
      session: ctx?.session ?? this._defaultCtx?.session ?? runtimeCtx.session
    };

    return Object.values(merged).some(value => value !== undefined)
      ? merged
      : undefined;
  }

  private async getCollection(ctx?: ModelContext): Promise<Collection<T>> {
    if (this._collectionOverride) {
      return this._collectionOverride;
    }

    this.ensureConfigured();

    const db = await this.resolveDb(ctx);
    const collectionName = this.resolveCollectionName(ctx);

    debugLog('Resolved collection', {
      collectionName,
      dbName: db.databaseName,
      tenantId: this.mergeCtx(ctx)?.tenantId
    });

    return db.collection<T>(collectionName);
  }

  private getResolvedTenant(tenantId: string): TenantConfig {
    const tenant = MultiTenantManager.getTenant(tenantId);
    if (!tenant) {
      throw new Error(`Tenant "${tenantId}" is not registered.`);
    }
    return tenant;
  }

  private async resolveDb(ctx?: ModelContext): Promise<Db> {
    const resolvedCtx = this.mergeCtx(ctx);

    if (resolvedCtx?.db) {
      return resolvedCtx.db;
    }

    if (resolvedCtx?.tenantId) {
      const tenant = this.getResolvedTenant(resolvedCtx.tenantId);
      const client = await MultiTenantManager.getClient(resolvedCtx.tenantId);

      if (!client) {
        throw new Error(`MongoClient for tenant "${resolvedCtx.tenantId}" is not available.`);
      }

      const dbName = resolvedCtx.dbName ?? tenant.dbName;
      if (!dbName) {
        throw new Error(`No database name configured for tenant "${resolvedCtx.tenantId}".`);
      }

      return client.db(dbName);
    }

    const db = await this._provider.db(resolvedCtx);

    if (!db || typeof (db as any).collection !== 'function') {
      throw new Error(
        `AbimongoModel: provider.db() did not return a valid Db instance for collection "${this._collectionName}".`
      );
    }

    return db;
  }

  private resolveCollectionName(ctx?: ModelContext): string {
    const resolvedCtx = this.mergeCtx(ctx);
    const collectionName = resolvedCtx?.collectionName ?? this._collectionName;

    if (!collectionName || typeof collectionName !== 'string' || !collectionName.trim()) {
      throw new Error('AbimongoModel: collectionName is not configured.');
    }

    return collectionName.trim();
  }

  private resolveSession(ctx?: ModelContext): ClientSession | undefined {
    return this.mergeCtx(ctx)?.session;
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

    if (!collectionName) {
      throw new Error('Collection name is required.');
    }

    this._collectionName = collectionName;
    this._collectionOverride = collection;
    this._schema = schema ?? new AbimongoSchema<T>({} as any);

    if (ctx) {
      this._defaultCtx = {
        ...this._defaultCtx,
        ...ctx,
      };
    }

    this.ensureConfigured();
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

  getSchema(): AbimongoSchema<T> {
    return this.schema;
  }

  /**
   * Validates a document against the schema.
   * @param {OptionalUnlessRequiredId<T>} doc - The document to validate.
   * @returns {Promise<T>} The validated document.
   */
  private validate(doc: OptionalUnlessRequiredId<T>): void {
    if (this._schema) {
      this._schema.validate(doc);
    }
  }

  async validateAsync(doc: OptionalUnlessRequiredId<T>): Promise<T> {
    if (this._schema) {
      await this._schema.validateAsync(doc);
    }
    return doc as T;
  }

  /**
 * Middleware for handling cascading deletes, aggregate, save and updates.
 * @returns {void}
 * @private 
 */
  private initMiddleware() {
    if (!this._schema) return;
    this._schema.pre('pre-save', async (doc: OptionalUnlessRequiredId<T>) => {
      const relationships = this._schema.getRelationships() ?? [];
      for (const { ref, localField } of relationships) {
        const relatedCollection = (await this.getCollection()).db?.collection(ref);
        const filter = { [localField]: doc._id };
        await relatedCollection?.updateMany(filter, { $set: { [localField]: doc._id } });
      }
    });

    this._schema.post('post-save', async (doc: T) => {
      const relationships = this._schema.getRelationships() ?? [];
      for (const { ref, localField } of relationships) {
        const relatedCollection = (await this.getCollection()).db?.collection(ref);
        const filter = { [localField]: doc._id };
        await relatedCollection?.updateOne(filter, { $set: { [localField]: doc._id } });
      }
      await pubsub.publish("DB_CHANGE", { dbChange: { action: "save", doc } });
    });

    this._schema.post('post-update', async ({ filter, update }) => {
      const relationships = this._schema.getRelationships() ?? [];
      for (const { ref, localField } of relationships) {
        const relatedCollection = (await this.getCollection()).db?.collection(ref);
        const filter = { [localField]: update.$set?._id };
        await relatedCollection?.updateOne(filter, { $set: { [localField]: update.$set?._id } });
      }
      await pubsub.publish("DB_CHANGE", { dbChange: { action: "update", filter, update } });
    });

    this._schema.pre('deleteOne', async (doc: OptionalUnlessRequiredId<T>) => {
      const relationships = this._schema.getRelationships() ?? [];
      for (const { ref, localField } of relationships) {
        const relatedCollection = (await this.getCollection()).db?.collection(ref);
        const filter = { [localField]: doc._id };
        await relatedCollection?.deleteMany(filter);
      }
    });

    this._schema.pre('aggregate', async (pipeline: Array<Record<string, any>>) => {
      const relationships = this._schema.getRelationships() ?? [];
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

    this._schema.post('aggregate', async (result: Document[]) => {
      for (const doc of [result]) {
        const relationships = this._schema.getRelationships() ?? [];
        for (const { ref } of relationships) {
          delete doc[Number(ref)];
        }
        await pubsub.publish("DB_CHANGE", { dbChange: { action: "aggregate", result } });
      }
    });
  };

  /**
   * Creates a new document in the collection.
   * @param {OptionalUnlessRequiredId<T>} doc - The document to create.
   * @returns {Promise<T>} The created document with its `_id`.
   */
  async create(
    doc: OptionalUnlessRequiredId<T>,
    ctx?: ModelContext
  ): Promise<ModelResult<T>> {
    await this.init();

    return measureQuery(
      {
        operation: 'create',
        collectionName: this.resolveCollectionName(ctx),
        documentCount: 1
      },
      async () => {
        const middlewareCtx = this.buildMiddlewareContext('create', ctx, {
          doc: doc as Partial<T>
        });

        await this.runBeforeMiddlewares('create', middlewareCtx);

        const nextDoc = (middlewareCtx.doc ?? doc) as OptionalUnlessRequiredId<T>;

        this.validate(nextDoc);
        await this._schema.executeHooks('pre-save', nextDoc);
        this._schema.validate(nextDoc);

        const col = await this.getCollection(ctx);
        const session = this.resolveSession(ctx);

        const result = await col.insertOne(
          nextDoc,
          session ? { session } : undefined
        );

        const createdDoc = { ...nextDoc, _id: result?.insertedId } as WithId<T>;

        await this.schema.executeHooks('post-save', createdDoc);

        const payload = this.toModelResult(createdDoc);
        middlewareCtx.result = payload;

        await this.runAfterMiddlewares('create', middlewareCtx);

        await pubsub.publish(
          `${DB_CHANGE_EVENT}_${this.resolveCollectionName(ctx)}`,
          JSON.stringify({
            documentInserted: {
              action: 'create',
              doc: middlewareCtx.result ?? payload
            }
          })
        );

        return (middlewareCtx.result ?? payload) as ModelResult<T>;
      }
    );
  }

  /**
   * Finds documents in the collection that match the filter.
   * @param {Filter<T>} [filter={}] - The filter to apply.
   * @returns {Promise<T[]>} An array of matching documents.
   */
  async find(
    filter: Filter<T> = {},
    ctx?: ModelContext
  ): Promise<ModelResultArray<T>> {
    await this.init();

    return measureQuery(
      {
        operation: 'find',
        collectionName: this.resolveCollectionName(ctx),
        filter
      },
      async () => {
        const middlewareCtx = this.buildMiddlewareContext('find', ctx, {
          filter
        });

        await this.runBeforeMiddlewares('find', middlewareCtx);

        const col = await this.getCollection(ctx);
        const session = this.resolveSession(ctx);

        const cursor = col.find(
          (middlewareCtx.filter ?? filter) as Filter<T>,
          session ? { session } : undefined
        );

        const results = await cursor.toArray();
        const payload = this.toModelResults(results as WithId<T>[]);

        middlewareCtx.result = payload;

        await this.runAfterMiddlewares('find', middlewareCtx);

        return (middlewareCtx.result ?? payload) as ModelResultArray<T>;
      }
    );
  }

  /**
   * Finds a single document in the collection that matches the filter.
   * @param {Filter<T>} filter - The filter to apply.
   * @returns {Promise<T | null>} The matching document or `null` if not found.
   * @throws {Error} If the filter is not a valid object.
   */
  async findOne(
    filter: Filter<T>,
    ctx?: ModelContext
  ): Promise<ModelResult<T> | null> {
    await this.init();

    if (!filter || typeof filter !== 'object') {
      throw new Error('Filter must be a valid object.');
    }

    return measureQuery(
      {
        operation: 'findOne',
        collectionName: this.resolveCollectionName(ctx),
        filter
      },
      async () => {
        const middlewareCtx = this.buildMiddlewareContext('findOne', ctx, {
          filter
        });

        await this.runBeforeMiddlewares('findOne', middlewareCtx);

        const col = await this.getCollection(ctx);
        const session = this.resolveSession(ctx);

        const result = await col.findOne(
          (middlewareCtx.filter ?? filter) as Filter<T>,
          session ? { session } : undefined
        );

        const payload = result
          ? this.toModelResult(result as WithId<T>)
          : null;

        middlewareCtx.result = payload;

        await this.runAfterMiddlewares('findOne', middlewareCtx);

        return (middlewareCtx.result ?? payload) as ModelResult<T> | null;
      }
    );
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

    return measureQuery(
      {
        operation: 'updateOne',
        collectionName: this.resolveCollectionName(ctx),
        filter,
        update
      },
      async () => {
        const middlewareCtx = this.buildMiddlewareContext('updateOne', ctx, {
          filter,
          update
        });

        await this.runBeforeMiddlewares('updateOne', middlewareCtx);

        await this.schema.executeHooks('pre-update', {
          filter: middlewareCtx.filter ?? filter,
          update: middlewareCtx.update ?? update
        });

        const col = await this.getCollection(ctx);
        const session = this.resolveSession(ctx);

        const result = await col.updateOne(
          (middlewareCtx.filter ?? filter) as Filter<T>,
          (middlewareCtx.update ?? update) as UpdateFilter<T>,
          session ? { session } : undefined
        );

        await this.schema.executeHooks('post-update', {
          filter: middlewareCtx.filter ?? filter,
          update: middlewareCtx.update ?? update
        });

        middlewareCtx.result = {
          acknowledged: result.acknowledged,
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount,
          upsertedCount: result.upsertedCount,
          upsertedId: result.upsertedId
        };

        await this.runAfterMiddlewares('updateOne', middlewareCtx);

        await pubsub.publish(`${DB_CHANGE_EVENT}`, JSON.stringify({
          documentUpdated: {
            action: 'update',
            filter: middlewareCtx.filter ?? filter,
            update: middlewareCtx.update ?? update
          }
        }));
      }
    );
  }

  /**
   * Performs a bulk insert of documents into the collection.
   * @param {OptionalUnlessRequiredId<T>[]} docs - An array of documents to insert.
   * @returns {Promise<void>} Resolves when the bulk insert is complete.
   */
  async bulkInsert(
    docs: OptionalUnlessRequiredId<T>[],
    ctx?: ModelContext
  ): Promise<void> {
    await this.init();

    if (!docs || docs.length === 0) return;

    return measureQuery(
      {
        operation: 'bulkInsert',
        collectionName: this.resolveCollectionName(ctx),
        documentCount: docs.length
      },
      async () => {
        const middlewareCtx = this.buildMiddlewareContext('bulkInsert', ctx, {
          docs: docs as Partial<T>[]
        });

        await this.runBeforeMiddlewares('bulkInsert', middlewareCtx);

        const nextDocs = (middlewareCtx.docs ?? docs) as OptionalUnlessRequiredId<T>[];

        this.validate(nextDocs[0]);
        await this.schema.executeHooks('pre-save', nextDocs);

        const col = await this.getCollection(ctx);
        const session = this.resolveSession(ctx);

        const result = await col.insertMany(nextDocs, {
          ordered: false,
          ...(session ? { session } : {})
        });

        const insertedIds = { ...nextDocs, _id: result?.insertedIds } as Record<number, ObjectId>;

        const insertedDocs = nextDocs.map((doc, index) => ({
          ...doc,
          _id: insertedIds[index]
        })) as WithId<T>[];

        middlewareCtx.result = this.toModelResults(insertedDocs);

        await this.runAfterMiddlewares('bulkInsert', middlewareCtx);

        await pubsub.publish(`${DB_CHANGE_EVENT}`, {
          documentInserted: {
            action: 'bulkInsert',
            docs: middlewareCtx.result
          }
        });
      }
    );
  }

  /**
   * Performs a bulk update of multiple documents in the collection.
   * @param {Array<{ filter: Partial<T>; update: Partial<T> }>} updates - Array of update operations.
   * @returns {Promise<void>} Resolves when the bulk update is complete.
   */
  async bulkUpdate(
    updates: { filter: Partial<T>; update: Partial<T> }[],
    ctx?: ModelContext
  ): Promise<void> {
    await this.init();

    return measureQuery(
      {
        operation: 'bulkUpdate',
        collectionName: this.resolveCollectionName(ctx),
        documentCount: updates.length
      },
      async () => {
        const middlewareCtx = this.buildMiddlewareContext('bulkUpdate', ctx, {
          meta: { updates }
        });

        await this.runBeforeMiddlewares('bulkUpdate', middlewareCtx);

        const nextUpdates =
          (middlewareCtx.meta?.updates as typeof updates | undefined) ?? updates;

        const bulkOps: AnyBulkWriteOperation<T>[] = nextUpdates.map(
          ({ filter, update }) => ({
            updateOne: {
              filter: filter as Filter<T>,
              update: { $set: update }
            }
          })
        );

        const col = await this.getCollection(ctx);
        const session = this.resolveSession(ctx);

        const result = await col.bulkWrite(
          bulkOps,
          {
            ordered: false,
            ...(session ? { session } : {})
          }
        );

        middlewareCtx.result = {
          acknowledged: result?.isOk?.() ?? true,
          matchedCount: result?.matchedCount,
          modifiedCount: result?.modifiedCount,
          upsertedCount: result?.upsertedCount,
          insertedCount: result?.insertedCount,
          deletedCount: result?.deletedCount
        };

        await this.runAfterMiddlewares('bulkUpdate', middlewareCtx);

        await pubsub.publish(`${DB_CHANGE_EVENT}`, {
          documentInserted: { action: 'bulkUpdate', updates: nextUpdates }
        });
      }
    );
  }

  /**
   * Deletes a single document from the collection.
   * @param {Filter<T>} filter - The filter to find the document to delete.
   * @returns {Promise<void>} Resolves when the document is deleted.
   */

  async deleteOne(filter: Filter<T>, ctx?: ModelContext): Promise<void> {
    await this.init();

    return measureQuery(
      {
        operation: 'deleteOne',
        collectionName: this.resolveCollectionName(ctx),
        filter
      },
      async () => {
        const middlewareCtx = this.buildMiddlewareContext('deleteOne', ctx, {
          filter
        });

        await this.runBeforeMiddlewares('deleteOne', middlewareCtx);

        const col = await this.getCollection(ctx);
        const session = this.resolveSession(ctx);

        const effectiveFilter = (middlewareCtx.filter ?? filter) as Filter<T>;

        const doc = await col.findOne(
          effectiveFilter,
          session ? { session } : undefined
        );

        if (!doc) {
          middlewareCtx.result = null;
          await this.runAfterMiddlewares('deleteOne', middlewareCtx);
          return;
        }

        const payload = this.toModelResult(doc as WithId<T>);
        middlewareCtx.result = payload;

        if (middlewareCtx.meta?.softDelete === true) {
          const softDeleteUpdate = middlewareCtx.meta.softDeleteUpdate as UpdateFilter<T>;

          await col.updateOne(
            effectiveFilter,
            softDeleteUpdate,
            session ? { session } : undefined
          );
        } else {
          await this.schema.triggerMiddleware('deleteOne', doc);
          await col.deleteOne(
            effectiveFilter,
          );
        }

        await this.runAfterMiddlewares('deleteOne', middlewareCtx);

        await pubsub.publish(`${DB_CHANGE_EVENT}`, {
          documentDeleted: {
            action: middlewareCtx.meta?.softDelete ? 'softDelete' : 'delete',
            filter: effectiveFilter
          }
        });
      }
    );
  }

  /**
   * Deletes multiple documents from the collection.
   * @param {Filter<T>} filter - The filter to find the documents to delete.
   * @returns {Promise<void>} Resolves when the documents are deleted.
   */
  async deleteMany(filter: Filter<T>, ctx?: ModelContext): Promise<void> {
    await this.init();

    return measureQuery(
      {
        operation: 'deleteMany',
        collectionName: this.resolveCollectionName(ctx),
        filter
      },
      async () => {
        const middlewareCtx = this.buildMiddlewareContext('deleteMany', ctx, {
          filter
        });

        await this.runBeforeMiddlewares('deleteMany', middlewareCtx);

        const col = await this.getCollection(ctx);
        const session = this.resolveSession(ctx);

        const effectiveFilter = (middlewareCtx.filter ?? filter) as Filter<T>;

        const docs = await col.find(
          effectiveFilter,
          session ? { session } : undefined
        ).toArray();

        if (docs.length === 0) {
          middlewareCtx.result = {
            deletedCount: 0,
            docs: []
          };
          await this.runAfterMiddlewares('deleteMany', middlewareCtx);
          return;
        }

        if (middlewareCtx.meta?.softDelete === true) {
          const softDeleteUpdate = middlewareCtx.meta.softDeleteUpdate as UpdateFilter<T>;

          const result = await col.updateMany(
            effectiveFilter,
            softDeleteUpdate,
            session ? { session } : undefined
          );

          middlewareCtx.result = {
            deletedCount: result.modifiedCount,
            docs: this.toModelResults(docs as WithId<T>[]),
            softDeleted: true
          };
        } else {
          await this.schema.triggerMiddleware('deleteMany', docs);

          const result = await col.deleteMany(
            effectiveFilter,
            session ? { session } : undefined
          );

          middlewareCtx.result = {
            deletedCount: result.deletedCount,
            docs: this.toModelResults(docs as WithId<T>[])
          };
        }

        await this.runAfterMiddlewares('deleteMany', middlewareCtx);

        await pubsub.publish(`${DB_CHANGE_EVENT}`, {
          documentDeleted: {
            action: middlewareCtx.meta?.softDelete ? 'softDeleteMany' : 'deleteMany',
            filter: effectiveFilter
          }
        });
      }
    );
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

    return this.withTransaction(async () => {
      this.validate(doc);
      await this._schema.executeHooks?.("pre-save", doc);

      const col = await this.getCollection(ctx);
      const session = this.resolveSession(ctx);

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

    return this.withTransaction(async () => {
      const col = await this.getCollection(ctx);
      const session = this.resolveSession(ctx);

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

    return this.withTransaction(async () => {
      const col = await this.getCollection(ctx);
      const session = this.resolveSession(ctx);

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

    return this.withTransaction(async () => {
      const col = await this.getCollection(ctx);
      const session = this.resolveSession(ctx);

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

  private async getSession(ctx?: ModelContext): Promise<ClientSession> {
    if (!this._provider?.startSession) {
      throw new Error(
        'Transaction support is not available. Provider does not implement startSession().'
      );
    }

    return this._provider.startSession(this.mergeCtx(ctx));
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
  ): Promise<ModelResult<T> | null> {
    await this.init();

    return measureQuery(
      {
        operation: 'findOneAndUpdate',
        collectionName: this.resolveCollectionName(ctx),
        filter,
        update
      },
      async () => {
        const middlewareCtx = this.buildMiddlewareContext('findOneAndUpdate', ctx, {
          filter,
          update
        });

        await this.runBeforeMiddlewares('findOneAndUpdate', middlewareCtx);

        const col = await this.getCollection(ctx);
        const session = this.resolveSession(ctx);

        const result = await col.findOneAndUpdate(
          (middlewareCtx.filter ?? filter) as Filter<T>,
          (middlewareCtx.update ?? update) as UpdateFilter<T>,
          {
            returnDocument: 'after',
            ...(session ? { session } : {})
          }
        );

        const payload = result
          ? this.toModelResult(result as WithId<T>)
          : null;

        middlewareCtx.result = payload;

        await this.runAfterMiddlewares('findOneAndUpdate', middlewareCtx);

        return (middlewareCtx.result ?? payload) as ModelResult<T> | null;
      }
    );
  }

  /**
   * Finds a document and deletes it from the collection.
   * @param {Filter<T>} filter - The filter to find the document.
   * @returns {Promise<T | null>} The deleted document or `null` if not found.
   */
  async findOneAndDelete(
    filter: Filter<T>,
    ctx?: ModelContext
  ): Promise<ModelResult<T> | null> {
    await this.init();

    return measureQuery(
      {
        operation: 'findOneAndDelete',
        collectionName: this.resolveCollectionName(ctx),
        filter
      },
      async () => {
        const middlewareCtx = this.buildMiddlewareContext('findOneAndDelete', ctx, {
          filter
        });

        await this.runBeforeMiddlewares('findOneAndDelete', middlewareCtx);

        const col = await this.getCollection(ctx);
        const session = this.resolveSession(ctx);
        const effectiveFilter = (middlewareCtx.filter ?? filter) as Filter<T>;

        const existingDoc = await col.findOne(
          effectiveFilter,
          session ? { session } : undefined
        );

        if (!existingDoc) {
          middlewareCtx.result = null;
          await this.runAfterMiddlewares('findOneAndDelete', middlewareCtx);
          return null;
        }

        if (middlewareCtx.meta?.softDelete === true) {
          const softDeleteUpdate = middlewareCtx.meta.softDeleteUpdate as UpdateFilter<T>;

          await col.updateOne(
            effectiveFilter,
            softDeleteUpdate,
            session ? { session } : undefined
          );

          const payload = this.toModelResult(existingDoc as WithId<T>);
          middlewareCtx.result = payload;

          await this.runAfterMiddlewares('findOneAndDelete', middlewareCtx);

          return (middlewareCtx.result ?? payload) as ModelResult<T> | null;
        }

        const options: FindOneAndDeleteOptions = session ? { session } : {};

        const result = await col.findOneAndDelete(
          effectiveFilter,
          options
        );

        const payload = result
          ? this.toModelResult(result as WithId<T>)
          : null;

        middlewareCtx.result = payload;

        await this.runAfterMiddlewares('findOneAndDelete', middlewareCtx);

        return (middlewareCtx.result ?? payload) as ModelResult<T> | null;
      }
    );
  }

  /**
   * Finds a document and replaces it with a new document.
   * @param {Filter<T>} filter - The filter to find the document.
   * @param {T} replacement - The new document to replace the found document.
   * @returns {Promise<T | null>} The replaced document or `null` if not found.
   */
  async findOneAndReplace(
    filter: Filter<T>,
    replacement: T,
    ctx?: ModelContext
  ): Promise<ModelResult<T> | null> {
    await this.init();

    return measureQuery(
      {
        operation: 'findOneAndReplace',
        collectionName: this.resolveCollectionName(ctx),
        filter
      },
      async () => {
        const middlewareCtx = this.buildMiddlewareContext('findOneAndReplace', ctx, {
          filter,
          doc: replacement
        });

        await this.runBeforeMiddlewares('findOneAndReplace', middlewareCtx);

        const col = await this.getCollection(ctx);
        const session = this.resolveSession(ctx);

        const effectiveFilter = (middlewareCtx.filter ?? filter) as Filter<T>;
        const nextReplacement = (middlewareCtx.doc ?? replacement) as T;

        const result = await col.findOneAndReplace(
          effectiveFilter,
          nextReplacement,
          {
            returnDocument: 'after',
            ...(session ? { session } : {})
          }
        );

        const payload = result
          ? this.toModelResult(result as WithId<T>)
          : null;

        middlewareCtx.result = payload;

        await this.runAfterMiddlewares('findOneAndReplace', middlewareCtx);

        return (middlewareCtx.result ?? payload) as ModelResult<T> | null;
      }
    );
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
  ): Promise<ModelResult<T> | null> {
    await this.init();

    return measureQuery(
      {
        operation: 'findOneAndUpsert',
        collectionName: this.resolveCollectionName(ctx),
        filter,
        update
      },
      async () => {
        const middlewareCtx = this.buildMiddlewareContext('findOneAndUpsert', ctx, {
          filter,
          update
        });

        await this.runBeforeMiddlewares('findOneAndUpsert', middlewareCtx);

        const col = await this.getCollection(ctx);
        const session = this.resolveSession(ctx);

        const effectiveFilter = (middlewareCtx.filter ?? filter) as Filter<T>;
        const effectiveUpdate = (middlewareCtx.update ?? update) as UpdateFilter<T>;

        const result = await col.findOneAndUpdate(
          effectiveFilter,
          effectiveUpdate,
          {
            upsert: true,
            returnDocument: 'after',
            ...(session ? { session } : {})
          }
        );

        const payload = result
          ? this.toModelResult(result as WithId<T>)
          : null;

        middlewareCtx.result = payload;

        await this.runAfterMiddlewares('findOneAndUpsert', middlewareCtx);

        return (middlewareCtx.result ?? payload) as ModelResult<T> | null;
      }
    );
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
    externalSession?: ClientSession,
    ctx?: ModelContext
  ): Promise<U[]> {
    await this.init();

    return measureQuery(
      {
        operation: 'aggregate',
        collectionName: this.resolveCollectionName(ctx),
        pipeline
      },
      async () => {
        const middlewareCtx = this.buildMiddlewareContext('aggregate', ctx, {
          pipeline
        });

        await this.runBeforeMiddlewares('aggregate', middlewareCtx);

        const col = await this.getCollection(ctx);
        const resolvedSession = this.resolveSession(ctx) ?? externalSession;

        const cursor = col.aggregate<U>(
          (middlewareCtx.pipeline ?? pipeline) as object[],
          {
            ...options,
            ...(resolvedSession ? { session: resolvedSession } : {})
          }
        );

        this.schema.triggerMiddleware('aggregate', cursor);
        this.eventEmitter.emit('aggregate', cursor.bufferedCount());

        const result = await cursor.toArray();

        middlewareCtx.result = result;

        await this.runAfterMiddlewares('aggregate', middlewareCtx);

        await pubsub.publish('DB_CHANGE', {
          dbChange: {
            action: 'aggregate',
            pipeline: middlewareCtx.pipeline ?? pipeline
          }
        });

        return (middlewareCtx.result ?? result) as U[];
      }
    );
  }

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

    return this.withTransaction(async () => {
      const col = await this.getCollection(ctx);
      const session = this.resolveSession(ctx);

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

  private async withTransaction<R>(
    operation: (session: ClientSession) => Promise<R>,
    ctx?: ModelContext
  ): Promise<R> {
    const baseCtx = this.mergeCtx(ctx) ?? {};
    const existingSession = baseCtx.session;

    if (existingSession) {
      return AbimongoContext.run(
        {
          tenantId: baseCtx.tenantId,
          dbName: baseCtx.dbName,
          collectionName: baseCtx.collectionName ?? this._collectionName,
          session: existingSession
        },
        async () => operation(existingSession)
      );
    }

    if (this._provider?.startSession) {
      const session = await this.getSession(baseCtx);

      return AbimongoContext.run(
        {
          tenantId: baseCtx.tenantId,
          dbName: baseCtx.dbName,
          collectionName: baseCtx.collectionName ?? this._collectionName,
          session
        },
        async () => runManualTransaction(session, operation)
      );
    }

    return AbimongoContext.run(
      {
        tenantId: baseCtx.tenantId,
        dbName: baseCtx.dbName,
        collectionName: baseCtx.collectionName ?? this._collectionName
      },
      async () => AbimongoContext.withTransaction(operation)
    );
  }

  async runInTransaction<T>(
    ctx?: ModelContext
  ): Promise<T> {
    await this.init();

    return this.withTransaction(async () => {
      const col = await this.getCollection(ctx);
      const session = this.resolveSession(ctx);

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
    if (!Array.isArray(pipeline)) {
      throw new Error('Pipeline must be an array of objects.');
    }
    const cachedResult = await redis.get(cacheKey);

    if (cachedResult) {
      console.info(`[info]: Cache hit: ${cacheKey}`);
      return JSON.parse(cachedResult) as T[];
    } else if (typeof cacheKey !== 'string') {
      throw new Error('Cache key must be a string.');
    } else {
      console.info(`[info]: Cache miss: ${cacheKey}`);
    }


    const col = await this.getCollection();

    const result = await col.aggregate<T>(pipeline).toArray();
    await redis.set(cacheKey, JSON.stringify(result) || '');
    await redis.expire(cacheKey, cacheDuration);

    console.info('Cache set:', cacheKey);

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
        const result = await redis.scan(cursor, {
          MATCH: pattern,
          COUNT: 100
        });

        const nextCursor = Array.isArray(result) ? Number(result[0]) : 0;
        const keys = Array.isArray(result) ? result[1] : [];

        if (keys && keys.length > 0) {
          const multi = redis.multi();
          keys.forEach(key => multi.del(key));

          const results = await multi.exec() as any;

          // Count successful deletions
          if (results) {
            deletedCount += results.filter((entry: any) => {
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

  private toModelResult(doc: WithId<T> | null): ModelResult<T> | null {
    if (!doc) return null;

    return {
      ...doc,
      _id: doc._id?.toString(),
    } as ModelResult<T>;
  }

  private toModelResults(docs: WithId<T>[]): ModelResultArray<T> {
    return docs.map((doc) => ({
      ...doc,
      _id: doc?._id?.toString(),
    })) as ModelResultArray<T>;
  }

  async restoreOne(filter: Filter<T>, ctx?: ModelContext): Promise<void> {
    await this.init();

    const col = await this.getCollection(ctx);
    const session = this.resolveSession(ctx);

    await col.updateOne(
      filter,
      this.buildRestoreUpdate(),
      session ? { session } : undefined
    );
  }

  async restoreMany(filter: Filter<T>, ctx?: ModelContext): Promise<void> {
    await this.init();

    const col = await this.getCollection(ctx);
    const session = this.resolveSession(ctx);

    await col.updateMany(
      filter,
      this.buildRestoreUpdate(),
      session ? { session } : undefined
    );
  }

  private buildRestoreUpdate(): UpdateFilter<T> {
    const deletedAtField = this._softDeleteConfig?.deletedAtField ?? 'deletedAt';
    const isDeletedField = this._softDeleteConfig?.isDeletedField ?? 'isDeleted';

    return {
      $set: {
        [deletedAtField]: null,
        [isDeletedField]: false
      } as Partial<T>
    } as UpdateFilter<T>;
  }

  //================ Middleware Context and Execution =================//
  private buildMiddlewareContext(
    operation: AbimongoMiddlewareOperation,
    ctx?: ModelContext,
    extra: Partial<AbimongoMiddlewareContext<T>> = {}
  ): AbimongoMiddlewareContext<T> {
    const merged = this.mergeCtx(ctx);

    const baseMeta = {
      withDeleted: ctx?.withDeleted,
      onlyDeleted: ctx?.onlyDeleted,
      hardDelete: ctx?.hardDelete
    };

    return {
      operation,
      collectionName: this.resolveCollectionName(ctx),
      tenantId: merged?.tenantId,
      dbName: merged?.dbName,
      session: merged?.session,
      ...extra,
      meta: {
        ...baseMeta,
        ...(extra.meta ?? {})
      }
    };
  }

  setSoftDeleteConfig(config: {
    deletedAtField: string;
    isDeletedField: string
  }): void {
    this._softDeleteConfig = config;
  }

  // Middleware runners/execution methods
  private async runBeforeMiddlewares(
    operation: AbimongoMiddlewareOperation,
    ctx: AbimongoMiddlewareContext<T>
  ): Promise<void> {
    const handlers = this.beforeMiddlewares.get(operation) ?? [];
    for (const handler of handlers) {
      await handler(ctx);
    }
  }

  private async runAfterMiddlewares(
    operation: AbimongoMiddlewareOperation,
    ctx: AbimongoMiddlewareContext<T>
  ): Promise<void> {
    const handlers = this.afterMiddlewares.get(operation) ?? [];
    for (const handler of handlers) {
      await handler(ctx);
    }
  }

  // Middleware registration methods
  before(
    operation: AbimongoMiddlewareOperation,
    handler: AbimongoMiddlewareHandler<T>
  ): this {
    const existing = this.beforeMiddlewares.get(operation) ?? [];
    existing.push(handler);
    this.beforeMiddlewares.set(operation, existing);
    return this;
  }

  after(
    operation: AbimongoMiddlewareOperation,
    handler: AbimongoMiddlewareHandler<T>
  ): this {
    const existing = this.afterMiddlewares.get(operation) ?? [];
    existing.push(handler);
    this.afterMiddlewares.set(operation, existing);
    return this;
  }

  beforeFind(handler: AbimongoMiddlewareHandler<T>): this {
    return this.before('find', handler);
  }

  afterFind(handler: AbimongoMiddlewareHandler<T>): this {
    return this.after('find', handler);
  }

  beforeFindOne(handler: AbimongoMiddlewareHandler<T>): this {
    return this.before('findOne', handler);
  }

  afterFindOne(handler: AbimongoMiddlewareHandler<T>): this {
    return this.after('findOne', handler);
  }

  beforeSave(handler: AbimongoMiddlewareHandler<T>): this {
    return this.before('create', handler);
  }

  afterSave(handler: AbimongoMiddlewareHandler<T>): this {
    return this.after('create', handler);
  }

  beforeUpdateOne(handler: AbimongoMiddlewareHandler<T>): this {
    return this.before('updateOne', handler);
  }

  afterUpdateOne(handler: AbimongoMiddlewareHandler<T>): this {
    return this.after('updateOne', handler);
  }

  beforeDeleteOne(handler: AbimongoMiddlewareHandler<T>): this {
    return this.before('deleteOne', handler);
  }

  afterDeleteOne(handler: AbimongoMiddlewareHandler<T>): this {
    return this.after('deleteOne', handler);
  }

  beforeDeleteMany(handler: AbimongoMiddlewareHandler<T>): this {
    return this.before('deleteMany', handler);
  }

  afterDeleteMany(handler: AbimongoMiddlewareHandler<T>): this {
    return this.after('deleteMany', handler);
  }

  beforeBulkInsert(handler: AbimongoMiddlewareHandler<T>): this {
    return this.before('bulkInsert', handler);
  }

  afterBulkInsert(handler: AbimongoMiddlewareHandler<T>): this {
    return this.after('bulkInsert', handler);
  }

  beforeBulkUpdate(handler: AbimongoMiddlewareHandler<T>): this {
    return this.before('bulkUpdate', handler);
  }

  afterBulkUpdate(handler: AbimongoMiddlewareHandler<T>): this {
    return this.after('bulkUpdate', handler);
  }

  beforeAggregate(handler: AbimongoMiddlewareHandler<T>): this {
    return this.before('aggregate', handler);
  }

  afterAggregate(handler: AbimongoMiddlewareHandler<T>): this {
    return this.after('aggregate', handler);
  }

  beforeFindOneAndUpdate(handler: AbimongoMiddlewareHandler<T>): this {
    return this.before('findOneAndUpdate', handler);
  }

  afterFindOneAndUpdate(handler: AbimongoMiddlewareHandler<T>): this {
    return this.after('findOneAndUpdate', handler);
  }

  beforeFindOneAndDelete(handler: AbimongoMiddlewareHandler<T>): this {
    return this.before('findOneAndDelete', handler);
  }

  afterFindOneAndDelete(handler: AbimongoMiddlewareHandler<T>): this {
    return this.after('findOneAndDelete', handler);
  }

  beforeFindOneAndReplace(handler: AbimongoMiddlewareHandler<T>): this {
    return this.before('findOneAndReplace', handler);
  }

  afterFindOneAndReplace(handler: AbimongoMiddlewareHandler<T>): this {
    return this.after('findOneAndReplace', handler);
  }

  beforeFindOneAndUpsert(handler: AbimongoMiddlewareHandler<T>): this {
    return this.before('findOneAndUpsert', handler);
  }

  afterFindOneAndUpsert(handler: AbimongoMiddlewareHandler<T>): this {
    return this.after('findOneAndUpsert', handler);
  }

};