[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / AbimongoModel

# Class: AbimongoModel\<T\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:41](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L41)

Represents a model for MongoDB operations with support for schema validation, middleware, and multi-tenancy.

## Type Parameters

### T

`T` *extends* [`Document`](../type-aliases/Document.md)

The type of the document in the collection.

## Constructors

### Constructor

> **new AbimongoModel**\<`T`\>(`options`): `AbimongoModel`\<`T`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:52](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L52)

#### Parameters

##### options

[`AbimongoModelOptions`](../interfaces/AbimongoModelOptions.md)\<`T`\>

#### Returns

`AbimongoModel`\<`T`\>

## Properties

### collectionName

> **collectionName**: `string`

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:48](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L48)

## Accessors

### collection

#### Get Signature

> **get** **collection**(): `Collection`\<`T`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:194](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L194)

Gets the MongoDB collection associated with this model.

##### Returns

`Collection`\<`T`\>

The MongoDB collection.

***

### schema

#### Get Signature

> **get** **schema**(): [`AbimongoSchema`](AbimongoSchema.md)\<`T`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:202](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L202)

Gets the schema associated with this model.

##### Returns

[`AbimongoSchema`](AbimongoSchema.md)\<`T`\>

The schema for the model.

## Methods

### aggregate()

> **aggregate**\<`U`\>(`pipeline`, `options?`, `session?`): `Promise`\<`U`[]\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:673](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L673)

Aggregates documents in the collection using a pipeline.

#### Type Parameters

##### U

`U` *extends* [`Document`](../type-aliases/Document.md)

#### Parameters

##### pipeline

`object`[]

The aggregation pipeline.

##### options?

`AggregateOptions` = `{}`

The aggregation options.

##### session?

`ClientSession`

The session for transactions.

#### Returns

`Promise`\<`U`[]\>

The aggregation result as an array.

#### Throws

If the aggregation fails or the session cannot be started

***

### aggregateWithCache()

> **aggregateWithCache**(`pipeline`, `cacheKey`, `cacheDuration?`): `Promise`\<`T`[]\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:790](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L790)

Aggregates documents in the collection using a pipeline with caching.

#### Parameters

##### pipeline

`object`[]

The aggregation pipeline.

##### cacheKey

`string`

The cache key.

##### cacheDuration?

`number` = `300`

The cache duration in seconds.

#### Returns

`Promise`\<`T`[]\>

The aggregation result as an array.

#### Throws

If the pipeline is not valid or the cache key is not a string.

***

### aggregateWithTransaction()

> **aggregateWithTransaction**\<`U`\>(`pipeline`, `options?`): `Promise`\<`U`[]\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:701](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L701)

Aggregates documents in the collection using a pipeline with a transaction.

#### Type Parameters

##### U

`U` *extends* [`Document`](../type-aliases/Document.md)

#### Parameters

##### pipeline

`object`[]

The aggregation pipeline.

##### options?

`AggregateOptions` = `{}`

The aggregation options.

#### Returns

`Promise`\<`U`[]\>

The aggregation result as an array.

#### Throws

If the aggregation fails or the session cannot be started

***

### bulkInsert()

> **bulkInsert**(`docs`): `Promise`\<`void`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:309](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L309)

Performs a bulk insert of documents into the collection.

#### Parameters

##### docs

`OptionalUnlessRequiredId`\<`T`\>[]

An array of documents to insert.

#### Returns

`Promise`\<`void`\>

Resolves when the bulk insert is complete.

***

### bulkUpdate()

> **bulkUpdate**(`updates`): `Promise`\<`void`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:323](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L323)

Performs a bulk update of multiple documents in the collection.

#### Parameters

##### updates

`object`[]

Array of update operations.

#### Returns

`Promise`\<`void`\>

Resolves when the bulk update is complete.

***

### create()

> **create**(`doc`): `Promise`\<`T`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:245](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L245)

