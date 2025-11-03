[**@abimongo/core v1.1.1**](../README.md)

***

[@abimongo/core](../README.md) / initAbimongo

# Class: initAbimongo

Defined in: [core/src/lib-core/bootstrap/AbimongoBootstrapFactory.ts:24](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/lib-core/bootstrap/AbimongoBootstrapFactory.ts#L24)

Factory class to create an instance of AbimongoBootstrap.
This class encapsulates the logic for initializing the Abimongo application stack,
including MongoDB, Redis, and GraphQL setup.
It can be used to create a fully configured Abimongo instance
with optional configuration parameters.

## Example

```ts
const abimongo = await AbimongoBootstrapFactory.create();
const db = abimongo.getMongoClient();
await db.connect();
const graphql = await abimongo.getGraphQL();
// You can now use the GraphQL instance to generate schema or start a server
// or perform other GraphQL related operations
graphql.generateSchema();
abimongo.getRedisClient();
// or with custom config
const abimongo = await AbimongoBootstrapFactory.create(customConfig);
```

## Param

Optional configuration object for Abimongo.

## Constructors

### Constructor

> **new initAbimongo**(): `AbimongoBootstrapFactory`

#### Returns

`AbimongoBootstrapFactory`

## Methods

### create()

> `static` **create**(`config?`): `Promise`\<[`AbimongoBootstrap`](AbimongoBootstrap.md)\>

Defined in: [core/src/lib-core/bootstrap/AbimongoBootstrapFactory.ts:25](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/lib-core/bootstrap/AbimongoBootstrapFactory.ts#L25)

#### Parameters

##### config?

[`AbimongoConfig`](../interfaces/AbimongoConfig.md)

#### Returns

`Promise`\<[`AbimongoBootstrap`](AbimongoBootstrap.md)\>
