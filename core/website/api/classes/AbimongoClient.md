[**@abimongo/core v1.4.14**](../README.md)

***

[@abimongo/core](../README.md) / AbimongoClient

# Class: AbimongoClient

Defined in: [src/core/AbimongoClient.ts:38](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoClient.ts#L38)

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

Defined in: [src/core/AbimongoClient.ts:50](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoClient.ts#L50)

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

Defined in: [src/core/AbimongoClient.ts:52](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoClient.ts#L52)

***

### uri

> **uri**: `string` = `AbimongoClient.defaultUri`

Defined in: [src/core/AbimongoClient.ts:51](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoClient.ts#L51)

The MongoDB connection URI.

#### Implementation of

[`AbimongoClientConfig`](../interfaces/AbimongoClientConfig.md).[`uri`](../interfaces/AbimongoClientConfig.md#uri)

## Accessors

### client

#### Get Signature

> **get** **client**(): `MongoClient`

Defined in: [src/core/AbimongoClient.ts:215](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoClient.ts#L215)

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

Defined in: [src/core/AbimongoClient.ts:196](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoClient.ts#L196)

Gets the current database instance.

##### Throws

If the database connection is not established.

##### Returns

`Db`

The connected database instance.

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [src/core/AbimongoClient.ts:398](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoClient.ts#L398)

Closes the MongoDB client connection.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the client is closed.

***

### collection()

> **collection**\<`T`\>(`name`): `Collection`\<`T`\>

Defined in: [src/core/AbimongoClient.ts:258](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoClient.ts#L258)

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

Defined in: [src/core/AbimongoClient.ts:242](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoClient.ts#L242)

Establishes a connection to the MongoDB database.

#### Returns

`Promise`\<`Db`\>

A promise that resolves to the connected database instance.

***

### connectDb()

> **connectDb**(`uri`, `options?`): `Promise`\<`AbimongoClient`\>

Defined in: [src/core/AbimongoClient.ts:86](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoClient.ts#L86)

Connects to the MongoDB database using the provided URI and options.

#### Parameters

##### uri

`string`

The MongoDB connection URI.

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

Defined in: [src/core/AbimongoClient.ts:386](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoClient.ts#L386)

Disconnects from the MongoDB database.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the client is disconnected.

***

### dropCollection()

> **dropCollection**(): `Promise`\<`void`\>

Defined in: [src/core/AbimongoClient.ts:351](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoClient.ts#L351)

Drops the specified collection from the database.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the collection is dropped.

***

### dropDatabase()

> **dropDatabase**(): `Promise`\<`boolean`\>

Defined in: [src/core/AbimongoClient.ts:361](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoClient.ts#L361)

Drops the entire database.

#### Returns

`Promise`\<`boolean`\>

A promise that resolves to `true` if the database is dropped successfully, `false` otherwise.

***

### getClusterInfo()

> **getClusterInfo**(): `Promise`\<\{ `setName?`: `string`; `type`: `string`; \}\>

Defined in: [src/core/AbimongoClient.ts:291](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoClient.ts#L291)

Retrieves information about the MongoDB cluster type (e.g., standalone, replica set, sharded).

#### Returns

`Promise`\<\{ `setName?`: `string`; `type`: `string`; \}\>

A promise that resolves to an object containing the cluster type and set name (if applicable).

***

### getCollection()

> **getCollection**\<`T`\>(`name`): `Collection`\<`T`\>

Defined in: [src/core/AbimongoClient.ts:276](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoClient.ts#L276)

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

Defined in: [src/core/AbimongoClient.ts:406](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoClient.ts#L406)

Checks if the MongoDB client is connected.

#### Returns

`boolean`

`true` if the client is connected, `false` otherwise.

***

### useCollection()

> **useCollection**(`collectionName`): `Promise`\<`Collection`\<`any`\>\>

Defined in: [src/core/AbimongoClient.ts:333](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoClient.ts#L333)

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

> **useDatabase**(`dbName`): `Promise`\<`Db`\>

Defined in: [src/core/AbimongoClient.ts:313](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoClient.ts#L313)

Switches to a different database at runtime (e.g., for multi-tenancy).

#### Parameters

##### dbName

`string`

The name of the database to switch to.

#### Returns

`Promise`\<`Db`\>

A promise that resolves to the new database instance.

#### Throws

If the client is not initialized or the database name is not provided.

***

### validateUri()

> **validateUri**(`uri`): `void`

Defined in: [src/core/AbimongoClient.ts:224](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoClient.ts#L224)

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

Defined in: [src/core/AbimongoClient.ts:158](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoClient.ts#L158)

#### Returns

`Promise`\<`Db`[]\>

***

### getDatabase()

> `static` **getDatabase**(`tenantId`, `uri`): `Promise`\<`Db`\>

Defined in: [src/core/AbimongoClient.ts:110](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoClient.ts#L110)

Retrieves the database connection for a specific tenant.

#### Parameters

##### tenantId

`string`

The ID of the tenant.

##### uri

`string`

The MongoDB connection URI.

#### Returns

`Promise`\<`Db`\>

A promise that resolves to the connected database instance.

#### Throws

If the MongoClient instance is undefined.

***

### getRegisteredModel()

> `static` **getRegisteredModel**(`modelName`, `tenantId`, `schema?`): [`GetTanantModelParams`](../type-aliases/GetTanantModelParams.md)\<`Db`\> & `object`

Defined in: [src/core/AbimongoClient.ts:169](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoClient.ts#L169)

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

Defined in: [src/core/AbimongoClient.ts:137](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoClient.ts#L137)

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

### handleLogBatch()

> `static` **handleLogBatch**(`batch`, `transporter?`): `Promise`\<`void`\>

Defined in: [src/core/AbimongoClient.ts:443](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoClient.ts#L443)

#### Parameters

##### batch

(`TopologyOpeningEvent` \| `TopologyClosedEvent`)[]

##### transporter?

`any`

#### Returns

`Promise`\<`void`\>

***

### handleTopologyEvent()

> `static` **handleTopologyEvent**(`event`): `void`

Defined in: [src/core/AbimongoClient.ts:433](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoClient.ts#L433)

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

Defined in: [src/core/AbimongoClient.ts:70](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoClient.ts#L70)

#### Returns

`string` \| `Db`

***

### runGlobalGC()

> `static` **runGlobalGC**(): `Promise`\<`void`\>

Defined in: [src/core/AbimongoClient.ts:185](https://github.com/NodEm9/abimongo_core/blob/98b677ee8a9ea1c6d597cffd0eb0b14c8bf66ab5/src/core/AbimongoClient.ts#L185)

#### Returns

`Promise`\<`void`\>
