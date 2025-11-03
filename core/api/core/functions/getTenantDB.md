# Function: getTenantDB()

> **getTenantDB**(`tenantId`): `Promise`\<`Db`\>

Defined in: [core/src/utils/builders/getTenantDb.ts:15](https://github.com/NodEm9/abimongo/blob/23b90ad9d93280ea8ebc9947a72a9ef2957d29c0/packages/core/src/utils/builders/getTenantDb.ts#L15)

Retrieves the database instance for a specific tenant.
If the database is already cached, it returns the cached instance.
Otherwise, it uses `abimongo` to get the database for the tenant and caches it.

## Parameters

### tenantId

`string`

The ID of the tenant whose database is to be retrieved.

## Returns

`Promise`\<`Db`\>

A promise that resolves to the MongoDB database instance for the tenant.

## Throws

If the database for the specified tenant is not found.
