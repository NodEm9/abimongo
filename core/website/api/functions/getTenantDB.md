[**@abimongo/core v1.4.14**](../README.md)

***

[@abimongo/core](../README.md) / getTenantDB

# Function: getTenantDB()

> **getTenantDB**(`tenantId`): `Promise`\<`Db`\>

Defined in: [src/utils/builders/getTanantDb.ts:15](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/utils/builders/getTanantDb.ts#L15)

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
