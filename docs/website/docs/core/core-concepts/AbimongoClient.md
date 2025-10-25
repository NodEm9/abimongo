# AbimongoClient

This document describes the `AbimongoClient` class and the `Abimongo` convenience subclass. The content below is aligned to the implementation in `packages/core/src/lib-core/AbimongoClient.ts` and focuses on practical usage, method signatures, and recommended practices.

## Overview

`AbimongoClient` is a lightweight wrapper over the official MongoDB Node.js driver. It centralizes connection management, provides helpers for multi-tenant scenarios, and exposes convenience methods for common operations (collections, database switching, cluster info, etc.). `Abimongo` extends `AbimongoClient` and exposes a simplified connect/getInstance surface.

Key features

- Connection and database lifecycle management
- Multi-tenant helper APIs (tenant registration and cached tenant DBs)
- Collection access helpers
- Cluster inspection utilities
- Small set of convenience helpers for dropping databases/collections

---

## Constructor

Signature

```ts
constructor(uri?: string, options?: AbimongoClientOptions)
```

Notes

- `uri` defaults to `mongodb://127.0.0.1:27017` when not provided.
- `options` may contain `dbName`, `collectionName`, a pre-created `MongoClient`, and a logger.

---

## Primary instance API

Below are the main instance methods you will use when working with `AbimongoClient`.

### connect()

Establishes a connection (creates a MongoClient if required) and returns the selected database instance.

Return value:

```ts
Promise<Db>;
```

Example

```ts
const client = new AbimongoClient();
await client.connect();
```

### collection(name: string)

Return a collection from the configured database. If the client or database is not initialized, a helpful message is logged.

Signature:

```ts
collection<T extends Document>(name: string): Collection<T>
```

Example

```ts
const users = client.collection("users");
```

### getCollection(name: string)

Alias for `collection` that follows the same behaviour.

Signature:

```ts
getCollection<T extends Document>(name: string): Collection<T>
```

---

### useDatabase(dbName: string)

Switches the active database for the client instance. Use this in multi-tenant or dynamic database scenarios.

Return value:

```ts
Promise<Db>;
```

Example

```ts
await client.useDatabase("tenant_db_name");
```

### useCollection(collectionName: string)

Change the currently targeted collection for the instance and return it.

Return value:

```ts
Promise<Collection<any>>;
```

Example

```ts
await client.useCollection("profiles");
```

---

### getClusterInfo()

Inspect the MongoDB deployment type (standalone / replica set / sharded). Useful for feature gating or diagnostics.

Signature / return value:

```ts
getClusterInfo(): Promise<{ type: string; setName?: string }>
```

Example

```ts
const info = await client.getClusterInfo();
console.log(info.type);
```

### isConnected(): boolean

Returns whether the client is connected. The implementation makes an async check internally; the method returns a boolean reflecting the last known connection state.

Return value: `boolean`

Example

```ts
if (client.isConnected()) {
  /* ... */
}
```

---

### dropCollection()

Drop the currently selected collection on the configured database. Note: the method attempts to connect before dropping.

Return value:

```ts
Promise<void>;
```

### dropDatabase()

Drop the configured database and close the client. The method removes the database from the internal instances/tenant caches.

Return value:

```ts
Promise<boolean>;
```

### disconnect()

Close the underlying MongoClient and clear internal references.

Return value:

```ts
Promise<void>;
```

### close()

Alias for `disconnect()` that logs an informational message after closing.

Return value:

```ts
Promise<void>;
```

---

## Static / Multi-tenant helpers

These helpers operate at the class level and are intended for multi-tenant usage patterns.

### static getDatabase(tenantId: string, uri: string)

Signature:

```ts
static getDatabase(tenantId: string, uri: string): Promise<{ db: Db; client: MongoClient }>
```

Register (or return) a tenant-scoped database instance. The method now returns an object with both the tenant `Db` and the underlying `MongoClient` so callers can start sessions when they need transactions. If the tenant is not yet registered the method will create a client, connect and cache the DB.

Example

```ts
const { db: tenantDb, client: tenantClient } = await AbimongoClient.getDatabase(
  "tenant-a",
  "mongodb://localhost:27017/tenant-a"
);
// Use tenantClient.startSession() for transactions, or pass both db & client when creating models
```

### static getTenantDB(tenantId: string)

Signature:

```ts
static getTenantDB(tenantId: string): Db
```

Return a cached tenant `database`. Throws a validation error if `tenantId` is not provided or the tenant isn't registered.

Example

```ts
const db = AbimongoClient.getTenantDB("tenant-a");
```

### static getAllTenantDBs()

Signature:

```ts
static getAllTenantDBs(): Promise<Db[]>
```

Return an array of all registered tenant `database` instances. The implementation ensures at least one tenant DB is initialized when available.

Return value:

```ts
Promise<Db[]>;
```

### static getRegisteredModel(modelName: string, tenantId: string, schema?: AbimongoSchema)

Signature:

```ts
static getRegisteredModel(modelName: string, tenantId: string, schema?: AbimongoSchema)
```

Return a small structure containing `modelName`, `tenantId`, optional `schema` and the tenant `Db`. This is used by the internal model registry to resolve tenant-scoped models.

---

## Topology / Events

`AbimongoClient` exposes a small helper for topology events.

### static handleTopologyEvent(event)

Logs topology opening/closing events. The project includes a commented batch handler (`handleLogBatch`) that can be enabled if batching and external transport is required.

---

## Abimongo convenience subclass

`Abimongo` extends `AbimongoClient` and provides the following helpers:

- `static async connect(uri, options)`: a thin wrapper calling the instance connect logic.
- `static getInstance()`: returns the current `Abimongo` instance if available.

Example

```ts
await Abimongo.connect("mongodb://localhost:27017/mydb");
const instance = Abimongo.getInstance();
```

---

## Configuration options (AbimongoClientOptions)

Common properties used by the client:

- `dbName?: string` — default DB name
- `collectionName?: string` — default collection name
- `client?: MongoClient` — pass an existing client instance
- `logger?: ILogger` — optional logger

Default connection options used when the client constructs a MongoClient:

```ts
{
  directConnection: true,
  minPoolSize: 5,
  maxPoolSize: 50,
  serverSelectionTimeoutMS: 5000,
}
```

---

## Examples

Basic usage

```ts
import { Abimongo } from "@abimongo/core";

const client = new AbimongoClient();
await client.connect();
const users = client.collection("users");
await users.insertOne({ name: "Jane" });
await client.close();
```

Multi-tenant example

```ts
const tenantDb = await AbimongoClient.getDatabase(
  "tenant-a",
  "mongodb://localhost:27017/tenant-a"
);
const params = AbimongoClient.getRegisteredModel("User", "tenant-a");
```

---

## Best practices

- Reuse `AbimongoClient` instances where possible.
- Use lazy tenant registration to avoid opening many connections at once.
- Always close clients on shutdown.
- Wrap production operations with proper error handling and timeouts.

---

## Troubleshooting

- If connections fail, verify the URI and network connectivity.
- If a tenant is missing, ensure `getDatabase` was called to register it.
- Use `getClusterInfo()` for deployment diagnostics.

---

## Where to go next

- API reference generated [API docs](../api) for complete option types and model APIs.
- Multi-tenant guide for in-depth tenant patterns.
