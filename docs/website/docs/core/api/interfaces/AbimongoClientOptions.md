[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / AbimongoClientOptions

# Interface: AbimongoClientOptions

Defined in: [core/src/types/abimongo.client.type.ts:29](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/core/src/types/abimongo.client.type.ts#L29)

Options for configuring the AbimongoClient.

## Properties

### client?

> `optional` **client**: `MongoClient`

Defined in: [core/src/types/abimongo.client.type.ts:43](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/core/src/types/abimongo.client.type.ts#L43)

An optional MongoClient instance.

***

### collectionName?

> `optional` **collectionName**: `string`

Defined in: [core/src/types/abimongo.client.type.ts:38](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/core/src/types/abimongo.client.type.ts#L38)

The name of the collection to use.

***

### config?

> `optional` **config**: [`AbimongoConfig`](AbimongoConfig.md)

Defined in: [core/src/types/abimongo.client.type.ts:48](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/core/src/types/abimongo.client.type.ts#L48)

Optional configuration for Abimongo.

***

### dbName?

> `optional` **dbName**: `string`

Defined in: [core/src/types/abimongo.client.type.ts:33](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/core/src/types/abimongo.client.type.ts#L33)

The name of the database to connect to.
