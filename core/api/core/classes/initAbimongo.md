# Class: initAbimongo

Defined in: [core/src/lib-core/bootstrap/AbimongoBootstrapFactory.ts:24](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/core/src/lib-core/bootstrap/AbimongoBootstrapFactory.ts#L24)

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

Defined in: [core/src/lib-core/bootstrap/AbimongoBootstrapFactory.ts:25](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/core/src/lib-core/bootstrap/AbimongoBootstrapFactory.ts#L25)

#### Parameters

##### config?

[`AbimongoConfig`](../interfaces/AbimongoConfig.md)

#### Returns

`Promise`\<[`AbimongoBootstrap`](AbimongoBootstrap.md)\>
