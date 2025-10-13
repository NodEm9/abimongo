[**@abimongo/core v1.4.14**](../README.md)

***

[@abimongo/core](../README.md) / RedisService

# Class: RedisService

Defined in: [src/redis-manager/redisClient.ts:41](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/redis-manager/redisClient.ts#L41)

Singleton RedisService to manage Redis connections.
Ensures a single instance is used throughout the application.
Handles connection, disconnection, and client retrieval.
Automatically connects to Redis on instantiation.
*

## Example

```ts
const redisService = RedisService.getInstance();
await redisService.connect('redis://localhost:6379');
const client = redisService.getClient();
// Use the client for Redis operations
await redisService.disconnect();
```

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [src/redis-manager/redisClient.ts:90](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/redis-manager/redisClient.ts#L90)

#### Returns

`Promise`\<`void`\>

***

### getClient()

> **getClient**(): `Promise`\<`RedisClientType`\>

Defined in: [src/redis-manager/redisClient.ts:83](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/redis-manager/redisClient.ts#L83)

#### Returns

`Promise`\<`RedisClientType`\>

***

### getInstance()

> `static` **getInstance**(): `RedisService`

Defined in: [src/redis-manager/redisClient.ts:52](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/redis-manager/redisClient.ts#L52)

#### Returns

`RedisService`
