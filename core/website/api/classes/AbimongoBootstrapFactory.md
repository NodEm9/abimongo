[**@abimongo/core v1.4.14**](../README.md)

***

[@abimongo/core](../README.md) / AbimongoBootstrapFactory

# Class: AbimongoBootstrapFactory

Defined in: [src/core/bootstrap/AbimongoBootstrapFactory.ts:24](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/bootstrap/AbimongoBootstrapFactory.ts#L24)

Factory class to create an instance of AbimongoBootstrap.
This class encapsulates the logic for initializing the Abimongo application stack,
including MongoDB, Redis, and GraphQL setup.
It can be used to create a fully configured Abimongo instance
with optional configuration parameters.

## Example

```ts
const abimongo = await AbimongoBootstrapFactory.create({
 mongoUri: 'mongodb://localhost:27017/mydb',
graphql: {
  enabled: true,
 schemaPath: './schema.graphql',
 resolversPath: './resolvers',
 context: () => ({ user: null }),
features: {
 useRedisCache: true,
redisUri: 'redis://localhost:6379',
},
});
```

## Constructors

### Constructor

> **new AbimongoBootstrapFactory**(): `AbimongoBootstrapFactory`

#### Returns

`AbimongoBootstrapFactory`

## Methods

### create()

> `static` **create**(`config?`): `Promise`\<[`AbimongoBootstrap`](AbimongoBootstrap.md)\>

Defined in: [src/core/bootstrap/AbimongoBootstrapFactory.ts:25](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/bootstrap/AbimongoBootstrapFactory.ts#L25)

#### Parameters

##### config?

[`AbimongoConfig`](../interfaces/AbimongoConfig.md)

#### Returns

`Promise`\<[`AbimongoBootstrap`](AbimongoBootstrap.md)\>
