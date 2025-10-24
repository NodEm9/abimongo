# Class: AbimongoBootstrapFactory

Defined in: packages/core/src/lib-core/bootstrap/AbimongoBootstrapFactory.ts:24

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

Defined in: packages/core/src/lib-core/bootstrap/AbimongoBootstrapFactory.ts:25

#### Parameters

##### config?

[`AbimongoConfig`](../interfaces/AbimongoConfig.md)

#### Returns

`Promise`\<[`AbimongoBootstrap`](AbimongoBootstrap.md)\>
