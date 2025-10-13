# AbimongoModel

The `AbimongoModel` class is a core component of the **Abimongo_Core** library. It provides a powerful and flexible interface for interacting with MongoDB collections, supporting schema validation, middleware, transactions, and more.

---

## Key Features

- **Schema Validation**: Enforce data integrity with schema definitions.
- **Middleware Hooks**: Add pre/post hooks for CRUD operations.
- **Multi-Tenancy**: Seamlessly integrate with tenant-specific collections.
- **Transactions**: Simplify transactional operations.
- **Aggregation Pipelines**: Perform advanced queries with MongoDB aggregation pipelines.
- **Caching**: Optimize performance with Redis-based caching.
- **Real-Time Change Tracking**: Monitor collection changes using MongoDB Change Streams.
- **Event System**: Built-in event emitter for custom event handling.
- **Population**: Support for populating references between collections.
- **Bulk Operations**: Efficient bulk insert and update operations.
- **Cursor-Based Pagination**: Memory-efficient pagination for large datasets.
- **Security Features**: Role-based access control for secure operations.

---

## Constructor

### Signature

```typescript
constructor(options: AbimongoModelOptions<T>)
```

### Parameters

- `options` (`AbimongoModelOptions<T>`): Configuration options for the model.

---

## Properties

### Event System

The `AbimongoModel` includes an event emitter for handling custom events:

```typescript
// Listen to events
UserModel.on('create', (data) => console.log('User created:', data));
UserModel.once('update', (data) => console.log('User updated:', data));

// Remove event listeners
UserModel.off('create', listener);
UserModel.removeListener('update', listener);
```

---

## Methods

### 1. `create`

Creates a new document in the collection.

#### Signature

```typescript
async create(doc: OptionalUnlessRequiredId<T>): Promise<T>
```

#### Parameters

- `doc` (`OptionalUnlessRequiredId<T>`): The document to create.

#### Returns

- `Promise<T>`: The created document with its `_id`.

#### Example

```typescript
const user = await UserModel.create({ name: 'John Doe', email: 'john@example.com', age: 30 });
console.log('Created User:', user);
```

---

### 2. `find`

Finds documents in the collection that match the filter.

#### Signature

```typescript
async find(filter: Filter<T> = {}): Promise<T[]>
```

#### Parameters

- `filter` (`Filter<T>`, optional): The filter to apply. Defaults to an empty object.

#### Returns

- `Promise<T[]>`: An array of matching documents.

#### Example

```typescript
const users = await UserModel.find({ age: { $gte: 18 } });
console.log('Users:', users);
```

---

### 3. `findOne`

Finds a single document in the collection that matches the filter.

#### Signature

```typescript
async findOne(filter: Filter<T>): Promise<T | null>
```

#### Parameters

- `filter` (`Filter<T>`): The filter to apply.

#### Returns

- `Promise<T | null>`: The matching document or `null` if not found.

#### Example

```typescript
const user = await UserModel.findOne({ email: 'john@example.com' });
console.log('User:', user);
```

---

### 4. `updateOne`

Updates a single document in the collection.

#### Signature

```typescript
async updateOne(filter: Filter<T>, update: UpdateFilter<T>): Promise<void>
```

#### Parameters

- `filter` (`Filter<T>`): The filter to find the document.
- `update` (`UpdateFilter<T>`): The update operation to apply.

#### Returns

- `Promise<void>`: Resolves when the update is complete.

#### Example

```typescript
await UserModel.updateOne({ email: 'john@example.com' }, { $set: { age: 31 } });
console.log('User updated');
```

---

### 5. `deleteOne`

Deletes a single document from the collection.

#### Signature

```typescript
async deleteOne(filter: Filter<T>): Promise<void>
```

#### Parameters

- `filter` (`Filter<T>`): The filter to find the document to delete.

#### Returns

- `Promise<void>`: Resolves when the document is deleted.

#### Example

```typescript
await UserModel.deleteOne({ email: 'john@example.com' });
console.log('User deleted');
```

---

### 6. `aggregate`

