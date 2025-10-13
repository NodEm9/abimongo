[**@abimongo/core v1.4.14**](../README.md)

***

[@abimongo/core](../README.md) / AbimongoClientType

# Interface: AbimongoClientType\<T\>

Defined in: [src/types/abimongo.client.type.ts:62](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/abimongo.client.type.ts#L62)

Represents the AbimongoClient interface for interacting with MongoDB.

## Type Parameters

### T

`T` *extends* [`Document`](../type-aliases/Document.md)

The type of the document in the collection.

## Properties

### uri

> **uri**: `string`

Defined in: [src/types/abimongo.client.type.ts:66](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/abimongo.client.type.ts#L66)

The MongoDB connection URI.

## Methods

### collection()

> **collection**(`collectionName`): `Promise`\<`Collection`\<`T`\>\>

Defined in: [src/types/abimongo.client.type.ts:91](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/abimongo.client.type.ts#L91)

Retrieves a collection by name.

#### Parameters

##### collectionName

`string`

The name of the collection.

#### Returns

`Promise`\<`Collection`\<`T`\>\>

A promise that resolves to the collection instance.

***

### connect()

> **connect**(): `Promise`\<`Db`\>

Defined in: [src/types/abimongo.client.type.ts:72](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/abimongo.client.type.ts#L72)

Connects to the MongoDB database.

#### Returns

`Promise`\<`Db`\>

A promise that resolves to the connected database instance.

***

### dropDatabase()

> **dropDatabase**(): `Promise`\<`boolean`\>

Defined in: [src/types/abimongo.client.type.ts:78](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/abimongo.client.type.ts#L78)

Drops the entire database.

#### Returns

`Promise`\<`boolean`\>

A promise that resolves to `true` if the database is dropped successfully.

***

### getClient()

> **getClient**(): `MongoClient`

Defined in: [src/types/abimongo.client.type.ts:139](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/abimongo.client.type.ts#L139)

Retrieves the MongoClient instance.

#### Returns

`MongoClient`

The MongoClient instance.

***

### getCollection()

> **getCollection**(`name`): `Promise`\<`Collection`\<`T`\>\>

Defined in: [src/types/abimongo.client.type.ts:98](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/abimongo.client.type.ts#L98)

Retrieves a collection by name.

#### Parameters

##### name

`string`

The name of the collection.

#### Returns

`Promise`\<`Collection`\<`T`\>\>

A promise that resolves to the collection instance.

***

### getDatabase()

> **getDatabase**(`tenantId`, `uri`): `Promise`\<`Db`\>

Defined in: [src/types/abimongo.client.type.ts:127](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/abimongo.client.type.ts#L127)

Retrieves the database instance for a specific tenant and URI.

#### Parameters

##### tenantId

`string`

The ID of the tenant.

##### uri

`string`

The MongoDB connection URI.

#### Returns

`Promise`\<`Db`\>

A promise that resolves to the database instance.

***

### getDb()

> **getDb**(): `Db`

Defined in: [src/types/abimongo.client.type.ts:84](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/abimongo.client.type.ts#L84)

Retrieves the current database instance.

#### Returns

`Db`

The connected database instance.

***

### getTenantCollection()

> **getTenantCollection**(`tenantId`, `collectionName`): `Promise`\<`Collection`\<`T`\>\>

Defined in: [src/types/abimongo.client.type.ts:119](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/abimongo.client.type.ts#L119)

Retrieves a collection for a specific tenant.

#### Parameters

##### tenantId

`string`

The ID of the tenant.

##### collectionName

`string`

The name of the collection.

#### Returns

`Promise`\<`Collection`\<`T`\>\>

A promise that resolves to the collection instance.

***

### getTenantDB()

> **getTenantDB**(`tenantId`): `Db`

Defined in: [src/types/abimongo.client.type.ts:105](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/abimongo.client.type.ts#L105)

Retrieves the database instance for a specific tenant.

#### Parameters

##### tenantId

`string`

The ID of the tenant.

#### Returns

`Db`

The database instance for the tenant.

***

### setDriver()

> **setDriver**(`mongodbDriver`): `void`

Defined in: [src/types/abimongo.client.type.ts:111](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/abimongo.client.type.ts#L111)

Sets the MongoDB driver.

#### Parameters

##### mongodbDriver

`any`

The MongoDB driver to set.

#### Returns

`void`

***

### validateUri()

> **validateUri**(`uri`): `void`

Defined in: [src/types/abimongo.client.type.ts:133](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/types/abimongo.client.type.ts#L133)

Validates the MongoDB connection URI.

#### Parameters

##### uri

`string`

The MongoDB connection URI.

#### Returns

`void`