Creates a new document in the collection.

#### Parameters

##### doc

`OptionalUnlessRequiredId`\<`T`\>

The document to create.

#### Returns

`Promise`\<`T`\>

The created document with its `_id`.

***

### createIndex()

> **createIndex**(`fields`): `Promise`\<`void`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:865](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L865)

Creates an index on the specified fields in the collection.

#### Parameters

##### fields

`Partial`\<`Record`\<keyof `T`, `1` \| `-1`\>\>

The fields to index.

#### Returns

`Promise`\<`void`\>

Resolves when the index is created.

***

### deleteMany()

> **deleteMany**(`filter`): `Promise`\<`void`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:408](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L408)

Deletes multiple documents from the collection.

#### Parameters

##### filter

`Filter`\<`T`\>

The filter to find the documents to delete.

#### Returns

`Promise`\<`void`\>

Resolves when the documents are deleted.

***

### deleteOne()

> **deleteOne**(`filter`): `Promise`\<`void`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:392](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L392)

Deletes a single document from the collection.

#### Parameters

##### filter

`Filter`\<`T`\>

The filter to find the document to delete.

#### Returns

`Promise`\<`void`\>

Resolves when the document is deleted.

***

### deleteSecure()

> **deleteSecure**(`filter`, `user`): `Promise`\<`void`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:659](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L659)

Deletes a document securely with user authorization.

#### Parameters

##### filter

`Filter`\<`T`\>

The filter to find the document.

##### user

[`User`](../type-aliases/User.md)

The user performing the operation.

#### Returns

`Promise`\<`void`\>

Resolves when the document is deleted.

***

### deleteWithTransaction()

> **deleteWithTransaction**(`filter`): `Promise`\<`void`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:460](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L460)

Deletes a document with a transaction.

#### Parameters

##### filter

`Filter`\<`T`\>

The filter to find the document to delete.

#### Returns

`Promise`\<`void`\>

Resolves when the document is deleted.

***

### dropIndex()

> **dropIndex**(`indexName`): `Promise`\<`void`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:876](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L876)

Drops an index from the collection by its name.

#### Parameters

##### indexName

`string`

The name of the index to drop.

#### Returns

`Promise`\<`void`\>

Resolves when the index is dropped.

***

### find()

> **find**(`filter?`): `Promise`\<`T`[]\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:265](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L265)

Finds documents in the collection that match the filter.

#### Parameters

##### filter?

`Filter`\<`T`\> = `{}`

The filter to apply.

#### Returns

`Promise`\<`T`[]\>

An array of matching documents.

***

### findCached()

> **findCached**(`key`): `Promise`\<`any`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:507](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L507)

Finds a document in the cache by its key.

#### Parameters

##### key

`string`

The cache key.

#### Returns

`Promise`\<`any`\>

The cached result or `null` if not found.

***

### findOne()

> **findOne**(`filter`): `Promise`\<`T` \| `null`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:279](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L279)

Finds a single document in the collection that matches the filter.

#### Parameters

##### filter

`Filter`\<`T`\>

The filter to apply.

#### Returns

`Promise`\<`T` \| `null`\>

The matching document or `null` if not found.

#### Throws

If the filter is not a valid object.

***

### findOneAndDelete()

> **findOneAndDelete**(`filter`): `Promise`\<`T` \| `null`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:574](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L574)

Finds a document and deletes it from the collection.

#### Parameters

##### filter

`Filter`\<`T`\>

The filter to find the document.

#### Returns

`Promise`\<`T` \| `null`\>

The deleted document or `null` if not found.

***

### findOneAndReplace()

> **findOneAndReplace**(`filter`, `replacement`): `Promise`\<`T` \| `null`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:586](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L586)

Finds a document and replaces it with a new document.

#### Parameters

##### filter

`Filter`\<`T`\>

The filter to find the document.

##### replacement

`T`

The new document to replace the found document.