Performs an aggregation pipeline query.

#### Signature

```typescript
async aggregate<U extends Document>(
  pipeline: object[],
  options: AggregateOptions = {}
): Promise<U[]>
```

#### Parameters

- `pipeline` (object[]): The MongoDB aggregation pipeline.
- `options` (AggregateOptions, optional): Additional options for the aggregation.

#### Returns

- `Promise<U[]>`: The aggregation result as an array.

#### Example

```typescript
const pipeline = [{ $match: { age: { $gte: 18 } } }];
const results = await UserModel.aggregate(pipeline);
console.log('Aggregation Results:', results);
```

---

### 7. `watchChanges`

Tracks real-time changes in the collection using MongoDB Change Streams.

#### Signature

```typescript
watchChanges(callback: (change: ChangeStreamDocument<T>) => void): ChangeStream<T>
```

#### Parameters

- `callback` (function): A function to invoke when a change occurs.

#### Returns

- `ChangeStream<T>`: The change stream instance.

#### Example

```typescript
UserModel.watchChanges((change) => {
  console.log('Change detected:', change);
});
```

---

## Middleware Hooks

The `AbimongoModel` class supports middleware hooks for CRUD operations. Hooks can be added using the `pre` and `post` methods in the schema.

### Example: Adding Hooks

```typescript
userSchema.pre('save', async (doc) => {
  console.log('Before saving:', doc);
});

userSchema.post('save', async (doc) => {
  console.log('After saving:', doc);
});
```

---

## Transactions

Simplify transactional operations with built-in support.

### Example: Update with Transaction

```typescript
await UserModel.updateWithTransaction(
  { email: 'john@example.com' },
  { $set: { age: 32 } }
);
```

---

## Methods

### 8. `bulkInsert`

Performs a bulk insert of documents into the collection.

#### Signature

```typescript
async bulkInsert(docs: OptionalUnlessRequiredId<T>[]): Promise<void>
```

#### Parameters

- `docs` (`OptionalUnlessRequiredId<T>[]`): An array of documents to insert.

#### Returns

- `Promise<void>`: Resolves when the bulk insert is complete.

#### Example

```typescript
const users = [
  { name: 'John Doe', email: 'john@example.com' },
  { name: 'Jane Smith', email: 'jane@example.com' }
];
await UserModel.bulkInsert(users);
```

---

### 9. `bulkUpdate`

Performs a bulk update of multiple documents in the collection.

#### Signature

```typescript
async bulkUpdate(updates: { filter: Partial<T>; update: Partial<T> }[]): Promise<void>
```

#### Parameters

- `updates` (Array): Array of update operations with filter and update objects.

#### Returns

- `Promise<void>`: Resolves when the bulk update is complete.

#### Example

```typescript
const updates = [
  { filter: { age: { $lt: 18 } }, update: { status: 'minor' } },
  { filter: { age: { $gte: 65 } }, update: { status: 'senior' } }
];
await UserModel.bulkUpdate(updates);
```

---

### 10. `deleteMany`

Deletes multiple documents from the collection with middleware support.

#### Signature

```typescript
async deleteMany(filter: Filter<T>): Promise<void>
```

#### Parameters

- `filter` (`Filter<T>`): The filter to find documents to delete.

#### Returns

- `Promise<void>`: Resolves when the documents are deleted.

#### Example

```typescript
await UserModel.deleteMany({ status: 'inactive' });
```

---

### 11. `populateOne`

Populates a single field in a document with data from a related model.

#### Signature

```typescript
async populateOne<K extends Document>(
  doc: T,
  field: keyof T,
  relatedModel: AbimongoModel<K>
): Promise<(T & { [key in keyof K]?: K }) | null>
```

#### Parameters

- `doc` (`T`): The document to populate.
- `field` (`keyof T`): The field to populate.
- `relatedModel` (`AbimongoModel<K>`): The related model to fetch data from.

#### Returns

- `Promise<T & K | null>`: The populated document.

#### Example

```typescript
const populatedUser = await UserModel.populateOne(user, 'profileId', ProfileModel);
```

