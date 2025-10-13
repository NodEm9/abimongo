[**@abimongo/core v1.4.14**](../README.md)

***

[@abimongo/core](../README.md) / cacheWithRedis

# Function: cacheWithRedis()

> **cacheWithRedis**\<`T`\>(`client`, `key`, `fetcher`, `options`): `Promise`\<`T`\>

Defined in: [src/utils/cacheWithRedis.ts:27](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/utils/cacheWithRedis.ts#L27)

Caches a value in Redis with optional tenant and namespace scoping.
If the value is not found in cache, it runs the provided fetcher function
to get the value, caches it, and then returns it.

## Type Parameters

### T

`T`

## Parameters

### client

`RedisClientType`\<`object` & `RedisModules`, `RedisFunctions`, `RedisScripts`\>

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
