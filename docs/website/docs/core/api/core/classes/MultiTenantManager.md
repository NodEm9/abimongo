# Class: MultiTenantManager

Defined in: packages/core/src/tanancy/MultiTenantManager.ts:11

Manages multi-tenancy by handling tenant-specific MongoDB connections.
Provides methods for registering tenants, retrieving clients, and supporting lazy connections.

## Constructors

### Constructor

> **new MultiTenantManager**(): `MultiTenantManager`

Defined in: packages/core/src/tanancy/MultiTenantManager.ts:15

#### Returns

`MultiTenantManager`

## Methods

### getAllConnectedTenants()

> `static` **getAllConnectedTenants**(): `string`[]

Defined in: packages/core/src/tanancy/MultiTenantManager.ts:86

#### Returns

`string`[]

***

### getClient()

> `static` **getClient**(`tenantId`): `Promise`\<`MongoClient` \| `null`\>

Defined in: packages/core/src/tanancy/MultiTenantManager.ts:67

Retrieves the MongoClient instance for a specific tenant.
If the tenant is registered for lazy connection, it establishes the connection before returning the client.

#### Parameters

##### tenantId

`string`

The ID of the tenant to retrieve.

#### Returns

`Promise`\<`MongoClient` \| `null`\>

A promise that resolves to the MongoClient instance or `null` if the tenant is not registered.

***

### getConnectedTenant()

> `static` **getConnectedTenant**(): `string`

Defined in: packages/core/src/tanancy/MultiTenantManager.ts:82

#### Returns

`string`

***

### hasTenant()

> `static` **hasTenant**(`tenantId`): `boolean`

Defined in: packages/core/src/tanancy/MultiTenantManager.ts:22

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

Defined in: packages/core/src/tanancy/MultiTenantManager.ts:34

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

Optional logger for logging messages.

[`NoOpLogger`](../interfaces/NoOpLogger.md) | [`ILogger`](../interfaces/ILogger.md)

#### Returns

`void`

***

### registerTenant()

> `static` **registerTenant**(`tenantId`, `uri`): `Promise`\<`MongoClient`\>

Defined in: packages/core/src/tanancy/MultiTenantManager.ts:51

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