---

### 12. `populateMany`

Populates a field with an array of related documents.

#### Signature

```typescript
async populateMany<K extends Document>(
  doc: T,
  field: keyof T,
  relatedModel: AbimongoModel<K>
): Promise<(T & { [key in keyof K]?: K[] }) | null>
```

#### Parameters

- `doc` (`T`): The document to populate.
- `field` (`keyof T`): The field to populate.
- `relatedModel` (`AbimongoModel<K>`): The related model to fetch data from.

#### Returns

- `Promise<T & K[] | null>`: The populated document.

#### Example

```typescript
const userWithPosts = await UserModel.populateMany(user, 'postIds', PostModel);
```

---

### 13. `paginatedFind`

Cursor-based pagination using `_id` comparison for memory efficiency.

#### Signature

```typescript
async paginatedFind(
  filter: Partial<T>,
  pageSize: number,
  lastId?: string
): Promise<T[]>
```

#### Parameters

- `filter` (`Partial<T>`): The filter for documents.
- `pageSize` (`number`): Number of documents per page.
- `lastId` (`string`, optional): Last document `_id` from the previous page.

#### Returns

- `Promise<T[]>`: Array of documents for the current page.

#### Example

```typescript
// First page
const firstPage = await UserModel.paginatedFind({ status: 'active' }, 20);

// Next page
const nextPage = await UserModel.paginatedFind(
  { status: 'active' }, 
  20, 
  firstPage[firstPage.length - 1]._id
);
```

---

### 14. Transaction Methods

#### `deleteWithTransaction`

Deletes a document within a transaction for data integrity.

```typescript
async deleteWithTransaction(filter: Filter<T>): Promise<void>
```

#### `updateWithTransaction`

Updates a document within a transaction.

```typescript
async updateWithTransaction(filter: Filter<T>, update: UpdateFilter<T>): Promise<void>
```

#### `aggregateWithTransaction`

Performs aggregation within a transaction.

```typescript
async aggregateWithTransaction<U extends Document>(
  pipeline: object[],
  options: AggregateOptions = {}
): Promise<U[]>
```

---

### 15. Advanced Operations

#### `findOneAndUpdate`

Finds and updates a document atomically.

```typescript
async findOneAndUpdate(filter: Filter<T>, update: UpdateFilter<T>): Promise<T | null>
```

#### `findOneAndDelete`

Finds and deletes a document atomically.

```typescript
async findOneAndDelete(filter: Filter<T>): Promise<T | null>
```

#### `findOneAndUpsert`

Finds, updates, or creates a document if it doesn't exist.

```typescript
async findOneAndUpsert(filter: Filter<T>, update: UpdateFilter<T>): Promise<T | null>
```

#### `findOneAndUpsertWithTransaction`

Performs upsert operation within a transaction.

```typescript
async findOneAndUpsertWithTransaction(filter: Filter<T>, update: UpdateFilter<T>): Promise<T | null>
```

---

### 16. Security Methods

#### `deleteSecure`

Performs secure delete operations with role-based access control.

```typescript
async deleteSecure(filter: Filter<T>, user: User): Promise<void>
```

#### `findOneAndUpsertWithTransactionSecure`

Secure upsert with transaction and RBAC.

```typescript
async findOneAndUpsertWithTransactionSecure(
  filter: Filter<T>, 
  update: UpdateFilter<T>, 
  user: User
): Promise<T | null>
```

---

### 17. Indexing Methods

#### `createIndex`

Creates an index on specified fields.

```typescript
async createIndex(fields: Partial<Record<keyof T, 1 | -1>>): Promise<void>
```

#### `dropIndex`

Drops an index by name.

```typescript
async dropIndex(indexName: string): Promise<void>
```

---

### 18. Streaming Operations

#### `streamAggregation`

Returns a cursor for streaming large aggregation results.

```typescript
streamAggregation<U extends Document>(
  pipeline: object[],
  options: AggregateOptions = {}
): AggregationCursor<U>
```

#### Example

