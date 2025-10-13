# Getting Started with Abimongo_Core

Welcome to the **Abimongo_Core** library! This guide will walk you through the steps to get started with this enterprise-grade ORM/ODM for MongoDB.

---

## Prerequisites

Before using `Abimongo_Core`, ensure you have the following:

1. **Node.js**: Version 14 or higher.
2. **MongoDB**: A running MongoDB instance (local or cloud).
3. **Redis**: For caching (optional but recommended).
4. **Package Manager**: npm or yarn.

---

## Installation

Install the library using npm or yarn:

```bash
npm install abimongo_core
# or
yarn add abimongo_core
```

---

## Basic Setup

### 1. Connect to MongoDB

```typescript
await abimongo.connect('mongodb://localhost:27017/mydb');
```

### 2. Define a Schema

Schemas define the structure and validation rules for your MongoDB collections.

```typescript
import { AbimongoSchema } from 'abimongo_core';

const userSchema = new AbimongoSchema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number },
});
```

### 3. Create a Model

Models are used to interact with MongoDB collections.

```typescript
import { AbimongoModel } from 'abimongo_core';

const UserModel = new AbimongoModel({
  collectionName: 'users',
  schema: userSchema,
});
```

### 4. Perform CRUD Operations

Use the model to perform CRUD operations on your MongoDB collection.

```typescript
(async () => {
  // Create a new user
  const user = await UserModel.create({ name: 'John Doe', email: 'john@example.com', age: 30 });

  // Find users
  const users = await UserModel.find({ age: { $gte: 18 } });

  // Update a user
  await UserModel.updateOne({ email: 'john@example.com' }, { $set: { age: 31 } });

  // Delete a user
  await UserModel.deleteOne({ email: 'john@example.com' });
})();
```

---

## Multi-Tenancy Setup

Abimongo_Core provides built-in support for multi-tenant applications. Follow these steps to enable multi-tenancy:

### 1. Define Tenants

Create a mapping of tenant IDs to their respective MongoDB URIs.

```typescript
const tenants = {
  tenant1: 'mongodb://localhost:27017/tenant1',
  tenant2: 'mongodb://localhost:27017/tenant2',
};
```

### 2. Apply Multi-Tenancy Middleware

Use the `applyMultiTenancy` function to enable multi-tenancy in your Express application.

```typescript
import { applyMultiTenancy } from 'abimongo_core';
import express from 'express';

const app = express();

applyMultiTenancy(app, tenants, {
  headerKey: 'x-tenant-id', // Header to identify the tenant
  initOptions: {}
});
```

### 3. Resolve Tenant Models

Use the `getTenantModel` function to resolve tenant-specific models.

```typescript
import { getTenantModel } from 'abimongo_core';

app.get('/users', async (req, res) => {
  const UserModel = await getTenantModel({
    modelName: 'User',
    tenantId: req.headers['x-tenant-id'] as string,
  });

  const users = await UserModel.find();
  res.json(users);
});
```

---

## Caching

Leverage Redis-based caching to optimize query performance.

### Enable Caching

Use the `aggregateWithCache` method to cache aggregation results.

```typescript
const pipeline = [{ $match: { age: { $gte: 18 } } }];
const cachedUsers = await UserModel.aggregateWithCache(pipeline, 'user_aggregation_cache_key', 600);

console.log('Cached Users:', cachedUsers);
```

### Clear Cache

Use the `clearCache` method to invalidate cached data.

```typescript
await AbimongoModel.clearCache('user_aggregation_cache_key');
console.log('Cache cleared');
```

---

## Transactions

Simplify transaction management with built-in support.

```typescript
await UserModel.updateWithTransaction(
  { email: 'john@example.com' },
  { $set: { age: 32 } }
);
```

---

## Real-Time Change Tracking

Track real-time changes in collections using MongoDB Change Streams.

```typescript
UserModel.watchChanges((change) => {
  console.log('Change detected:', change);
});
```

---

## Advanced Features

### Middleware Hooks

Add pre/post hooks for CRUD operations.

```typescript
userSchema.pre('save', async (doc) => {
  console.log('Before saving:', doc);
});

userSchema.post('save', async (doc) => {
  console.log('After saving:', doc);
});
```

### Schema Validation

Define validation rules for your schemas.

```typescript
const productSchema = new AbimongoSchema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
});
```

---

## Example Application

Here’s a complete example of an Express application using `Abimongo_Core`:

```typescript
import express from 'express';
import { applyMultiTenancy, getTenantModel } from 'abimongo_core';

const app = express();

const tenants = {
  'tenant-a': 'mongodb://localhost:27017/tenant_a_db',
  'tenant-b': 'mongodb://localhost:27017/tenant_b_db',
};

applyMultiTenancy(app, tenants, { headerKey: 'x-tenant-id' });

app.get('/users', async (req, res) => {
  const UserModel = await getTenantModel({
    modelName: 'User',
    tenantId: 'tenant-a',
  });

  const users = await UserModel.find();
  res.json(users);
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

## Troubleshooting

- **MongoDB Connection Issues**:
  - Ensure MongoDB is running and accessible from your application.
  - Verify the MongoDB URI in your configuration.

- **Redis Connection Issues**:
  - Ensure Redis is running and accessible.
  - Verify the Redis connection URI in your configuration.

- **Tenant Context Errors**:
  - Ensure the `TenantContext` middleware is applied correctly.
  - Verify that the tenant ID is included in the request headers.

---

## Next Steps

- Explore the [API Documentation](/api) for detailed information on all available methods and features.
<!-- - Check out the [Examples](../examples) for more use cases. -->

---

## Support

For questions or support, please open an issue on the [GitHub repository](https://github.com/your-repo/abimongo_core_library).
