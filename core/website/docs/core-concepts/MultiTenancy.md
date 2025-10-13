# Multi-Tenancy in Abimongo_Core

**Abimongo_Core** provides advanced multi-tenancy support, enabling you to isolate data per tenant at the database level. This feature is essential for applications serving multiple clients (tenants) while maintaining data separation and security.

---

## Key Features

- **Automatic Database Switching**: Automatically switches the database based on the tenant ID in the request.
- **Connection Pooling**: Maintains efficient MongoDB connection pooling for each tenant.
- **Tenant Context Propagation**: Propagates tenant-specific context across asynchronous operations using `AsyncLocalStorage`.
- **Lazy Loading**: Optionally defers tenant database connections until they are needed.
- **Model Resolution**: Dynamic tenant-specific model resolution with caching.
- **Thread-Safe Context**: Uses Node.js AsyncLocalStorage for safe multi-tenant operations.

---

## Core Components

### 1. MultiTenantManager

The `MultiTenantManager` class handles tenant registration and client management.

#### Key Methods

```typescript
// Check if tenant exists
MultiTenantManager.hasTenant(tenantId: string): boolean

// Register tenant for lazy connection
MultiTenantManager.registerLazyTenant(tenantId: string, uri: string, logger?: ILogger): void

// Register tenant with immediate connection
MultiTenantManager.registerTenant(tenantId: string, uri: string): Promise<MongoClient>

// Get client for tenant (with lazy loading support)
MultiTenantManager.getClient(tenantId: string): Promise<MongoClient | null>
```

#### Example Usage

```typescript
import { MultiTenantManager } from 'abimongo_core';

// Register tenants
await MultiTenantManager.registerTenant('tenant-a', 'mongodb://localhost:27017/tenant_a');
MultiTenantManager.registerLazyTenant('tenant-b', 'mongodb://localhost:27017/tenant_b');

// Check if tenant exists
if (MultiTenantManager.hasTenant('tenant-a')) {
  const client = await MultiTenantManager.getClient('tenant-a');
  // Use client for operations
}
```

---

### 2. TenantContext

The `TenantContext` class provides thread-safe context management using `AsyncLocalStorage`.

#### Key Methods

```typescript
// Run function within tenant context
TenantContext.run(tenantId: string, callback: () => void): void

// Set tenant ID in current context
TenantContext.setTenantId(tenantId: string): void

// Get current tenant ID
TenantContext.getTenantId(): string | undefined

// Clear tenant context
TenantContext.clear(): void
```

#### Example Usage

```typescript
import { TenantContext } from 'abimongo_core';

// Set tenant context for async operations
TenantContext.run('tenant-a', async () => {
  const currentTenant = TenantContext.getTenantId(); // 'tenant-a'
  
  // All operations within this context will use tenant-a
  await performDatabaseOperations();
});

// Manual context management
TenantContext.setTenantId('tenant-b');
const tenantId = TenantContext.getTenantId(); // 'tenant-b'
TenantContext.clear(); // Remove tenant context
```

---

### 3. TenantModelResolver

The `getTenantModel` function provides dynamic model resolution with caching.

#### Signature

```typescript
getTenantModel<T extends Document>(param: GetTanantModelParams<T>): Promise<any>
```

#### Parameters

```typescript
type GetTanantModelParams<T extends Document> = {
  modelName: string;        // Name of the model
  schema?: AbimongoSchema<T>; // Optional schema
  tenantId: string;         // Tenant identifier
}
```

#### Example Usage

```typescript
import { getTenantModel } from 'abimongo_core';

// Resolve tenant-specific model
const UserModel = await getTenantModel({
  modelName: 'User',
  tenantId: 'tenant-a',
  schema: userSchema // optional
});

// Use the model for tenant-specific operations
const users = await UserModel.find({ status: 'active' });
```

---

## Setting Up Multi-Tenancy

### Step 1: Define Tenants

Create a mapping of tenant IDs to their respective MongoDB URIs.

```typescript
const tenants = {
  tenantA: 'mongodb://localhost:27017/tenantA',
  tenantB: 'mongodb://localhost:27017/tenantB',
  tenantC: 'mongodb://cluster.mongodb.net/tenantC'
};
```

---

### Step 2: Apply Multi-Tenancy Middleware

Use the `applyMultiTenancy` function to enable multi-tenancy in your Express application.

```typescript
import { applyMultiTenancy } from 'abimongo_core';
import express from 'express';

const app = express();

applyMultiTenancy(app, tenants, {
  headerKey: 'x-tenant-id', // Header to identify the tenant
  initOptions: {
    lazy: true, // Enable lazy loading of tenant connections
    config: {
      logger: {
        info: (msg) => console.log(msg),
        warn: (msg) => console.warn(msg),
        error: (msg) => console.error(msg),
      },
    },
  },
});
```

---

### Step 3: Resolve Tenant Models

Use the `getTenantModel` function to resolve tenant-specific models dynamically.

```typescript
app.get('/users', async (req, res) => {
  const tenantId = req.headers['x-tenant-id'] as string;

  const UserModel = await getTenantModel({
    modelName: 'User',
    tenantId,
    schema: userSchema
  });

  const users = await UserModel.find();
  res.json(users);
});
```

---

## Advanced Features

### Lazy Loading

Lazy loading defers the creation of tenant database connections until they are accessed for the first time.

