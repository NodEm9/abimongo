# Interface: AbimongoClientType\<T\>

Defined in: packages/core/src/types/abimongo.client.type.ts:61

Represents the AbimongoClient interface for interacting with MongoDB.

## Type Parameters

### T

`T` *extends* [`Document`](../type-aliases/Document.md)

The type of the document in the collection.

## Properties

### uri

> **uri**: `string`

Defined in: packages/core/src/types/abimongo.client.type.ts:65

The MongoDB connection URI.

## Methods

### collection()

> **collection**(`collectionName`): `Promise`\<`Collection`\<`T`\>\>

Defined in: packages/core/src/types/abimongo.client.type.ts:90

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

Defined in: packages/core/src/types/abimongo.client.type.ts:71

Connects to the MongoDB database.

#### Returns

`Promise`\<`Db`\>

A promise that resolves to the connected database instance.

***

### dropDatabase()

> **dropDatabase**(): `Promise`\<`boolean`\>

Defined in: packages/core/src/types/abimongo.client.type.ts:77

Drops the entire database.

#### Returns

`Promise`\<`boolean`\>

A promise that resolves to `true` if the database is dropped successfully.

***

### getClient()

> **getClient**(): `MongoClient`

Defined in: packages/core/src/types/abimongo.client.type.ts:138

Retrieves the MongoClient instance.

#### Returns

`MongoClient`

The MongoClient instance.

***

### getCollection()

> **getCollection**(`name`): `Promise`\<`Collection`\<`T`\>\>

Defined in: packages/core/src/types/abimongo.client.type.ts:97

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

Defined in: packages/core/src/types/abimongo.client.type.ts:126

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

Defined in: packages/core/src/types/abimongo.client.type.ts:83

Retrieves the current database instance.

#### Returns

`Db`

The connected database instance.

***

### getTenantCollection()

> **getTenantCollection**(`tenantId`, `collectionName`): `Promise`\<`Collection`\<`T`\>\>

Defined in: packages/core/src/types/abimongo.client.type.ts:118

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

Defined in: packages/core/src/types/abimongo.client.type.ts:104

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

Defined in: packages/core/src/types/abimongo.client.type.ts:110

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

Defined in: packages/core/src/types/abimongo.client.type.ts:132

Validates the MongoDB connection URI.

#### Parameters

##### uri

`string`

The MongoDB connection URI.

#### Returns

`void`
