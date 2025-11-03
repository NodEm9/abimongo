# Interface: AbimongoModelOptions\<T\>

Defined in: [core/src/types/abimongo.mode.type.ts:9](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/core/src/types/abimongo.mode.type.ts#L9)

Options for configuring an Abimongo model.

## Type Parameters

### T

`T` *extends* [`Document`](../type-aliases/Document.md) = `any`

The type of the document in the model.

## Properties

### client?

> `optional` **client**: `MongoClient`

Defined in: [core/src/types/abimongo.mode.type.ts:18](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/core/src/types/abimongo.mode.type.ts#L18)

The MongoClient instance to use.

***

### collection?

> `optional` **collection**: `Collection`\<`T`\>

Defined in: [core/src/types/abimongo.mode.type.ts:38](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/core/src/types/abimongo.mode.type.ts#L38)

The MongoDB collection instance.

***

### collectionName

> **collectionName**: `string`

Defined in: [core/src/types/abimongo.mode.type.ts:28](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/core/src/types/abimongo.mode.type.ts#L28)

The name of the collection.

***

### db?

> `optional` **db**: `Db`

Defined in: [core/src/types/abimongo.mode.type.ts:13](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/core/src/types/abimongo.mode.type.ts#L13)

The database instance to use.

***

### gcConfig?

> `optional` **gcConfig**: `object`

Defined in: [core/src/types/abimongo.mode.type.ts:42](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/core/src/types/abimongo.mode.type.ts#L42)

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

Defined in: [core/src/types/abimongo.mode.type.ts:33](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/core/src/types/abimongo.mode.type.ts#L33)

The schema definition for the model.

***

### tenantId?

> `optional` **tenantId**: `string`

Defined in: [core/src/types/abimongo.mode.type.ts:23](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/core/src/types/abimongo.mode.type.ts#L23)

The tenant ID for multi-tenancy.
