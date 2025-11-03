[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / AbimongoClientConfig

# Interface: AbimongoClientConfig

Defined in: [core/src/types/abimongo.client.type.ts:9](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/core/src/types/abimongo.client.type.ts#L9)

Configuration options for the AbimongoClient.

## Properties

### client?

> `optional` **client**: `MongoClient`

Defined in: [core/src/types/abimongo.client.type.ts:23](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/core/src/types/abimongo.client.type.ts#L23)

An optional MongoClient instance.

***

### options?

> `optional` **options**: [`AbimongoClientOptions`](AbimongoClientOptions.md)

Defined in: [core/src/types/abimongo.client.type.ts:18](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/core/src/types/abimongo.client.type.ts#L18)

Optional configuration options for the client.

***

### uri

> **uri**: `string`

Defined in: [core/src/types/abimongo.client.type.ts:13](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/core/src/types/abimongo.client.type.ts#L13)

The MongoDB connection URI.
