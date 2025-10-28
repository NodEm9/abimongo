[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / AbimongoClientType

# Interface: AbimongoClientType\<T\>

Defined in: [packages/core/src/types/abimongo.client.type.ts:61](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/types/abimongo.client.type.ts#L61)

Represents the AbimongoClient interface for interacting with MongoDB.

## Type Parameters

### T

`T` *extends* [`Document`](../type-aliases/Document.md)

The type of the document in the collection.

## Properties

### uri

> **uri**: `string`

Defined in: [packages/core/src/types/abimongo.client.type.ts:65](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/types/abimongo.client.type.ts#L65)

The MongoDB connection URI.

## Methods

### collection()

> **collection**(`collectionName`): `Promise`\<`Collection`\<`T`\>\>

Defined in: [packages/core/src/types/abimongo.client.type.ts:90](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/types/abimongo.client.type.ts#L90)

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

Defined in: [packages/core/src/types/abimongo.client.type.ts:71](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/types/abimongo.client.type.ts#L71)

Connects to the MongoDB database.

#### Returns

`Promise`\<`Db`\>

A promise that resolves to the connected database instance.

***

### dropDatabase()

> **dropDatabase**(): `Promise`\<`boolean`\>

Defined in: [packages/core/src/types/abimongo.client.type.ts:77](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/types/abimongo.client.type.ts#L77)

Drops the entire database.

#### Returns

`Promise`\<`boolean`\>

A promise that resolves to `true` if the database is dropped successfully.

***

### getClient()

> **getClient**(): `MongoClient`

Defined in: [packages/core/src/types/abimongo.client.type.ts:145](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/types/abimongo.client.type.ts#L145)

Retrieves the MongoClient instance.

#### Returns

`MongoClient`

The MongoClient instance.

***

### getCollection()

> **getCollection**(`name`): `Promise`\<`Collection`\<`T`\>\>

Defined in: [packages/core/src/types/abimongo.client.type.ts:97](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/types/abimongo.client.type.ts#L97)

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

> **getDatabase**(`tenantId`, `uri`): `Promise`\<\{ `client`: `MongoClient`; `db`: `Db`; \}\>

Defined in: [packages/core/src/types/abimongo.client.type.ts:126](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/types/abimongo.client.type.ts#L126)

Retrieves the database instance for a specific tenant and URI.

#### Parameters

##### tenantId

`string`

The ID of the tenant.

##### uri

`string`

The MongoDB connection URI.

#### Returns

`Promise`\<\{ `client`: `MongoClient`; `db`: `Db`; \}\>

A promise that resolves to the database instance and its MongoClient.

***

### getDb()

> **getDb**(): `Db`

Defined in: [packages/core/src/types/abimongo.client.type.ts:83](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/types/abimongo.client.type.ts#L83)

Retrieves the current database instance.

#### Returns

`Db`

The connected database instance.

***

### getTenantCollection()

> **getTenantCollection**(`tenantId`, `collectionName`): `Promise`\<`Collection`\<`T`\>\>

Defined in: [packages/core/src/types/abimongo.client.type.ts:118](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/types/abimongo.client.type.ts#L118)

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

Defined in: [packages/core/src/types/abimongo.client.type.ts:104](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/types/abimongo.client.type.ts#L104)

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

Defined in: [packages/core/src/types/abimongo.client.type.ts:110](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/types/abimongo.client.type.ts#L110)

Sets the MongoDB driver.

#### Parameters

##### mongodbDriver

`any`

The MongoDB driver to set.

#### Returns

`void`

***

### useDatabase()

> **useDatabase**(`dbName`): `Promise`\<\{ `client`: `MongoClient`; `db`: `Db`; \}\>

Defined in: [packages/core/src/types/abimongo.client.type.ts:133](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/types/abimongo.client.type.ts#L133)

Switches to a different database by name.

#### Parameters

##### dbName

`string`

The name of the database to switch to.

#### Returns

`Promise`\<\{ `client`: `MongoClient`; `db`: `Db`; \}\>

A promise that resolves to the new database instance and its MongoClient.

***

### validateUri()

> **validateUri**(`uri`): `void`

Defined in: [packages/core/src/types/abimongo.client.type.ts:139](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/types/abimongo.client.type.ts#L139)

Validates the MongoDB connection URI.

#### Parameters

##### uri

`string`

The MongoDB connection URI.

#### Returns

`void`
