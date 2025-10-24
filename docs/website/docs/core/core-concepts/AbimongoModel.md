# AbimongoModel

`AbimongoModel` is the primary data-access abstraction in @abimongo/core. It wraps a MongoDB collection and provides:

- Schema validation and middleware hooks
- Multi-tenant resolution and collection initialization
- Transaction helpers and atomic find-and-modify helpers
- Aggregation, streaming and cached aggregation results
- Bulk operations, pagination and population helpers
- Redis-backed caching utilities and cache statistics
- Garbage collection utilities for TTL and archival

This page documents the most commonly used APIs and practical examples. The implementation lives at `packages/core/src/lib-core/AbimongoModelFactory.ts`.

---

## Construction

Create a model by providing one of `db`, `client` or `tenantId`, plus a `collectionName` and optional `schema`:

```ts
new AbimongoModel<T>({ db, client, tenantId, collectionName, schema });
```

Notes

- One of `db`, `client` or `tenantId` is required; `collectionName` is mandatory.
- If `tenantId` is provided, the model resolves the tenant client via `AbimongoClient.getDatabase` (which now returns both `{ db, client }`). The model's initialization (`init()`) will set `this.client` when a `client` is available so transaction helpers can call `startSession()`.
- The model initialises lazily — most methods call `await this.init()` internally.

---

## Events

Helpers provided by the model's internal event emitter:

- `on(event, listener)`
- `once(event, listener)`
- `off(event, listener)`
- `removeListener(event, listener)`

Example

```ts
UserModel.on("create", (data) => console.log("created", data));
```

---

## CRUD and core methods

All methods ensure the model is initialised before running.

Signature examples are shown in code blocks to preserve generics and avoid markdown lint issues.

Create

```ts
// Insert a single document and run schema hooks
create(doc: OptionalUnlessRequiredId<T>): Promise<T>
```

Find

```ts
// Returns array of matching documents
find(filter: Filter<T> = {}): Promise<T[]>
```

Find one

```ts
findOne(filter: Filter<T>): Promise<T | null>
```

Update

```ts
updateOne(filter: Filter<T>, update: UpdateFilter<T>): Promise<void>
```

Delete (single)

```ts
deleteOne(filter: Filter<T>): Promise<void>
```

Delete (many)

```ts
deleteMany(filter: Filter<T>): Promise<void>
```

Notes

- The implementation runs schema middleware (`pre-save`, `post-save`, `pre-update`, `post-update`, etc.) where applicable and publishes change events via an internal pubsub.

---

## Aggregation and streaming

Aggregate

```ts
aggregate<U extends Document>(pipeline: object[], options?: AggregateOptions, session?: ClientSession): Promise<U[]>
```

Notes

- `aggregate` will propagate errors (it no longer swallows exceptions) so callers can handle failures or let higher-level transaction helpers abort as needed.

Aggregate with transaction

```ts
aggregateWithTransaction<U extends Document>(pipeline: object[], options?: AggregateOptions): Promise<U[]>
```

Notes

- `aggregateWithTransaction` wraps the aggregation in a MongoDB session. The implementation will attempt to use an existing `this.client` (set during `init()`), or the `MongoClient` returned by `AbimongoClient.getDatabase` for tenant-scoped models. The helper starts a session, runs the aggregation, and commits or aborts the transaction and ensures the session is ended in all cases. Errors are rethrown to the caller.

Stream aggregation

```ts
streamAggregation<U extends Document>(pipeline: object[], options?: AggregateOptions)
```

Aggregate with cache

```ts
aggregateWithCache(pipeline: object[], cacheKey: string, cacheDuration?: number): Promise<T[]>
```

Notes

- `aggregateWithCache` reads/writes JSON to Redis and tracks hits/misses.
- `aggregate` triggers schema middleware and publishes DB change events.

---

## Transactions

Helpers that wrap operations in MongoDB sessions:

```ts
deleteWithTransaction(filter: Filter<T>): Promise<void>
updateWithTransaction(filter: Filter<T>, update: UpdateFilter<T>): Promise<void>
findOneAndUpsertWithTransaction(filter: Filter<T>, update: UpdateFilter<T>): Promise<T | null>
```

Use these when several operations must succeed or fail together.

---

## Population helpers

Populate single reference

```ts
populateOne<K extends Document>(doc: T, field: keyof T, relatedModel: AbimongoModel<K>): Promise<T | null>
```

Populate many references

```ts
populateMany<K extends Document>(doc: T, field: keyof T, relatedModel: AbimongoModel<K>): Promise<T | null>
```

Notes

- These methods fetch related documents from the provided model and return a copy of the document with the populated field(s).

---

## Bulk and utility operations

```ts
bulkInsert(docs: OptionalUnlessRequiredId<T>[]): Promise<void>
bulkUpdate(updates: { filter: Partial<T>; update: Partial<T> }[]): Promise<void>
findOneAndUpdate(filter: Filter<T>, update: UpdateFilter<T>): Promise<T | null>
findOneAndDelete(filter: Filter<T>): Promise<T | null>
findOneAndReplace(filter: Filter<T>, replacement: T): Promise<T | null>
findOneAndUpsert(filter: Filter<T>, update: UpdateFilter<T>): Promise<T | null>
```

---

## Security helpers

Secure variants check a `User` object (current implementation requires `user.role === 'admin'`):

```ts
deleteSecure(filter: Filter<T>, user: User): Promise<void>
findOneAndUpsertWithTransactionSecure(filter: Filter<T>, update: UpdateFilter<T>, user: User): Promise<T | null>
```

---

## Indexing

```ts
createIndex(fields: Partial<Record<keyof T, 1 | -1>>): Promise<void>
dropIndex(indexName: string): Promise<void>
```

---

## Caching & cache statistics

Model-level caching uses Redis and provides:

- `static cacheResult(key, data, ttl)`
- `static clearCache(key)`
- `findCached(key)`
- `static invalidatePattern(pattern)` (scan & delete)
- `invalidateModelPattern(pattern)` (tenant-prefixed)
- `static getCacheStats(tenantId?)` (memory, hits/misses)

The model tracks hits/misses (`trackCacheHit`/`trackCacheMiss`) and exposes cache-warming helpers.

---

## Garbage collection (GC)

`runGC()` and `startAutoGC(intervalMs)` support cleaning expired documents based on schema GC configuration: soft-delete, archival, and TTL.

---

## Misc utilities

- `warmCache(queries?, defaultTtl?)` — pre-populate cache for common queries
- `runCommand(command, ...args)` — run a DB command

---

## Examples

Basic create/find

```ts
const UserModel = new AbimongoModel({
  db: yourDb,
  collectionName: "users",
  schema: userSchema,
});
await UserModel.create({ name: "Alice" });
const list = await UserModel.find({});
```

Cursor-based pagination

```ts
const page = await UserModel.paginatedFind({ status: "active" }, 20, lastId);
```

Streaming aggregation

```ts
const cursor = UserModel.streamAggregation([{ $match: { active: true } }]);
cursor.on("data", (doc) => console.log(doc));
```

---

## Best practices

- Define clear schemas and use schema middleware for side effects.
- Reuse model instances where possible and avoid unnecessary re-initialization.
- Prefer cursor-based pagination for large collections.
- Keep cache warming targeted; avoid preloading very large collections.
- Use transactions for multi-write atomic operations.

---

## Next steps

- Consult the generated [API docs](../api) for full signatures and types.
- Read the Multi-Tenancy guide for tenant registration and resolution patterns.

---

## Support

For questions or support, please open an issue on the [GitHub repository](https://github.com/NodEm9/core/issues).