```typescript
// Enable lazy loading during initialization
await applyMultiTenancy(app, tenants, {
  initOptions: {
    lazy: true, // Connections created on-demand
    config: {
      // Optional configuration
    }
  }
});

// Register lazy tenant manually
MultiTenantManager.registerLazyTenant(
  'new-tenant', 
  'mongodb://localhost:27017/new_tenant',
  logger
);
```

### Model Caching

The `getTenantModel` function implements intelligent caching to avoid recreating models:

```typescript
// First call - creates and caches the model
const UserModel1 = await getTenantModel({
  modelName: 'User',
  tenantId: 'tenant-a'
});

// Second call - returns cached model
const UserModel2 = await getTenantModel({
  modelName: 'User', 
  tenantId: 'tenant-a'
});

// UserModel1 === UserModel2 (same cached instance)
```

---

## Context Management Examples

### Express Middleware Integration

```typescript
import { TenantContext } from 'abimongo_core';

app.use((req, res, next) => {
  const tenantId = req.headers['x-tenant-id'] as string;
  
  if (!tenantId) {
    return res.status(400).json({ error: 'Tenant ID required' });
  }
  
  // Set context for the entire request lifecycle
  TenantContext.run(tenantId, () => {
    next();
  });
});

// In route handlers, context is automatically available
app.get('/data', async (req, res) => {
  const currentTenant = TenantContext.getTenantId(); // From context
  const Model = await getTenantModel({
    modelName: 'Data',
    tenantId: currentTenant
  });
  
  const data = await Model.find();
  res.json(data);
});
```

### Service Layer Integration

```typescript
class UserService {
  async createUser(userData: any) {
    const tenantId = TenantContext.getTenantId();
    
    if (!tenantId) {
      throw new Error('No tenant context available');
    }
    
    const UserModel = await getTenantModel({
      modelName: 'User',
      tenantId,
      schema: userSchema
    });
    
    return await UserModel.create(userData);
  }
  
  async getUsersByTenant(tenantId: string) {
    return TenantContext.run(tenantId, async () => {
      const UserModel = await getTenantModel({
        modelName: 'User',
        tenantId
      });
      
      return await UserModel.find();
    });
  }
}
```

---

## Best Practices

1. **Use Meaningful Tenant IDs**:
   - Use descriptive tenant IDs that are easy to map to their respective databases.

2. **Enable Lazy Loading for Scale**:
   - For applications with many tenants, enable lazy loading to optimize resource usage.

3. **Secure Tenant Identification**:
   - Validate the tenant ID from the request header to prevent unauthorized access.
   - Implement proper authentication and authorization.

4. **Monitor Connections**:
   - Use monitoring tools to track MongoDB connections and ensure efficient resource usage.

5. **Context Management**:
   - Always use `TenantContext.run()` for operations that span multiple async calls.
   - Avoid manual context management unless necessary.

6. **Model Caching**:
   - Leverage the built-in model caching in `getTenantModel` for better performance.

---

## Error Handling

```typescript
// Handle tenant resolution errors
try {
  const Model = await getTenantModel({
    modelName: 'User',
    tenantId: 'invalid-tenant'
  });
} catch (error) {
  if (error.message.includes('not registered')) {
    // Handle unregistered tenant
    console.error('Tenant not found:', error.message);
  }
}

// Handle context errors
const tenantId = TenantContext.getTenantId();
if (!tenantId) {
  throw new Error('No tenant context found');
}

// Check tenant availability
if (!MultiTenantManager.hasTenant(tenantId)) {
  throw new Error(`Tenant "${tenantId}" is not registered`);
}
```

---

## Example: Full Multi-Tenancy Workflow

```typescript
import express from 'express';
import { 
  applyMultiTenancy, 
  getTenantModel, 
  TenantContext,
  MultiTenantManager 
} from 'abimongo_core';

const app = express();

const tenants = {
  acme: 'mongodb://localhost:27017/acme_corp',
  techstart: 'mongodb://localhost:27017/techstart_inc',
};

// Apply multi-tenancy
await applyMultiTenancy(app, tenants, {
  headerKey: 'x-tenant-id',
  initOptions: {
    lazy: true,
    config: {
      logger: console
    }
  }
});

// API Routes
app.get('/api/users', async (req, res) => {
  try {
    const tenantId = TenantContext.getTenantId();
    
    const UserModel = await getTenantModel({
      modelName: 'User',
      tenantId,
      schema: userSchema
    });
    
    const users = await UserModel.find();
    res.json({ tenantId, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const tenantId = TenantContext.getTenantId();
    
    const UserModel = await getTenantModel({
      modelName: 'User',
      tenantId
    });
    
    const user = await UserModel.create(req.body);
    res.status(201).json({ tenantId, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health/tenants', async (req, res) => {
  const registeredTenants = Object.keys(tenants).map(tenantId => ({
    tenantId,
    registered: MultiTenantManager.hasTenant(tenantId)
  }));
  
  res.json({ tenants: registeredTenants });
});

app.listen(3000, () => {
  console.log('Multi-tenant server running on port 3000');
});
```

---

## Troubleshooting

### Common Issues

1. **Tenant Not Found**:
   - Ensure the tenant ID is included in the request header.
   - Verify that the tenant is registered in the `tenants` mapping.

2. **Connection Errors**:
   - Ensure MongoDB is running and accessible.
   - Verify the MongoDB URI for each tenant.

3. **Context Lost**:
   - Always use `TenantContext.run()` for async operations.
   - Ensure middleware is properly applied before route handlers.

4. **Performance Issues**:
   - Enable lazy loading to reduce the number of active connections.
   - Use connection pooling to optimize performance.
   - Monitor connection usage and adjust pool sizes accordingly.

---
