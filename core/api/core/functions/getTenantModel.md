# Function: getTenantModel()

> **getTenantModel**\<`T`\>(`param`): `Promise`\<`any`\>

Defined in: [core/src/tanancy/TenantModelResolver.ts:56](https://github.com/NodEm9/abimongo/blob/3e138ae382a8e575025463fa0581dc3e88325be9/packages/core/src/tanancy/TenantModelResolver.ts#L56)

Resolves a tenant-specific model by creating or retrieving it from the cache.
Ensures that each tenant has its own isolated model instance.

## Type Parameters

### T

`T` *extends* [`Document`](../type-aliases/Document.md)

The type of the document in the model.

## Parameters

### param

[`GetTanantModelParams`](../type-aliases/GetTanantModelParams.md)\<`T`\>

The parameters required to resolve the model.

## Returns

`Promise`\<`any`\>

A promise that resolves to the tenant-specific model instance.

## Throws

If no tenant context is found or the tenant is not registered.

## Examples

```ts
const userModel = await getTenantModel({
 modelName: 'User',
 schema: UserSchema,
 tenantId: 'tenant123'
});
// userModel is now a tenant-specific model for the 'User' collection in 'tenant123'
```

```ts
const productModel = await getTenantModel({
 modelName: 'Product',
 schema: ProductSchema,
 tenantId: 'tenant456'
});
```
