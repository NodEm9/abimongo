[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / AbimongoBootstrap

# Class: AbimongoBootstrap

Defined in: [core/src/lib-core/bootstrap/AbimongoBootstrap.ts:97](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/core/src/lib-core/bootstrap/AbimongoBootstrap.ts#L97)

AbimongoBootstrap is the main entry point for initializing
and managing the Abimongo application stack when you opt for the CLI.
It handles MongoDB, Redis, and GraphQL setup,
along with custom hooks for post-connection logic.

## Examples

```bash
npx abimongo-core my-project 
cd my-project
```

This will create a new Abimongo project in the 'my-project' directory.
You can then customize the configuration file and start using Abimongo in your application.

---

Add flags as needed:

```bash
npx abimongo-core my-project --withRedis --withGraphQL --multiTenant
cd my-project
```
This will create a new Abimongo project with Redis caching, GraphQL support, and multi-tenancy enabled.
enabling them in the configuration file.

---

You can also use AbimongoBootstrap programmatically in your application:
```ts
@example
import { AbimongoBootstrapFactory } from '@abimongo/core';
 async function start() {
  const abimongo = await AbimongoBootstrapFactory.create();
  const db = abimongo.getMongoClient();
  await db.connect();
  const graphql = await abimongo.getGraphQL();
  // You can now use the GraphQL instance to generate schema or start a server
  // or perform other GraphQL related operations
 graphql.generateSchema();
 abimongo.getRedisClient();
 }
start();
```

```ts
// With custom configuration file
import { AbimongoBootstrapFactory } from '@abimongo/core';
export async function start() {
 const abimongo = await AbimongoBootstrapFactory.create('path/to/custom-abimongo.config.json');
const db = abimongo.getMongoClient();
await db.connect();
 const graphql = await abimongo.getGraphQL();
 // You can now use the GraphQL instance to generate schema or start a server
// or perform other GraphQL related operations
graphql.generateSchema();
abimongo.getRedisClient();
}

abimongo.registerMultiTenancy(app, {
 'tenant1': 'mongodb://localhost:27017/tenant1db',
 'tenant2': 'mongodb://localhost:27017/tenant2db',
}, {
headerKey: 'x-tenant-id',
initOptions: { /* custom options * / } // This where you can lazily initialize tenants if needed
});
};
 *
```

## Param

Optional path to a custom configuration file or a config object.
If not provided, it defaults to 'abimongo.config.json'.

## Constructors

### Constructor

> **new AbimongoBootstrap**(): `AbimongoBootstrap`

Defined in: [core/src/lib-core/bootstrap/AbimongoBootstrap.ts:109](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/core/src/lib-core/bootstrap/AbimongoBootstrap.ts#L109)

#### Returns

`AbimongoBootstrap`

## Properties

### logger

> **logger**: `ILogger` \| `AbimongoLogger`

Defined in: [core/src/lib-core/bootstrap/AbimongoBootstrap.ts:103](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/core/src/lib-core/bootstrap/AbimongoBootstrap.ts#L103)

## Methods

### cache()

> **cache**\<`T`\>(`key`, `fetcher`, `options`): `Promise`\<`T`\>

Defined in: [core/src/lib-core/bootstrap/AbimongoBootstrap.ts:281](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/core/src/lib-core/bootstrap/AbimongoBootstrap.ts#L281)

#### Type Parameters

##### T

`T`

#### Parameters

##### key

`string`

##### fetcher

() => `Promise`\<`T`\>

##### options

###### namespace?

`string`

###### prefix?

`string`

###### tenantId?

`string`

###### ttlSeconds?

`number`

#### Returns

`Promise`\<`T`\>

***

### getGCRunner()

> **getGCRunner**(): [`AbimongoGC`](AbimongoGC.md) \| `undefined`

Defined in: [core/src/lib-core/bootstrap/AbimongoBootstrap.ts:333](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/core/src/lib-core/bootstrap/AbimongoBootstrap.ts#L333)

#### Returns

[`AbimongoGC`](AbimongoGC.md) \| `undefined`

***

### getGraphQL()

> **getGraphQL**(): [`AbimongoGraphQL`](AbimongoGraphQL.md) \| `undefined`

Defined in: [core/src/lib-core/bootstrap/AbimongoBootstrap.ts:329](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/core/src/lib-core/bootstrap/AbimongoBootstrap.ts#L329)

#### Returns

[`AbimongoGraphQL`](AbimongoGraphQL.md) \| `undefined`

***

### getModel()

> **getModel**(): [`AbimongoModel`](AbimongoModel.md)\<[`Document`](../type-aliases/Document.md)\> \| `undefined`

Defined in: [core/src/lib-core/bootstrap/AbimongoBootstrap.ts:322](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/core/src/lib-core/bootstrap/AbimongoBootstrap.ts#L322)

#### Returns

[`AbimongoModel`](AbimongoModel.md)\<[`Document`](../type-aliases/Document.md)\> \| `undefined`

***

### getMongoClient()

> **getMongoClient**(): [`AbimongoClient`](AbimongoClient.md) \| `undefined`

Defined in: [core/src/lib-core/bootstrap/AbimongoBootstrap.ts:314](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/core/src/lib-core/bootstrap/AbimongoBootstrap.ts#L314)

#### Returns

[`AbimongoClient`](AbimongoClient.md) \| `undefined`

***

### getRedisClient()

> **getRedisClient**(): `Promise`\<`any`\>

Defined in: [core/src/lib-core/bootstrap/AbimongoBootstrap.ts:306](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/core/src/lib-core/bootstrap/AbimongoBootstrap.ts#L306)

Returns the Redis client if Redis is enabled in the configuration.

#### Returns

`Promise`\<`any`\>

A promise that resolves to the Redis client.

***

### getSchema()

> **getSchema**(): [`AbimongoSchema`](AbimongoSchema.md)\<[`Document`](../type-aliases/Document.md)\> \| `undefined`

Defined in: [core/src/lib-core/bootstrap/AbimongoBootstrap.ts:325](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/core/src/lib-core/bootstrap/AbimongoBootstrap.ts#L325)

#### Returns

[`AbimongoSchema`](AbimongoSchema.md)\<[`Document`](../type-aliases/Document.md)\> \| `undefined`

***

### initialize()

> **initialize**(`configFilePathOrObject?`): `Promise`\<`void`\>

Defined in: [core/src/lib-core/bootstrap/AbimongoBootstrap.ts:127](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/core/src/lib-core/bootstrap/AbimongoBootstrap.ts#L127)

Initializes the Abimongo application stack.
This method sets up MongoDB, Redis, and GraphQL connections,
and executes any registered onConnect hooks.

#### Parameters

##### configFilePathOrObject?

Optional path to a custom configuration file or a config object.
If not provided, it defaults to 'abimongo.config.json'.

`string` | [`AbimongoConfig`](../interfaces/AbimongoConfig.md)

#### Returns

`Promise`\<`void`\>

***

### invalidateCache()

> **invalidateCache**(`tenantId`, `namespace?`): `Promise`\<`void`\>

Defined in: [core/src/lib-core/bootstrap/AbimongoBootstrap.ts:295](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/core/src/lib-core/bootstrap/AbimongoBootstrap.ts#L295)

#### Parameters

##### tenantId

`string`

##### namespace?

`string`

#### Returns

`Promise`\<`void`\>

***

### onConnect()

> **onConnect**(`hook`): `void`

Defined in: [core/src/lib-core/bootstrap/AbimongoBootstrap.ts:116](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/core/src/lib-core/bootstrap/AbimongoBootstrap.ts#L116)

Register a hook to be called after the connection is established.
This can be used for custom initialization logic that depends on the database being ready.

#### Parameters

##### hook

`OnConnectHook`

A function that will be called after the connection is established.

#### Returns

`void`

***

### registerMultiTenancy()

> **registerMultiTenancy**(`application`, `tenants`, `options`): `Promise`\<`void`\>

Defined in: [core/src/lib-core/bootstrap/AbimongoBootstrap.ts:257](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/core/src/lib-core/bootstrap/AbimongoBootstrap.ts#L257)

#### Parameters

##### application

`Application`

##### tenants

`Record`\<`string`, `string`\>

##### options

###### headerKey?

`string`

###### initOptions?

[`InitMultiTenancyOptions`](../interfaces/InitMultiTenancyOptions.md)

#### Returns

`Promise`\<`void`\>

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [core/src/lib-core/bootstrap/AbimongoBootstrap.ts:337](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/core/src/lib-core/bootstrap/AbimongoBootstrap.ts#L337)

#### Returns

`Promise`\<`void`\>