#### Returns

`Promise`\<`T` \| `null`\>

The replaced document or `null` if not found.

***

### findOneAndUpdate()

> **findOneAndUpdate**(`filter`, `update`): `Promise`\<`T` \| `null`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:563](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L563)

Finds a document and updates it in the collection.

#### Parameters

##### filter

`Filter`\<`T`\>

The filter to find the document.

##### update

`UpdateFilter`\<`T`\>

The update operation to perform.

#### Returns

`Promise`\<`T` \| `null`\>

The updated document or `null` if not found.

***

### findOneAndUpsert()

> **findOneAndUpsert**(`filter`, `update`): `Promise`\<`T` \| `null`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:598](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L598)

Finds a document and upserts it (inserts if not found).

#### Parameters

##### filter

`Filter`\<`T`\>

The filter to find the document.

##### update

`UpdateFilter`\<`T`\>

The update operation to perform.

#### Returns

`Promise`\<`T` \| `null`\>

The updated or inserted document.

***

### findOneAndUpsertWithTransaction()

> **findOneAndUpsertWithTransaction**(`filter`, `update`): `Promise`\<`T` \| `null`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:610](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L610)

Finds a document and upserts it (inserts if not found) with a transaction.

#### Parameters

##### filter

`Filter`\<`T`\>

The filter to find the document.

##### update

`UpdateFilter`\<`T`\>

The update operation to perform.

#### Returns

`Promise`\<`T` \| `null`\>

The updated or inserted document.

***

### findOneAndUpsertWithTransactionSecure()

> **findOneAndUpsertWithTransactionSecure**(`filter`, `update`, `user`): `Promise`\<`T` \| `null`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:634](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L634)

Finds a document and upserts it (inserts if not found) with a transaction and user authorization.

#### Parameters

##### filter

`Filter`\<`T`\>

The filter to find the document.

##### update

`UpdateFilter`\<`T`\>

The update operation to perform.

##### user

[`User`](../type-aliases/User.md)

The user performing the operation.

#### Returns

`Promise`\<`T` \| `null`\>

The updated or inserted document.

***

### getSchema()

> **getSchema**(): [`AbimongoSchema`](AbimongoSchema.md)\<`T`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:383](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L383)

#### Returns

[`AbimongoSchema`](AbimongoSchema.md)\<`T`\>

***

### init()

> **init**(): `Promise`\<`void`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:128](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L128)

Initializes the database connection and collection.

#### Returns

`Promise`\<`void`\>

#### Throws

If the collection name is not provided.

***

### invalidateDocumentCache()

> **invalidateDocumentCache**(`doc`): `Promise`\<`void`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:959](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L959)

Invalidates the cache for the specified document.

#### Parameters

##### doc

`T`

The document for which to invalidate the cache.

#### Returns

`Promise`\<`void`\>

Resolves when the cache is invalidated.

***

### invalidateModelPattern()

> **invalidateModelPattern**(`pattern`): `Promise`\<`number`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:944](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L944)

Instance method to invalidate cache patterns for this model's tenant context.

#### Parameters

##### pattern

`string`

Redis pattern to match keys (supports wildcards).

#### Returns

`Promise`\<`number`\>

Number of keys invalidated.

***

### off()

> **off**(`event`, `listener`): `void`

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:117](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L117)

#### Parameters

##### event

[`EventType`](../type-aliases/EventType.md)

##### listener

(...`args`) => `void`

#### Returns

`void`

***

### on()

> **on**(`event`, `listener`): `void`

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:111](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L111)

Subscribes to events emitted by the model.

#### Parameters

##### event

[`EventType`](../type-aliases/EventType.md)

The event type to subscribe to.

##### listener

(...`args`) => `void`

The callback function to execute when the event is emitted.

#### Returns

`void`

***

### once()

> **once**(`event`, `listener`): `void`

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:114](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L114)

#### Parameters

