[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / AbimongoBootstrapFactory

# Class: AbimongoBootstrapFactory

Defined in: [packages/core/src/lib-core/bootstrap/AbimongoBootstrapFactory.ts:26](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/bootstrap/AbimongoBootstrapFactory.ts#L26)

## Remark

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

## Static

- This method is static and can be called without instantiating the factory class.

## Param

Optional configuration object for Abimongo.

## Method

create

## Constructors

### Constructor

> **new AbimongoBootstrapFactory**(): `AbimongoBootstrapFactory`

#### Returns

`AbimongoBootstrapFactory`

## Methods

### create()

> `static` **create**(`config?`): `Promise`\<[`AbimongoBootstrap`](AbimongoBootstrap.md)\>

Defined in: [packages/core/src/lib-core/bootstrap/AbimongoBootstrapFactory.ts:27](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/bootstrap/AbimongoBootstrapFactory.ts#L27)

#### Parameters

##### config?

[`AbimongoConfig`](../interfaces/AbimongoConfig.md)

#### Returns

`Promise`\<[`AbimongoBootstrap`](AbimongoBootstrap.md)\>
