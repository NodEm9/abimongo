[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / RedisService

# Class: RedisService

Defined in: [packages/core/src/redis-manager/redisClient.ts:42](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/redis-manager/redisClient.ts#L42)

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

## Params

options RedisOptions - Configuration options for Redis connection.

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [packages/core/src/redis-manager/redisClient.ts:96](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/redis-manager/redisClient.ts#L96)

#### Returns

`Promise`\<`void`\>

***

### connect()

> **connect**(): `Promise`\<`void`\>

Defined in: [packages/core/src/redis-manager/redisClient.ts:76](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/redis-manager/redisClient.ts#L76)

Connect to the Redis server.

#### Returns

`Promise`\<`void`\>

```ts
Promise<void>
```

***

### getClient()

> **getClient**(): `Promise`\<`RedisClientType`\>

Defined in: [packages/core/src/redis-manager/redisClient.ts:89](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/redis-manager/redisClient.ts#L89)

#### Returns

`Promise`\<`RedisClientType`\>

```ts
Promise<RedisClientType> The connected Redis client.
```

#### Throws

Error if Redis is not connected.

***

### getInstance()

> `static` **getInstance**(): `RedisService`

Defined in: [packages/core/src/redis-manager/redisClient.ts:57](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/redis-manager/redisClient.ts#L57)

Get the singleton instance of RedisService.

#### Returns

`RedisService`

RedisService The singleton RedisService instance.
