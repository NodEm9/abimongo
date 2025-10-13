# AbimongoClient

The `AbimongoClient` class is a core component of the **Abimongo_Core** library. It provides a simplified and robust interface for connecting to and interacting with MongoDB databases. It supports multi-tenancy, connection pooling, advanced error handling, and topology event management.

---

## Key Features

- **Connection Management**: Simplifies connecting to MongoDB databases.
- **Multi-Tenancy**: Supports tenant-specific database connections with lazy loading.
- **Connection Pooling**: Optimizes performance with configurable connection pooling.
- **Error Handling**: Provides detailed error messages for connection issues.
- **Dynamic Database Switching**: Allows switching between databases at runtime.
- **Topology Event Handling**: Monitors and logs MongoDB topology changes.
- **Connection Status Monitoring**: Check connection health and status.

---

## Constructor

### Signature

```typescript
constructor(uri: string, options?: AbimongoClientOptions)
```

### Parameters

- `uri` (string): The MongoDB connection URI.
- `options` (AbimongoClientOptions, optional): Configuration options for the client.

---

## Methods

### 1. `connect`

Establishes a connection to the MongoDB database.

#### Signature

```typescript
async connect(): Promise<Db>
```

#### Returns

- `Promise<Db>`: A promise that resolves to the connected database instance.

#### Example

```typescript
const client = new AbimongoClient('mongodb://localhost:27017/my_database');
await client.connect();
```

---

### 2. `collection`

Retrieves a MongoDB collection by name.

#### Signature

```typescript
collection<T extends Document>(name: string): Collection<T>
```

#### Parameters

- `name` (string): The name of the collection.

#### Returns

- `Collection<T>`: The MongoDB collection instance.

#### Example

```typescript
const usersCollection = client.collection('users');
```

---

### 3. `getDatabase`

Retrieves the database instance for a specific tenant.

#### Signature

```typescript
static async getDatabase(tenantId: string, uri: string): Promise<Db>
```

#### Parameters

- `tenantId` (string): The ID of the tenant.
- `uri` (string): The MongoDB connection URI.

#### Returns

- `Promise<Db>`: A promise that resolves to the database instance.

#### Example

```typescript
const tenantDb = await AbimongoClient.getDatabase('tenant-a', 'mongodb://localhost:27017/tenant1');
```

---

### 4. `getTenantDB`

Retrieves the database instance for a specific tenant from cache.

#### Signature

```typescript
static getTenantDB(tenantId: string): Db
```

#### Parameters

- `tenantId` (string): The ID of the tenant.

#### Returns

- `Db`: The cached database instance for the tenant.

#### Throws

- `AbiMongoError`: If the tenant ID is not provided or tenant is not registered.

#### Example

```typescript
const tenantDb = AbimongoClient.getTenantDB('tenant-a');
```

---

### 5. `getAllTenantDBs`

Retrieves all registered tenant database instances.

#### Signature

```typescript
static getAllTenantDBs(): Db[]
```

#### Returns

- `Db[]`: An array of all tenant database instances.

#### Example

```typescript
const allTenantDbs = AbimongoClient.getAllTenantDBs();
console.log(`Total tenants: ${allTenantDbs.length}`);
```

---

### 6. `getRegisteredModel`

Retrieves a registered model for a specific tenant.

#### Signature

```typescript
static getRegisteredModel(modelName: string, tenantId: string, schema?: any): GetTanantModelParams<Db>
```

#### Parameters

- `modelName` (string): The name of the model to retrieve.
- `tenantId` (string): The ID of the tenant.
- `schema` (any, optional): The schema definition.

#### Returns

- `GetTanantModelParams<Db>`: The tenant model parameters.

#### Example

```typescript
const modelParams = AbimongoClient.getRegisteredModel('User', 'tenant-a', userSchema);
```

---

### 7. `useDatabase`

Switches to a different database at runtime.