##### event

[`EventType`](../type-aliases/EventType.md)

##### listener

(...`args`) => `void`

#### Returns

`void`

***

### paginatedFind()

> **paginatedFind**(`filter`, `pageSize`, `lastId?`): `Promise`\<`T`[]\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:834](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L834)

Cursor-based pagination using _id comparison instead of skip.

#### Parameters

##### filter

`Partial`\<`T`\>

The filter for documents.

##### pageSize

`number`

Number of documents per page.

##### lastId?

`string`

Last document _id from the previous page.

#### Returns

`Promise`\<`T`[]\>

Array of documents for the current page.
This method uses the _id field for pagination, which is more efficient than using skip.

***

### populateMany()

> **populateMany**\<`K`\>(`doc`, `field`, `relatedModel`): `Promise`\<`T` & \{ \[key in string \| number \| symbol\]?: K\[\] \} \| `null`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:444](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L444)

Populates a field in a document with an array of related documents.

#### Type Parameters

##### K

`K` *extends* [`Document`](../type-aliases/Document.md)

#### Parameters

##### doc

`T`

The document to populate.

##### field

keyof `T`

The field to populate.

##### relatedModel

`AbimongoModel`\<`K`\>

The related model to fetch data from.

#### Returns

`Promise`\<`T` & \{ \[key in string \| number \| symbol\]?: K\[\] \} \| `null`\>

The populated document.

***

### populateOne()

> **populateOne**\<`K`\>(`doc`, `field`, `relatedModel`): `Promise`\<`T` & \{ \[key in string \| number \| symbol\]?: K \} \| `null`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:426](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L426)

Populates a single field in a document with data from a related model.

#### Type Parameters

##### K

`K` *extends* [`Document`](../type-aliases/Document.md)

#### Parameters

##### doc

`T`

The document to populate.

##### field

keyof `T`

The field to populate.

##### relatedModel

`AbimongoModel`\<`K`\>

The related model to fetch data from.

#### Returns

`Promise`\<`T` & \{ \[key in string \| number \| symbol\]?: K \} \| `null`\>

The populated document.

***

### registerModel()

> **registerModel**(`options`): `Promise`\<`void`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:160](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L160)

#### Parameters

##### options

[`AbimongoModelOptions`](../interfaces/AbimongoModelOptions.md)\<`T`\>

#### Returns

`Promise`\<`void`\>

***

### removeListener()

> **removeListener**(`event`, `listener`): `void`

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:120](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L120)

#### Parameters

##### event

[`EventType`](../type-aliases/EventType.md)

##### listener

(...`args`) => `void`

#### Returns

`void`

***

### runCommand()

> **runCommand**(`command`, ...`args`): `Promise`\<`any`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:1031](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L1031)

Runs a custom command on the collection.

#### Parameters

##### command

`string`

The command to run.

##### args

...`any`[]

The arguments for the command.

#### Returns

`Promise`\<`any`\>

The result of the command.

***

### runGC()

> **runGC**(): `Promise`\<`void`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:1041](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L1041)

Runs the garbage collector for expired documents.

#### Returns

`Promise`\<`void`\>

Resolves when the garbage collection is complete.

***

### runInTransaction()

> **runInTransaction**\<`T`\>(`operations`): `Promise`\<`T`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:749](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L749)

#### Type Parameters

##### T

`T`

#### Parameters

##### operations

(`session`) => `Promise`\<`T`\>

#### Returns

`Promise`\<`T`\>

***

### startAutoGC()

> **startAutoGC**(`intervalMs`): `void`

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:1071](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L1071)

Starts the automatic garbage collection process.

#### Parameters

##### intervalMs

`number` = `3600000`

The interval in milliseconds for the garbage collection to run.

#### Returns

`void`

***

### streamAggregation()

> **streamAggregation**\<`U`\>(`pipeline`, `options`): `Promise`\<`Readable` & `AsyncIterable`\<`U`, `any`, `any`\>\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:773](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L773)

