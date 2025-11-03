[**@abimongo/core v1.1.1**](../README.md)

***

[@abimongo/core](../README.md) / RedisService

# Class: RedisService

Defined in: [core/src/redis-manager/redisClient.ts:66](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/redis-manager/redisClient.ts#L66)

## Constructors

### Constructor

> **new RedisService**(): `RedisService`

#### Returns

`RedisService`

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [core/src/redis-manager/redisClient.ts:82](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/redis-manager/redisClient.ts#L82)

#### Returns

`Promise`\<`void`\>

***

### connect()

> **connect**(`url?`): `Promise`\<`void`\>

Defined in: [core/src/redis-manager/redisClient.ts:70](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/redis-manager/redisClient.ts#L70)

#### Parameters

##### url?

`string`

#### Returns

`Promise`\<`void`\>

***

### getClient()

> **getClient**(): `Promise`\<`RedisClientType`\>

Defined in: [core/src/redis-manager/redisClient.ts:79](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/redis-manager/redisClient.ts#L79)

#### Returns

`Promise`\<`RedisClientType`\>

The connected Redis client.

#### Throws

Error if Redis is not connected.

***

### getInstance()

> `static` **getInstance**(): `RedisService`

Defined in: [core/src/redis-manager/redisClient.ts:67](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/redis-manager/redisClient.ts#L67)

#### Returns

`RedisService`
