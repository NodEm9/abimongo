# Class: TenantContext

Defined in: packages/core/src/tanancy/TenantContext.ts:9

Provides a thread-safe context for managing tenant-specific data using `AsyncLocalStorage`.
This is useful for multi-tenant applications where the current tenant needs to be tracked across asynchronous operations.

## Constructors

### Constructor

> **new TenantContext**(): `TenantContext`

#### Returns

`TenantContext`

## Methods

### clear()

> `static` **clear**(): `void`

Defined in: packages/core/src/tanancy/TenantContext.ts:39

Clears the tenant ID from the current context.

#### Returns

`void`

***

### getTenantId()

> `static` **getTenantId**(): `string` \| `undefined`

Defined in: packages/core/src/tanancy/TenantContext.ts:32

Retrieves the tenant ID from the current context.

#### Returns

`string` \| `undefined`

The tenant ID, or `undefined` if no tenant ID is set.

***

### run()

> `static` **run**(`tenantId`, `callback`): `void`

Defined in: packages/core/src/tanancy/TenantContext.ts:15

Runs a callback function within a specific tenant context.

#### Parameters

##### tenantId

`string`

The ID of the tenant to set in the context.

##### callback

() => `void`

The callback function to execute within the tenant context.

#### Returns

`void`

***

### setTenantId()

> `static` **setTenantId**(`tenantId`): `void`

Defined in: packages/core/src/tanancy/TenantContext.ts:23

Sets the tenant ID in the current context.

#### Parameters

##### tenantId

`string`

The ID of the tenant to set.

#### Returns

`void`
