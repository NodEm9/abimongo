[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / cacheWithRedis

# Function: cacheWithRedis()

> **cacheWithRedis**\<`T`\>(`client`, `key`, `fetcher`, `options`): `Promise`\<`T`\>

Defined in: [packages/core/src/utils/cacheWithRedis.ts:29](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/utils/cacheWithRedis.ts#L29)

Caches a value in Redis with optional tenant and namespace scoping.
If the value is not found in cache, it runs the provided fetcher function
to get the value, caches it, and then returns it.

## Type Parameters

### T

`T`

## Parameters

### client

`RedisClientType`

### key

`string`

The cache key to use.

### fetcher

() => `Promise`\<`T`\>

A function that fetches the value if not cached.

### options

`CacheOptions` = `{}`

Options for caching behavior.

## Returns

`Promise`\<`T`\>

- The cached or fetched value.

## Example

```ts
const value = await cacheWithRedis(redisClient, 'myKey', async () => {
  // Fetch from database or external API
 return await fetchDataFromSource();
```
