# Interface: AbimongoModelOptions\<T\>

Defined in: packages/core/src/types/abimongo.mode.type.ts:9

Options for configuring an Abimongo model.

## Type Parameters

### T

`T` *extends* [`Document`](../type-aliases/Document.md) = `any`

The type of the document in the model.

## Properties

### client?

> `optional` **client**: `MongoClient`

Defined in: packages/core/src/types/abimongo.mode.type.ts:18

The MongoClient instance to use.

***

### collection?

> `optional` **collection**: `Collection`\<`T`\>

Defined in: packages/core/src/types/abimongo.mode.type.ts:38

The MongoDB collection instance.

***

### collectionName

> **collectionName**: `string`

Defined in: packages/core/src/types/abimongo.mode.type.ts:28

The name of the collection.

***

### db?

> `optional` **db**: `Db`

Defined in: packages/core/src/types/abimongo.mode.type.ts:13

The database instance to use.

***

### gcConfig?

> `optional` **gcConfig**: `object`

Defined in: packages/core/src/types/abimongo.mode.type.ts:42

The TTL (Time To Live) index configuration for garbage collection.

#### createdAtField?

> `optional` **createdAtField**: `string`

#### enableGC?

> `optional` **enableGC**: `boolean`

Whether to enable garbage collection for this model.

#### field?

> `optional` **field**: `string`

The field to use for garbage collection.

#### indexName?

> `optional` **indexName**: `string`

#### ttl

> **ttl**: `number`

#### updatedAtField?

> `optional` **updatedAtField**: `string`

***

### schema?

> `optional` **schema**: [`AbimongoSchema`](../classes/AbimongoSchema.md)\<`T`\>

Defined in: packages/core/src/types/abimongo.mode.type.ts:33

The schema definition for the model.

***

### tenantId?

> `optional` **tenantId**: `string`

Defined in: packages/core/src/types/abimongo.mode.type.ts:23

The tenant ID for multi-tenancy.