Streaming aggregation - returns a cursor for large datasets

#### Type Parameters

##### U

`U` *extends* [`Document`](../type-aliases/Document.md)

#### Parameters

##### pipeline

`object`[]

MongoDB aggregation pipeline

##### options

`AggregateOptions` = `{}`

Aggregation options

#### Returns

`Promise`\<`Readable` & `AsyncIterable`\<`U`, `any`, `any`\>\>

Aggregation cursor for streaming results

***

### updateOne()

> **updateOne**(`filter`, `update`): `Promise`\<`void`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:296](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L296)

Updates a single document in the collection.

#### Parameters

##### filter

`Filter`\<`T`\>

The filter to find the document.

##### update

`UpdateFilter`\<`T`\>

The update operation to apply.

#### Returns

`Promise`\<`void`\>

Resolves when the update is complete.

***

### updateWithTransaction()

> **updateWithTransaction**(`filter`, `update`): `Promise`\<`void`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:486](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L486)

Updates a document with a transaction.

#### Parameters

##### filter

`Filter`\<`T`\>

The filter to find the document to update.

##### update

`UpdateFilter`\<`T`\>

The update operation to perform.

#### Returns

`Promise`\<`void`\>

Resolves when the document is updated.

***

### validate()

> **validate**(`doc`): `Promise`\<`T`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:211](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L211)

Validates a document against the schema.

#### Parameters

##### doc

`OptionalUnlessRequiredId`\<`T`\>

The document to validate.

#### Returns

`Promise`\<`T`\>

The validated document.

***

### warmCache()

> **warmCache**(`queries?`, `defaultTtl?`): `Promise`\<`void`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:1114](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L1114)

Pre-populates cache with frequently accessed data.

#### Parameters

##### queries?

`object`[]

Array of queries to pre-cache.

##### defaultTtl?

`number` = `3600`

#### Returns

`Promise`\<`void`\>

Resolves when cache warming is complete.

***

### watchChanges()

> **watchChanges**(`callback`): `ChangeStream`\<`T`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:854](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L854)

Watches changes in the collection using MongoDB Change Streams.

#### Parameters

##### callback

(`change`) => `void`

A function to invoke when a change occurs.

#### Returns

`ChangeStream`\<`T`\>

The change stream instance.

***

### cacheResult()

> `static` **cacheResult**(`key`, `data`, `ttl?`): `Promise`\<`void`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:526](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L526)

Caches a result with a specified key and time-to-live (TTL).

#### Parameters

##### key

`string`

The cache key.

##### data

`any`

The data to cache.

##### ttl?

`number` = `3600`

The time-to-live in seconds.

#### Returns

`Promise`\<`void`\>

Resolves when the data is cached.

***

### clearCache()

> `static` **clearCache**(`key`): `Promise`\<`void`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:544](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L544)

Clears a cached result by its key.

#### Parameters

##### key

`string`

The cache key.

#### Returns

`Promise`\<`void`\>

Resolves when the cache is cleared.

***

### getCacheStats()

> `static` **getCacheStats**(`tenantId?`): `Promise`\<`any`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:970](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L970)

Retrieves cache statistics for monitoring and optimization.

#### Parameters

##### tenantId?

`string`

Optional tenant ID to get tenant-specific stats.

#### Returns

`Promise`\<`any`\>

Object containing cache statistics.

***

### invalidatePattern()

> `static` **invalidatePattern**(`pattern`): `Promise`\<`number`\>

Defined in: [packages/core/src/lib-core/AbimongoModelFactory.ts:886](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoModelFactory.ts#L886)

Invalidates multiple cache entries matching a pattern.

#### Parameters

##### pattern

`string`

Redis pattern to match keys (supports wildcards).

#### Returns

`Promise`\<`number`\>

Number of keys invalidated.
