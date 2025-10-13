[**@abimongo/core v1.4.14**](../README.md)

***

[@abimongo/core](../README.md) / AbimongoBootstrap

# Class: AbimongoBootstrap

Defined in: [src/core/bootstrap/AbimongoBootstrap.ts:31](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/bootstrap/AbimongoBootstrap.ts#L31)

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

Defined in: [src/core/bootstrap/AbimongoBootstrap.ts:42](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/bootstrap/AbimongoBootstrap.ts#L42)

#### Returns

`AbimongoBootstrap`

## Properties

### logger

> **logger**: `any`

Defined in: [src/core/bootstrap/AbimongoBootstrap.ts:37](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/bootstrap/AbimongoBootstrap.ts#L37)

## Methods

### cache()

> **cache**\<`T`\>(`key`, `fetcher`, `options`): `Promise`\<`T`\>

Defined in: [src/core/bootstrap/AbimongoBootstrap.ts:220](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/bootstrap/AbimongoBootstrap.ts#L220)

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

### getGraphQL()

> **getGraphQL**(): `undefined` \| [`AbimongoGraphQL`](AbimongoGraphQL.md)

Defined in: [src/core/bootstrap/AbimongoBootstrap.ts:264](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/bootstrap/AbimongoBootstrap.ts#L264)

#### Returns

`undefined` \| [`AbimongoGraphQL`](AbimongoGraphQL.md)

***

### getModel()

> **getModel**(): `undefined` \| [`AbimongoModel`](AbimongoModel.md)\<[`Document`](../type-aliases/Document.md)\>

Defined in: [src/core/bootstrap/AbimongoBootstrap.ts:257](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/bootstrap/AbimongoBootstrap.ts#L257)

#### Returns

`undefined` \| [`AbimongoModel`](AbimongoModel.md)\<[`Document`](../type-aliases/Document.md)\>

***

### getMongoClient()

> **getMongoClient**(): `undefined` \| [`AbimongoClient`](AbimongoClient.md)

Defined in: [src/core/bootstrap/AbimongoBootstrap.ts:253](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/bootstrap/AbimongoBootstrap.ts#L253)

#### Returns

`undefined` \| [`AbimongoClient`](AbimongoClient.md)

***

### getRedisClient()

> **getRedisClient**(): `Promise`\<`RedisClientType`\<`object` & `RedisModules`, `RedisFunctions`, `RedisScripts`\>\>

Defined in: [src/core/bootstrap/AbimongoBootstrap.ts:245](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/bootstrap/AbimongoBootstrap.ts#L245)

Returns the Redis client if Redis is enabled in the configuration.

#### Returns

`Promise`\<`RedisClientType`\<`object` & `RedisModules`, `RedisFunctions`, `RedisScripts`\>\>

A promise that resolves to the Redis client.

***

### getSchema()

> **getSchema**(): `undefined` \| [`AbimongoSchema`](AbimongoSchema.md)\<[`Document`](../type-aliases/Document.md)\>

Defined in: [src/core/bootstrap/AbimongoBootstrap.ts:260](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/bootstrap/AbimongoBootstrap.ts#L260)

#### Returns

`undefined` \| [`AbimongoSchema`](AbimongoSchema.md)\<[`Document`](../type-aliases/Document.md)\>

***

### initialize()

> **initialize**(`configFilePath?`): `Promise`\<`void`\>

Defined in: [src/core/bootstrap/AbimongoBootstrap.ts:60](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/bootstrap/AbimongoBootstrap.ts#L60)

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

Defined in: [src/core/bootstrap/AbimongoBootstrap.ts:234](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/bootstrap/AbimongoBootstrap.ts#L234)

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

Defined in: [src/core/bootstrap/AbimongoBootstrap.ts:49](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/bootstrap/AbimongoBootstrap.ts#L49)

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

Defined in: [src/core/bootstrap/AbimongoBootstrap.ts:196](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/bootstrap/AbimongoBootstrap.ts#L196)

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

Defined in: [src/core/bootstrap/AbimongoBootstrap.ts:268](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/bootstrap/AbimongoBootstrap.ts#L268)

#### Returns

`Promise`\<`void`\>