```typescript
const cursor = UserModel.streamAggregation([
  { $match: { status: 'active' } },
  { $project: { name: 1, email: 1 } }
]);

cursor.on('data', (doc) => console.log('User:', doc));
cursor.on('end', () => console.log('Stream ended'));
```

---

## Caching

Optimize query performance with Redis-based caching.

### Example: Aggregate with Cache

```typescript
const pipeline = [{ $match: { age: { $gte: 18 } } }];
const cachedResults = await UserModel.aggregateWithCache(pipeline, 'user_cache_key', 600);
console.log('Cached Results:', cachedResults);
```

### Static Caching Methods

#### `cacheResult`

```typescript
static async cacheResult(key: string, data: any, ttl = 3600): Promise<void>
```

#### `clearCache`

```typescript
static async clearCache(key: string): Promise<void>
```

#### `findCached`

```typescript
async findCached(key: string): Promise<any>
```

---

## Best Practices

1. **Define Clear Schemas**:
   - Use schemas to enforce data integrity and validation rules.

2. **Use Middleware Hooks**:
   - Add hooks to handle pre/post-processing for CRUD operations.

3. **Leverage Caching**:
   - Use caching for frequently accessed or computationally expensive queries.

4. **Handle Transactions Gracefully**:
   - Use transactions for operations that require atomicity.

5. **Use Pagination for Large Datasets**:
   - Use `paginatedFind` for memory-efficient pagination.

6. **Implement Security**:
   - Use secure methods for role-based access control.

7. **Index Optimization**:
   - Create appropriate indexes for query performance.

8. **Stream Large Results**:
   - Use streaming for large aggregation results to avoid memory issues.

---

## Example: Full Workflow

Here’s a complete example demonstrating the usage of `AbimongoModel`:

```typescript
import { AbimongoModel, AbimongoSchema, createModel } from 'abimongo_core';

const userSchema = new AbimongoSchema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number },
  profileId: { type: ObjectId, ref: 'Profile' },
  postIds: [{ type: ObjectId, ref: 'Post' }]
});

const UserModel = new AbimongoModel({
  collectionName: 'users',
  schema: userSchema,
});

// Alternative functional approach
const UserModel = await createModel({
  collectionName: 'users',
  schema: userSchema,
  tenantId: 'tenant-a', // optional
  db: yourDbInstance, // optional
  client: yourDbClient // optional
});

(async () => {
  // Create a user
  const user = await UserModel.create({ name: 'John Doe', email: 'john@example.com', age: 30 });

  // Find users
  const users = await UserModel.find({ age: { $gte: 18 } });

  // Update a user
  await UserModel.updateOne({ email: 'john@example.com' }, { $set: { age: 31 } });

  // Delete a user
  await UserModel.deleteOne({ email: 'john@example.com' });

  // Bulk operations
  await UserModel.bulkInsert([
    { name: 'John Doe', email: 'john@example.com', age: 30 },
    { name: 'Jane Smith', email: 'jane@example.com', age: 25 }
  ]);
  
  // Pagination
  const firstPage = await UserModel.paginatedFind({ age: { $gte: 18 } }, 10);
  
  // Population
  const user = await UserModel.findOne({ email: 'john@example.com' });
  const populatedUser = await UserModel.populateOne(user, 'profileId', ProfileModel);

  // Streaming aggregation
  const cursor = UserModel.streamAggregation([
    { $match: { age: { $gte: 18 } } },
    { $group: { _id: '$age', count: { $sum: 1 } } }
  ]);

  // Event handling
  UserModel.on('create', (data) => console.log('User created:', data));

  // Secure operations
  await UserModel.deleteSecure({ _id: userId }, { role: 'admin' });

  console.log('Advanced workflow complete');
})();
```

---

## Next Steps

- Explore the [API Documentation](/api) for detailed information on all available methods and features.
- Check out the [Getting Started Guide](../getting-started/installation.md) for installation instructions.

---

## Support

For questions or support, please open an issue on the [GitHub repository](https://github.com/NodEm9/abimongo_core/issues).
