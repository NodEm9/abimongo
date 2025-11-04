# Getting started with @abimongo/core

This quickstart shows the minimal steps to get a working app with @abimongo/core. It focuses on the common happy-path: connect, define a schema, create a model, and perform simple operations. For advanced topics (multi-tenancy, caching, GraphQL integration) there are dedicated docs in the repository.

---

## Prerequisites

- Node.js 14+ (LTS recommended)
- A running MongoDB instance (local or cloud)
- Redis (optional, recommended for caching and subscriptions)
- npm or yarn

---

## Install

Install the package from npm (or use your workspace package name if working in the monorepo):

```bash
npm install @abimongo/core
# or
yarn add @abimongo/core
```

---

## Quick bootstrap

The smallest working example below shows programmatic bootstrap, schema and model creation, and basic CRUD.

```ts
import { AbimongoClient, AbimongoSchema, AbimongoModel } from '@abimongo/core';

async function main() {
  // 1) Connect
  const db = new AbimongoClient('mongodb://localhost:27017/mydb');
  await db.connect();

  // 2) Define schema
  const userSchema = new AbimongoSchema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number }
  });

  // 3) Create model
  const UserModel = new AbimongoModel({ collectionName: 'users', schema: userSchema });

  // 4) Use the model
  const created = await UserModel.create({ name: 'Alice', email: 'alice@example.com', age: 28 });
  const list = await UserModel.find({ age: { $gte: 18 } });
  console.log('Users:', list);

  // Close connection when shutting down
  await db.disconnect();
}

main().catch(console.error);
```

Notes:

- Prefer `AbimongoClient` for lifecycle management (connect/disconnect).
- Model instances are lightweight wrappers around collection operations and include helpful utilities (caching, hooks, validation, etc.).

---

## Multi-tenancy (quick)

Abimongo Core supports tenant-per-database patterns and request-scoped tenant context. Use `applyMultiTenancy` and `TenantContext` in HTTP servers to scope operations by tenant.

High level:

1. Register tenants using `MultiTenantManager.registerTenant` or `registerLazyTenant`.
2. Use `TenantContext.run(tenantId, () => { ... })` or the provided Express middleware to propagate tenant id.
3. Resolve tenant models with `getTenantModel({ modelName, tenantId, schema })`.

See the Multi-Tenancy doc for examples and best practices.

---

## Caching (quick)

If Redis is enabled, model helpers support caching patterns such as `findWithCache`, `findCached`, `cacheResult`, and `invalidatePattern`.

Recommended pattern:

- Use cache-aside for reads: check cache → fetch DB → cache result.
- Prefix keys with tenant id when running multi-tenant apps.
- Use `SCAN` to evict keys by pattern (avoid `KEYS`).

See the caching doc for deeper guidance and examples.

---

## Transactions

Abimongo models include helpers to run updates inside MongoDB transactions when supported by your deployment.

Example pattern:

```ts
await UserModel.runInTransaction(async (session) => {
  await UserModel.updateOne({ _id: id }, { $set: { age: 32 } }, { session });
  // other transactional operations...
});
```

---

## Real-time updates

The library integrates with MongoDB change streams and Redis pub/sub (when enabled) for real-time features and GraphQL subscriptions. Use model-level `watchChanges` or the GraphQL helpers in `AbimongoGraphQL` for subscriptions.

---

## Hooks & validation

Schemas support pre/post hooks and validation rules. Use `schema.pre('save', ...)` and `schema.post('save', ...)` to add lifecycle hooks.

---

## Troubleshooting

- Connection issues: verify MongoDB URI and that the server is reachable.
- Redis issues: check `REDIS_URI` and that Redis is running when you enable caching/subscriptions.
- Tenant context errors: ensure tenant middleware is applied and headers/identifiers are validated.

---

## Where to go next

- [API reference:](../api)
- [Multi-Tenancy: ](../core-concepts/MultiTenancy.md)
- [Caching: ](../features/Caching.md)
- [GraphQL integration:](../features/AbimongoGraphQL.md)