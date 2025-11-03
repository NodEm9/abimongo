[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / getCachedData

# Function: getCachedData()

> **getCachedData**(`role`, `key`): `Promise`\<`any`\>

Defined in: [core/src/middleware/rbac/rbacMiddleware.ts:83](https://github.com/NodEm9/abimongo/blob/b56d3e49490f7e6aca34ccfab09fd80573f057a5/packages/core/src/middleware/rbac/rbacMiddleware.ts#L83)

Get cached data for a specific role and key

## Parameters

### role

The role or tenant object

`string`[] | \{ `tenantId`: `string`; \}

### key

`string`

The key to retrieve from the cache

## Returns

`Promise`\<`any`\>

A promise that resolves to the cached data or null if not found
This function retrieves cached data from Redis based on the provided role and key.
It constructs a unique cache key using the role and key, checks if the data exists in the cache,
and returns the parsed data if found. If the data is not found, it logs a cache miss and returns null.

## Throws

If there is an issue with the Redis operation

## Example

```ts
// Get cached permissions for role 'admin'
const cachedPermissions = await getCachedData('admin', 'permissions');
if (cachedPermissions) {
  console.log('Cached permissions:', cachedPermissions);
} else {
 console.log('No cached permissions found');
}
```
