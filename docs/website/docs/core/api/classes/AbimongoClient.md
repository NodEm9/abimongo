[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / AbimongoClient

# Class: AbimongoClient

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:40](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoClient.ts#L40)

AbimongoClient is a MongoDB client wrapper that provides a simplified interface for connecting to and interacting with MongoDB databases.
It supports multi-tenancy, connection pooling, and error handling.
It also provides methods for connecting to a database, getting collections name and dropping databases.

## Param

The MongoDB connection URI.

## Param

Optional configuration options for the client.

## Param

The name of the database to connect to.

## Param

The name of the collection to use.

## Param

An optional MongoDB client instance to use.

## Param

An optional logger instance for logging messages.
 AbimongoClient

## Extended by

- [`Abimongo`](Abimongo.md)

## Implements

- [`AbimongoClientConfig`](../interfaces/AbimongoClientConfig.md)

## Constructors

### Constructor

> **new AbimongoClient**(`uri`, `_options?`): `AbimongoClient`

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:52](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoClient.ts#L52)

#### Parameters

##### uri

`string` = `AbimongoClient.defaultUri`

##### \_options?

[`AbimongoClientOptions`](../interfaces/AbimongoClientOptions.md)

#### Returns

`AbimongoClient`

## Properties

### \_options?

> `optional` **\_options**: [`AbimongoClientOptions`](../interfaces/AbimongoClientOptions.md)

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:54](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoClient.ts#L54)

***

### uri

> **uri**: `string` = `AbimongoClient.defaultUri`

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:53](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoClient.ts#L53)

The MongoDB connection URI.

#### Implementation of

[`AbimongoClientConfig`](../interfaces/AbimongoClientConfig.md).[`uri`](../interfaces/AbimongoClientConfig.md#uri)

## Accessors

### client

#### Get Signature

> **get** **client**(): `MongoClient`

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:266](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoClient.ts#L266)

Gets the current MongoClient instance.

##### Returns

`MongoClient`

The connected MongoClient instance.

An optional MongoClient instance.

#### Implementation of

[`AbimongoClientConfig`](../interfaces/AbimongoClientConfig.md).[`client`](../interfaces/AbimongoClientConfig.md#client)

***

### db

#### Get Signature

> **get** **db**(): `Db`

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:247](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoClient.ts#L247)

Gets the current database instance.

##### Throws

If the database connection is not established.

##### Returns

`Db`

The connected database instance.

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:448](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoClient.ts#L448)

Closes the MongoDB client connection.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the client is closed.

***

### collection()

> **collection**\<`T`\>(`name`): `Collection`\<`T`\>

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:309](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoClient.ts#L309)

Retrieves a MongoDB collection by name.

#### Type Parameters

##### T

`T` *extends* `Document`

#### Parameters

##### name

`string`

The name of the collection to retrieve.

#### Returns

`Collection`\<`T`\>

The MongoDB collection instance.

#### Throws

If the database connection is not established.

***

### connect()

> **connect**(): `Promise`\<`Db`\>

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:293](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoClient.ts#L293)

Establishes a connection to the MongoDB database.

#### Returns

`Promise`\<`Db`\>

A promise that resolves to the connected database instance.

***

### connectDb()

> **connectDb**(`uri`, `options?`): `Promise`\<`AbimongoClient`\>

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:108](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoClient.ts#L108)

Connects to the MongoDB database using the provided URI and options.

#### Parameters

##### uri

The MongoDB connection URI.

`string` | `undefined`

##### options?

[`AbimongoClientOptions`](../interfaces/AbimongoClientOptions.md)

Optional configuration options for the client.

#### Returns

`Promise`\<`AbimongoClient`\>

A promise that resolves to the connected AbimongoClient instance.

#### Throws

If the URI is not provided.

***

### disconnect()

> **disconnect**(): `Promise`\<`void`\>

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:436](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoClient.ts#L436)

Disconnects from the MongoDB database.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the client is disconnected.

***

### dropCollection()

> **dropCollection**(): `Promise`\<`void`\>

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:401](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoClient.ts#L401)

Drops the specified collection from the database.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the collection is dropped.

***

### dropDatabase()

> **dropDatabase**(): `Promise`\<`boolean`\>

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:411](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoClient.ts#L411)

Drops the entire database.

#### Returns

`Promise`\<`boolean`\>

A promise that resolves to `true` if the database is dropped successfully, `false` otherwise.

***

### getClusterInfo()

> **getClusterInfo**(): `Promise`\<\{ `setName?`: `string`; `type`: `string`; \}\>

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:342](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoClient.ts#L342)

Retrieves information about the MongoDB cluster type (e.g., standalone, replica set, sharded).

#### Returns

`Promise`\<\{ `setName?`: `string`; `type`: `string`; \}\>

A promise that resolves to an object containing the cluster type and set name (if applicable).

***

### getCollection()

> **getCollection**\<`T`\>(`name`): `Collection`\<`T`\>

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:327](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoClient.ts#L327)

Retrieves a MongoDB collection by name, defaulting to the collection specified in the options if not provided.

#### Type Parameters

##### T

`T` *extends* `Document`

#### Parameters

##### name

`string`

The name of the collection to retrieve.

#### Returns

`Collection`\<`T`\>

The MongoDB collection instance.

#### Throws

If the database connection is not established.

***

### isConnected()

> **isConnected**(): `boolean`

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:456](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoClient.ts#L456)

Checks if the MongoDB client is connected.

#### Returns

`boolean`

`true` if the client is connected, `false` otherwise.

***

### useCollection()

> **useCollection**(`collectionName`): `Promise`\<`Collection`\<`any`\>\>

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:384](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoClient.ts#L384)

Switches to a different collection at runtime.

#### Parameters

##### collectionName

`string`

The name of the collection to switch to.

#### Returns

`Promise`\<`Collection`\<`any`\>\>

A promise that resolves to the new collection instance.

#### Throws

If the client is not initialized or the collection name is not provided.

***

### useDatabase()

> **useDatabase**(`dbName`): `Promise`\<\{ `client`: `MongoClient`; `db`: `Db`; \}\>

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:364](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoClient.ts#L364)

Switches to a different database at runtime (e.g., for multi-tenancy).

#### Parameters

##### dbName

`string`

The name of the database to switch to.

#### Returns

`Promise`\<\{ `client`: `MongoClient`; `db`: `Db`; \}\>

A promise that resolves to the new database instance.

#### Throws

If the client is not initialized or the database name is not provided.

***

### validateUri()

> **validateUri**(`uri`): `void`

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:275](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoClient.ts#L275)

Validates the MongoDB URI to ensure it starts with "mongodb://" or "mongodb+srv://".

#### Parameters

##### uri

`string`

The MongoDB connection URI.

#### Returns

`void`

#### Throws

If the URI is invalid.

***

### getAllTenantDBs()

> `static` **getAllTenantDBs**(): `Promise`\<`Db`[]\>

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:209](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoClient.ts#L209)

#### Returns

`Promise`\<`Db`[]\>

***

### getDatabase()

> `static` **getDatabase**(`tenantId`, `uri`): `Promise`\<\{ `client`: `MongoClient`; `db`: `Db`; \}\>

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:134](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoClient.ts#L134)

Retrieves the database connection for a specific tenant.

#### Parameters

##### tenantId

`string`

The ID of the tenant.

##### uri

`string`

The MongoDB connection URI.

#### Returns

`Promise`\<\{ `client`: `MongoClient`; `db`: `Db`; \}\>

A promise that resolves to the connected database instance.

#### Throws

If the MongoClient instance is undefined.

***

### getRegisteredModel()

> `static` **getRegisteredModel**(`modelName`, `tenantId`, `schema?`): [`GetTanantModelParams`](../type-aliases/GetTanantModelParams.md)\<`Db`\> & `object`

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:220](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoClient.ts#L220)

#### Parameters

##### modelName

`string`

##### tenantId

`string`

##### schema?

[`AbimongoSchema`](AbimongoSchema.md)\<`any`\>

#### Returns

[`GetTanantModelParams`](../type-aliases/GetTanantModelParams.md)\<`Db`\> & `object`

***

### getTenantDB()

> `static` **getTenantDB**(`tenantId`): `Db`

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:188](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoClient.ts#L188)

Retrieves the database connection for a specific tenant.

#### Parameters

##### tenantId

`string`

The ID of the tenant.

#### Returns

`Db`

The connected database instance.

#### Throws

If the MongoClient instance is undefined.

***

### handleTopologyEvent()

> `static` **handleTopologyEvent**(`event`): `void`

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:483](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoClient.ts#L483)

Handles MongoDB topology events (e.g., opening, closing).

#### Parameters

##### event

The topology event to handle.

`TopologyOpeningEvent` | `TopologyClosedEvent`

#### Returns

`void`

***

### init()

> `static` **init**(): `string` \| `Db`

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:78](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoClient.ts#L78)

#### Returns

`string` \| `Db`

***

### runGlobalGC()

> `static` **runGlobalGC**(): `Promise`\<`void`\>

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:236](https://github.com/NodEm9/abimongo/blob/5a2358b707b76da64f21a9d76ac4c65fbd8a1024/packages/core/src/lib-core/AbimongoClient.ts#L236)

#### Returns

`Promise`\<`void`\>
