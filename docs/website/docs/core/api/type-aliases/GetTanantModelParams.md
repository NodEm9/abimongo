[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / GetTanantModelParams

# Type Alias: GetTanantModelParams\<T\>

> **GetTanantModelParams**\<`T`\> = `object`

Defined in: [packages/core/src/tanancy/TenantModelResolver.ts:12](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/tanancy/TenantModelResolver.ts#L12)

Parameters required to resolve a tenant-specific model.

## Type Parameters

### T

`T` *extends* [`Document`](Document.md)

The type of the document in the model.

## Properties

### modelName

> **modelName**: `string`

Defined in: [packages/core/src/tanancy/TenantModelResolver.ts:16](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/tanancy/TenantModelResolver.ts#L16)

The name of the model to resolve.

***

### schema?

> `optional` **schema**: [`AbimongoSchema`](../classes/AbimongoSchema.md)\<`T`\>

Defined in: [packages/core/src/tanancy/TenantModelResolver.ts:26](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/tanancy/TenantModelResolver.ts#L26)

The schema definition for the model (optional).

***

### tenantId

> **tenantId**: `string`

Defined in: [packages/core/src/tanancy/TenantModelResolver.ts:21](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/tanancy/TenantModelResolver.ts#L21)

The ID of the tenant for which the model is being resolved.
