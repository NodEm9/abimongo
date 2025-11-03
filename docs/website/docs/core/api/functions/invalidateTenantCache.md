[**@abimongo/core v1.1.1**](../README.md)

***

[@abimongo/core](../README.md) / invalidateTenantCache

# Function: invalidateTenantCache()

> **invalidateTenantCache**(`tenantId`, `role`): `Promise`\<`void`\>

Defined in: [core/src/middleware/rbac/rbacMiddleware.ts:159](https://github.com/NodEm9/abimongo/blob/e9f185bc0c40bc037acc1c4cf3d4db09dd62229c/packages/core/src/middleware/rbac/rbacMiddleware.ts#L159)

Invalidate the cache for a specific tenant and role

## Parameters

### tenantId

`string`

The ID of the tenant

### role

`string`

The role to invalidate cache for

## Returns

`Promise`\<`void`\>

This function removes the cached permissions for the specified tenant and role.
It is useful when permissions change and you want to ensure the cache reflects the latest state.
It logs the invalidation action and deletes the cache entry from Redis.
This is particularly important in multi-tenant applications where each tenant may have different permissions.

## Throws

If there is an issue with the Redis operation

## Example

```ts
// Invalidate cache for tenant 'tenant123' with role 'admin'
await invalidateTenantCache('tenant123', 'admin');