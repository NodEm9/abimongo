# Class: RedisService

Defined in: packages/core/src/redis-manager/redisClient.ts:41

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

Defined in: packages/core/src/redis-manager/redisClient.ts:90

#### Returns

`Promise`\<`void`\>

***

### getClient()

> **getClient**(): `Promise`\<`RedisClientType`\>

Defined in: packages/core/src/redis-manager/redisClient.ts:83

#### Returns

`Promise`\<`RedisClientType`\>

***

### getInstance()

> `static` **getInstance**(): `RedisService`

Defined in: packages/core/src/redis-manager/redisClient.ts:52

#### Returns

`RedisService`