#### Signature

```typescript
async useDatabase(dbName: string): Promise<Db>
```

#### Parameters

- `dbName` (string): The name of the database to switch to.

#### Returns

- `Promise<Db>`: A promise that resolves to the new database instance.

#### Example

```typescript
await client.useDatabase('new_database');
```

---

### 8. `useCollection`

Switches to a different collection at runtime.

#### Signature

```typescript
async useCollection(collectionName: string): Promise<Collection>
```

#### Parameters

- `collectionName` (string): The name of the collection to switch to.

#### Returns

- `Promise<Collection>`: A promise that resolves to the new collection instance.

#### Example

```typescript
await client.useCollection('new_collection');
```

---

### 9. `getClusterInfo`

Retrieves information about the MongoDB cluster type (e.g., standalone, replica set, sharded).

#### Signature

```typescript
async getClusterInfo(): Promise<{ type: string; setName?: string }>
```

#### Returns

- `Promise<{ type: string; setName?: string }>`: A promise that resolves to an object containing the cluster type and set name (if applicable).

#### Example

```typescript
const clusterInfo = await client.getClusterInfo();
console.log(`Cluster type: ${clusterInfo.type}`);
if (clusterInfo.setName) {
  console.log(`Replica set: ${clusterInfo.setName}`);
}
```

---

### 10. `isConnected`

Checks if the MongoDB client is connected.

#### Signature

```typescript
isConnected(): boolean
```

#### Returns

- `boolean`: `true` if the client is connected, `false` otherwise.

#### Example

```typescript
if (client.isConnected()) {
  console.log('Client is connected');
} else {
  console.log('Client is not connected');
}
```

---

### 11. `dropCollection`

Drops a specific collection.

#### Signature

```typescript
async dropCollection(collectionName: string): Promise<boolean>
```

#### Parameters

- `collectionName` (string): The name of the collection to drop.

#### Returns

- `Promise<boolean>`: A promise that resolves to `true` if the collection is dropped successfully.

#### Example

```typescript
const success = await client.dropCollection('old_collection');
console.log('Collection dropped:', success);
```

---

### 12. `dropDatabase`

Drops the current database.

#### Signature

```typescript
async dropDatabase(): Promise<boolean>
```

#### Returns

- `Promise<boolean>`: A promise that resolves to `true` if the database is dropped successfully.

#### Example

```typescript
const success = await client.dropDatabase();
console.log('Database dropped:', success);
```

---

### 13. `disconnect`

Closes the MongoDB client connection.

#### Signature

```typescript
async disconnect(): Promise<void>
```

#### Returns

- `Promise<void>`: Resolves when the client is disconnected.

#### Example

```typescript
await client.disconnect();
console.log('Disconnected from MongoDB');
```

---

### 14. `close`

Closes the MongoDB client connection with logging.

#### Signature

```typescript
async close(): Promise<void>
```

#### Returns

- `Promise<void>`: Resolves when the client is closed.

#### Example

```typescript
await client.close();
// Logs: "Disconnected from MongoDB"
```

---

## Static Methods for Topology Management

### 15. `handleTopologyEvent`

Handles MongoDB topology events (e.g., opening, closing).

#### Signature

```typescript
static handleTopologyEvent(event: TopologyOpeningEvent | TopologyClosedEvent): void
```

#### Parameters

- `event` (TopologyOpeningEvent | TopologyClosedEvent): The topology event to handle.

#### Example

```typescript
AbimongoClient.handleTopologyEvent(topologyEvent);
```

---

### 16. `handleLogBatch`

Processes batches of topology events with optional transporter.

#### Signature

```typescript
static async handleLogBatch(
  batch: (TopologyOpeningEvent | TopologyClosedEvent)[],
  transporter?: AsyncBatchTransporter
): Promise<void>
```

#### Parameters

- `batch` (Array): Array of topology events to process.
- `transporter` (AsyncBatchTransporter, optional): Optional transporter for batch processing.

