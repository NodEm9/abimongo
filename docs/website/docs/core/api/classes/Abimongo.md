[**@abimongo/core v1.0.0**](../README.md)

***

[@abimongo/core](../README.md) / Abimongo

# Class: Abimongo

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:529](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/lib-core/AbimongoClient.ts#L529)

Abimongo inherits from AbimongoClient and provides a simplified interface for connecting to MongoDB databases.
It allows you to create an instance of Abimongo with a MongoDB URI and optional configuration options.

## Extends

- [`AbimongoClient`](AbimongoClient.md)

## Constructors

### Constructor

> **new Abimongo**(`uri?`, `options?`): `Abimongo`

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:536](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/lib-core/AbimongoClient.ts#L536)

Creates an instance of Abimongo.

#### Parameters

##### uri?

`string`

The MongoDB connection URI.

##### options?

[`AbimongoClientOptions`](../interfaces/AbimongoClientOptions.md)

Optional configuration options for the client.

#### Returns

`Abimongo`

#### Throws

If the URI is not provided.

#### Overrides

[`AbimongoClient`](AbimongoClient.md).[`constructor`](AbimongoClient.md#constructor)

## Properties

### \_options?

> `optional` **\_options**: [`AbimongoClientOptions`](../interfaces/AbimongoClientOptions.md)

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:53](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/lib-core/AbimongoClient.ts#L53)

#### Inherited from

[`AbimongoClient`](AbimongoClient.md).[`_options`](AbimongoClient.md#_options)

***

### uri

> **uri**: `string` = `AbimongoClient.defaultUri`

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:52](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/lib-core/AbimongoClient.ts#L52)

The MongoDB connection URI.

#### Inherited from

[`AbimongoClient`](AbimongoClient.md).[`uri`](AbimongoClient.md#uri)

## Accessors

### client

#### Get Signature

> **get** **client**(): `MongoClient`

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:265](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/lib-core/AbimongoClient.ts#L265)

Gets the current MongoClient instance.

##### Returns

`MongoClient`

The connected MongoClient instance.

An optional MongoClient instance.

#### Inherited from

[`AbimongoClient`](AbimongoClient.md).[`client`](AbimongoClient.md#client)

***

### db

#### Get Signature

> **get** **db**(): `Db`

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:246](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/lib-core/AbimongoClient.ts#L246)

Gets the current database instance.

##### Throws

If the database connection is not established.

##### Returns

`Db`

The connected database instance.

#### Inherited from

[`AbimongoClient`](AbimongoClient.md).[`db`](AbimongoClient.md#db)

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:447](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/lib-core/AbimongoClient.ts#L447)

Closes the MongoDB client connection.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the client is closed.

#### Inherited from

[`AbimongoClient`](AbimongoClient.md).[`close`](AbimongoClient.md#close)

***

### collection()

> **collection**\<`T`\>(`name`): `Collection`\<`T`\>

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:308](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/lib-core/AbimongoClient.ts#L308)

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

#### Inherited from

[`AbimongoClient`](AbimongoClient.md).[`collection`](AbimongoClient.md#collection)

***

### connect()

> **connect**(): `Promise`\<`Db`\>

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:292](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/lib-core/AbimongoClient.ts#L292)

Establishes a connection to the MongoDB database.

#### Returns

`Promise`\<`Db`\>

A promise that resolves to the connected database instance.

#### Inherited from

[`AbimongoClient`](AbimongoClient.md).[`connect`](AbimongoClient.md#connect)

***

### connectDb()

> **connectDb**(`uri`, `options?`): `Promise`\<[`AbimongoClient`](AbimongoClient.md)\>

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:107](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/lib-core/AbimongoClient.ts#L107)

Connects to the MongoDB database using the provided URI and options.

#### Parameters

##### uri

The MongoDB connection URI.

`string` | `undefined`

##### options?

[`AbimongoClientOptions`](../interfaces/AbimongoClientOptions.md)

Optional configuration options for the client.

#### Returns

`Promise`\<[`AbimongoClient`](AbimongoClient.md)\>

A promise that resolves to the connected AbimongoClient instance.

#### Throws

If the URI is not provided.

#### Inherited from

[`AbimongoClient`](AbimongoClient.md).[`connectDb`](AbimongoClient.md#connectdb)

***

### disconnect()

> **disconnect**(): `Promise`\<`void`\>

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:435](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/lib-core/AbimongoClient.ts#L435)

Disconnects from the MongoDB database.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the client is disconnected.

#### Inherited from

[`AbimongoClient`](AbimongoClient.md).[`disconnect`](AbimongoClient.md#disconnect)

***

### dropCollection()

> **dropCollection**(): `Promise`\<`void`\>

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:400](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/lib-core/AbimongoClient.ts#L400)

Drops the specified collection from the database.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the collection is dropped.

#### Inherited from

[`AbimongoClient`](AbimongoClient.md).[`dropCollection`](AbimongoClient.md#dropcollection)

***

### dropDatabase()

> **dropDatabase**(): `Promise`\<`boolean`\>

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:410](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/lib-core/AbimongoClient.ts#L410)

Drops the entire database.

#### Returns

`Promise`\<`boolean`\>

A promise that resolves to `true` if the database is dropped successfully, `false` otherwise.

#### Inherited from

[`AbimongoClient`](AbimongoClient.md).[`dropDatabase`](AbimongoClient.md#dropdatabase)

***

### getClusterInfo()

> **getClusterInfo**(): `Promise`\<\{ `setName?`: `string`; `type`: `string`; \}\>

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:341](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/lib-core/AbimongoClient.ts#L341)

Retrieves information about the MongoDB cluster type (e.g., standalone, replica set, sharded).

#### Returns

`Promise`\<\{ `setName?`: `string`; `type`: `string`; \}\>

A promise that resolves to an object containing the cluster type and set name (if applicable).

#### Inherited from

[`AbimongoClient`](AbimongoClient.md).[`getClusterInfo`](AbimongoClient.md#getclusterinfo)

***

### getCollection()

> **getCollection**\<`T`\>(`name`): `Collection`\<`T`\>

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:326](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/lib-core/AbimongoClient.ts#L326)

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

#### Inherited from

[`AbimongoClient`](AbimongoClient.md).[`getCollection`](AbimongoClient.md#getcollection)

***

### isConnected()

> **isConnected**(): `boolean`

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:455](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/lib-core/AbimongoClient.ts#L455)

Checks if the MongoDB client is connected.

#### Returns

`boolean`

`true` if the client is connected, `false` otherwise.

#### Inherited from

[`AbimongoClient`](AbimongoClient.md).[`isConnected`](AbimongoClient.md#isconnected)

***

### useCollection()

> **useCollection**(`collectionName`): `Promise`\<`Collection`\<`any`\>\>

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:383](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/lib-core/AbimongoClient.ts#L383)

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

#### Inherited from

[`AbimongoClient`](AbimongoClient.md).[`useCollection`](AbimongoClient.md#usecollection)

***

### useDatabase()

> **useDatabase**(`dbName`): `Promise`\<\{ `client`: `MongoClient`; `db`: `Db`; \}\>

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:363](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/lib-core/AbimongoClient.ts#L363)

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

#### Inherited from

[`AbimongoClient`](AbimongoClient.md).[`useDatabase`](AbimongoClient.md#usedatabase)

***

### validateUri()

> **validateUri**(`uri`): `void`

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:274](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/lib-core/AbimongoClient.ts#L274)

Validates the MongoDB URI to ensure it starts with "mongodb://" or "mongodb+srv://".

#### Parameters

##### uri

`string`

The MongoDB connection URI.

#### Returns

`void`

#### Throws

If the URI is invalid.

#### Inherited from

[`AbimongoClient`](AbimongoClient.md).[`validateUri`](AbimongoClient.md#validateuri)

***

### connect()

> `static` **connect**(`uri`, `options?`): `Promise`\<[`AbimongoClient`](AbimongoClient.md)\>

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:547](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/lib-core/AbimongoClient.ts#L547)

Connects to the MongoDB database using the provided URI and options.

#### Parameters

##### uri

`string`

The MongoDB connection URI.

##### options?

[`AbimongoClientOptions`](../interfaces/AbimongoClientOptions.md)

Optional configuration options for the client.

#### Returns

`Promise`\<[`AbimongoClient`](AbimongoClient.md)\>

A promise that resolves to the connected AbimongoClient instance.

***

### getAllTenantDBs()

> `static` **getAllTenantDBs**(): `Promise`\<`Db`[]\>

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:208](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/lib-core/AbimongoClient.ts#L208)

#### Returns

`Promise`\<`Db`[]\>

#### Inherited from

[`AbimongoClient`](AbimongoClient.md).[`getAllTenantDBs`](AbimongoClient.md#getalltenantdbs)

***

### getDatabase()

> `static` **getDatabase**(`tenantId`, `uri`): `Promise`\<\{ `client`: `MongoClient`; `db`: `Db`; \}\>

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:133](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/lib-core/AbimongoClient.ts#L133)

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

#### Inherited from

[`AbimongoClient`](AbimongoClient.md).[`getDatabase`](AbimongoClient.md#getdatabase)

***

### getInstance()

> `static` **getInstance**(): `Abimongo`

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:555](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/lib-core/AbimongoClient.ts#L555)

Retrieves the current Abimongo instance.

#### Returns

`Abimongo`

The current Abimongo instance.

***

### getRegisteredModel()

> `static` **getRegisteredModel**(`modelName`, `tenantId`, `schema?`): [`GetTanantModelParams`](../type-aliases/GetTanantModelParams.md)\<`Db`\> & `object`

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:219](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/lib-core/AbimongoClient.ts#L219)

#### Parameters

##### modelName

`string`

##### tenantId

`string`

##### schema?

[`AbimongoSchema`](AbimongoSchema.md)\<`any`\>

#### Returns

[`GetTanantModelParams`](../type-aliases/GetTanantModelParams.md)\<`Db`\> & `object`

#### Inherited from

[`AbimongoClient`](AbimongoClient.md).[`getRegisteredModel`](AbimongoClient.md#getregisteredmodel)

***

### getTenantDB()

> `static` **getTenantDB**(`tenantId`): `Db`

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:187](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/lib-core/AbimongoClient.ts#L187)

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

#### Inherited from

[`AbimongoClient`](AbimongoClient.md).[`getTenantDB`](AbimongoClient.md#gettenantdb)

***

### handleLogBatch()

> `static` **handleLogBatch**(`batch`, `transporter?`): `Promise`\<`void`\>

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:499](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/lib-core/AbimongoClient.ts#L499)

Handles a batch of MongoDB topology events.

#### Parameters

##### batch

(`TopologyOpeningEvent` \| `TopologyClosedEvent`)[]

The batch of topology events to handle.

##### transporter?

`AsyncBatchTransporter`

Optional transporter for logging events asynchronously.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the batch is processed.

#### See

AsyncBatchTransporter for more details on the transporter interface.

#### Inherited from

[`AbimongoClient`](AbimongoClient.md).[`handleLogBatch`](AbimongoClient.md#handlelogbatch)

***

### handleTopologyEvent()

> `static` **handleTopologyEvent**(`event`): `void`

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:482](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/lib-core/AbimongoClient.ts#L482)

Handles MongoDB topology events (e.g., opening, closing).

#### Parameters

##### event

The topology event to handle.

`TopologyOpeningEvent` | `TopologyClosedEvent`

#### Returns

`void`

#### Inherited from

[`AbimongoClient`](AbimongoClient.md).[`handleTopologyEvent`](AbimongoClient.md#handletopologyevent)

***

### init()

> `static` **init**(): `string` \| `Db`

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:77](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/lib-core/AbimongoClient.ts#L77)

#### Returns

`string` \| `Db`

#### Inherited from

[`AbimongoClient`](AbimongoClient.md).[`init`](AbimongoClient.md#init)

***

### runGlobalGC()

> `static` **runGlobalGC**(): `Promise`\<`void`\>

Defined in: [packages/core/src/lib-core/AbimongoClient.ts:235](https://github.com/NodEm9/abimongo/blob/74ddf916fd0dabd5605ec9e93270fa7374534976/packages/core/src/lib-core/AbimongoClient.ts#L235)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`AbimongoClient`](AbimongoClient.md).[`runGlobalGC`](AbimongoClient.md#runglobalgc)
