# Class: AbimongoBootstrap

Defined in: packages/core/src/lib-core/bootstrap/AbimongoBootstrap.ts:34

AbimongoBootstrap is the main entry point for initializing
and managing the Abimongo application stack when you opt for the CLI.
It handles MongoDB, Redis, and GraphQL setup,
along with custom hooks for post-connection logic.
*

## Example

```ts
const abimongo = new AbimongoBootstrap();
await abimongo.initialize();
// Now you can use abimongo.getMongoClient(), abimongo.getRedisClient(), etc.
```

## Constructors

### Constructor

> **new AbimongoBootstrap**(): `AbimongoBootstrap`

Defined in: packages/core/src/lib-core/bootstrap/AbimongoBootstrap.ts:46

#### Returns

`AbimongoBootstrap`

## Methods

### cache()

> **cache**\<`T`\>(`key`, `fetcher`, `options`): `Promise`\<`T`\>

Defined in: packages/core/src/lib-core/bootstrap/AbimongoBootstrap.ts:215

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

Defined in: packages/core/src/lib-core/bootstrap/AbimongoBootstrap.ts:267

#### Returns

[`AbimongoGC`](AbimongoGC.md) \| `undefined`

***

### getGraphQL()

> **getGraphQL**(): [`AbimongoGraphQL`](AbimongoGraphQL.md) \| `undefined`

Defined in: packages/core/src/lib-core/bootstrap/AbimongoBootstrap.ts:263

#### Returns

[`AbimongoGraphQL`](AbimongoGraphQL.md) \| `undefined`

***

### getModel()

> **getModel**(): [`AbimongoModel`](AbimongoModel.md)\<[`Document`](../type-aliases/Document.md)\> \| `undefined`

Defined in: packages/core/src/lib-core/bootstrap/AbimongoBootstrap.ts:256

#### Returns

[`AbimongoModel`](AbimongoModel.md)\<[`Document`](../type-aliases/Document.md)\> \| `undefined`

***

### getMongoClient()

> **getMongoClient**(): [`AbimongoClient`](AbimongoClient.md) \| `undefined`

Defined in: packages/core/src/lib-core/bootstrap/AbimongoBootstrap.ts:248

#### Returns

[`AbimongoClient`](AbimongoClient.md) \| `undefined`

***

### getRedisClient()

> **getRedisClient**(): `Promise`\<`RedisClientType`\<`object` & `RedisModules`, `RedisFunctions`, `RedisScripts`\>\>

Defined in: packages/core/src/lib-core/bootstrap/AbimongoBootstrap.ts:240

Returns the Redis client if Redis is enabled in the configuration.

#### Returns

`Promise`\<`RedisClientType`\<`object` & `RedisModules`, `RedisFunctions`, `RedisScripts`\>\>

A promise that resolves to the Redis client.

***

### getSchema()

> **getSchema**(): [`AbimongoSchema`](AbimongoSchema.md)\<[`Document`](../type-aliases/Document.md)\> \| `undefined`

Defined in: packages/core/src/lib-core/bootstrap/AbimongoBootstrap.ts:259

#### Returns

[`AbimongoSchema`](AbimongoSchema.md)\<[`Document`](../type-aliases/Document.md)\> \| `undefined`

***

### initialize()

> **initialize**(`configFilePath?`): `Promise`\<`void`\>

Defined in: packages/core/src/lib-core/bootstrap/AbimongoBootstrap.ts:64

Initializes the Abimongo application stack.
This method sets up MongoDB, Redis, and GraphQL connections,
and executes any registered onConnect hooks.

#### Parameters

##### configFilePath?

`string`

Optional path to a custom configuration file.
If not provided, it defaults to 'abimongo.config.json'.

#### Returns

`Promise`\<`void`\>

***

### invalidateCache()

> **invalidateCache**(`tenantId`, `namespace?`): `Promise`\<`void`\>

Defined in: packages/core/src/lib-core/bootstrap/AbimongoBootstrap.ts:229

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

Defined in: packages/core/src/lib-core/bootstrap/AbimongoBootstrap.ts:53

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

Defined in: packages/core/src/lib-core/bootstrap/AbimongoBootstrap.ts:191

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

Defined in: packages/core/src/lib-core/bootstrap/AbimongoBootstrap.ts:271

#### Returns

`Promise`\<`void`\>