#### Example

```typescript
await AbimongoClient.handleLogBatch(eventBatch, customTransporter);
```

---

## Configuration Options

The `AbimongoClientOptions` interface provides additional configuration options for the client.

### Properties

- `dbName` (string, optional): The name of the database to connect to.
- `collectionName` (string, optional): The name of the collection to use.
- `client` (MongoClient, optional): An existing MongoClient instance.
- `logger` (ILogger, optional): A logger instance for logging messages.

### Default Connection Settings

```typescript
{
  directConnection: true,
  minPoolSize: 5,        // Minimum active connections
  maxPoolSize: 50,       // Maximum connections allowed
  serverSelectionTimeoutMS: 5000, // Timeout before retry
}
```

---

## Abimongo Extended Class

The `Abimongo` class extends `AbimongoClient` with additional convenience methods:

### Static Methods

#### `connect`

```typescript
static async connect(uri: string, options?: AbimongoClientOptions): Promise<AbimongoClient>
```

#### `getInstance`

```typescript
static getInstance(): Abimongo
```

Gets the current Abimongo instance.

---

## Example: Full Workflow

Here's a complete example of using `AbimongoClient` with multi-tenancy:

```typescript
import { AbimongoClient } from 'abimongo_core';

(async () => {
  // Initialize the client
  const client = new AbimongoClient('mongodb://localhost:27017/my_database');

  // Connect to the database
  const db = await client.connect();

  // Check connection status
  if (client.isConnected()) {
    console.log('Successfully connected!');
  }

  // Get cluster information
  const clusterInfo = await client.getClusterInfo();
  console.log(`Running on: ${clusterInfo.type}`);

  // Multi-tenant operations
  const tenantDb = await AbimongoClient.getDatabase('tenant-a', 'mongodb://localhost:27017/tenant_a');
  const allTenants = AbimongoClient.getAllTenantDBs();
  
  // Retrieve a collection
  const usersCollection = client.collection('users');

  // Perform operations
  await usersCollection.insertOne({ name: 'John Doe', email: 'john@example.com' });

  // Switch to a different database
  await client.useDatabase('new_database');

  // Clean up
  await client.close();
})();
```

---

## Best Practices

1. **Reuse Connections**:
   - Avoid creating multiple instances of `AbimongoClient` for the same database. Reuse the same instance to optimize performance.

2. **Use Connection Pooling**:
   - Configure connection pooling to handle high-concurrency applications efficiently.

3. **Monitor Connection Health**:
   - Use `isConnected()` to check connection status before performing operations.

4. **Handle Topology Events**:
   - Implement proper topology event handling for production applications.

5. **Multi-Tenant Best Practices**:
   - Use lazy loading for tenants to optimize resource usage.
   - Cache tenant databases appropriately.

6. **Handle Errors Gracefully**:
   - Use try-catch blocks to handle errors during database operations.

7. **Close Connections**:
   - Always close the MongoDB connection when your application shuts down.

---

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running and accessible.
   - Verify the MongoDB URI format.

2. **Tenant Not Found**:
   - Check if the tenant is properly registered using `getAllTenantDBs()`.
   - Verify tenant ID spelling and case sensitivity.

3. **Connection Timeout**:
   - Increase the `serverSelectionTimeoutMS` in the MongoClient options if you experience timeouts.

4. **Topology Events Not Working**:
   - Ensure proper event handlers are set up for production monitoring.

---

## Next Steps

- Explore the [API Documentation](/api) for detailed information on all available methods and features.
- Check out the [Getting Started Guide](../getting-started/installation.md) for installation instructions.
- Learn about [Multi-Tenancy](../core-concepts/MultiTenancy.md) for advanced tenant management.

---

## Support

For questions or support, please open an issue on the [GitHub repository](https://github.com/your-repo/abimongo_core_library).
