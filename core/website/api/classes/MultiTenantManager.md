[**@abimongo/core v1.4.14**](../README.md)

***

[@abimongo/core](../README.md) / MultiTenantManager

# Class: MultiTenantManager

Defined in: [src/tanancy/MultiTenantManager.ts:8](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/tanancy/MultiTenantManager.ts#L8)

Manages multi-tenancy by handling tenant-specific MongoDB connections.
Provides methods for registering tenants, retrieving clients, and supporting lazy connections.

## Constructors

### Constructor

> **new MultiTenantManager**(): `MultiTenantManager`

Defined in: [src/tanancy/MultiTenantManager.ts:12](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/tanancy/MultiTenantManager.ts#L12)

#### Returns

`MultiTenantManager`

## Methods

### getAllConnectedTenants()

> `static` **getAllConnectedTenants**(): `string`[]

Defined in: [src/tanancy/MultiTenantManager.ts:83](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/tanancy/MultiTenantManager.ts#L83)

#### Returns

`string`[]

***

### getClient()

> `static` **getClient**(`tenantId`): `Promise`\<`null` \| `MongoClient`\>

Defined in: [src/tanancy/MultiTenantManager.ts:64](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/tanancy/MultiTenantManager.ts#L64)

Retrieves the MongoClient instance for a specific tenant.
If the tenant is registered for lazy connection, it establishes the connection before returning the client.

#### Parameters

##### tenantId

`string`

The ID of the tenant to retrieve.

#### Returns

`Promise`\<`null` \| `MongoClient`\>

A promise that resolves to the MongoClient instance or `null` if the tenant is not registered.

***

### getConnectedTenant()

> `static` **getConnectedTenant**(): `string`

Defined in: [src/tanancy/MultiTenantManager.ts:79](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/tanancy/MultiTenantManager.ts#L79)

#### Returns

`string`

***

### hasTenant()

> `static` **hasTenant**(`tenantId`): `boolean`

Defined in: [src/tanancy/MultiTenantManager.ts:19](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/tanancy/MultiTenantManager.ts#L19)

Checks if a tenant is already registered.

#### Parameters

##### tenantId

`string`

The ID of the tenant to check.

#### Returns

`boolean`

`true` if the tenant is registered, `false` otherwise.

***

### registerLazyTenant()

> `static` **registerLazyTenant**(`tenantId`, `uri`, `logger?`): `void`

Defined in: [src/tanancy/MultiTenantManager.ts:31](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/tanancy/MultiTenantManager.ts#L31)

Registers a tenant with the given ID and MongoDB URI for lazy connection.
Lazy connections are established only when the tenant is accessed for the first time.

#### Parameters

##### tenantId

`string`

The ID of the tenant to register.

##### uri

`string`

The MongoDB URI for the tenant.

##### logger?

`any`

Optional logger for logging messages.

#### Returns

`void`

***

### registerTenant()

> `static` **registerTenant**(`tenantId`, `uri`): `Promise`\<`MongoClient`\>

Defined in: [src/tanancy/MultiTenantManager.ts:48](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/tanancy/MultiTenantManager.ts#L48)

Registers a tenant with the given ID and MongoDB URI.
If the tenant is already registered, it returns the existing client.

#### Parameters

##### tenantId

`string`

The ID of the tenant to register.

##### uri

`string`

The MongoDB URI for the tenant.

#### Returns

`Promise`\<`MongoClient`\>

A promise that resolves to the MongoClient instance for the tenant.
