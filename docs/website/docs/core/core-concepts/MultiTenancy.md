# Multi-tenancy (Abimongo Core)

Abimongo Core provides opinionated helpers for tenant-scoped data (database-per-tenant isolation), safe tenant context propagation across async operations, and efficient tenant-scoped model resolution.

---

## Quick features

- Automatic database switching per tenant
- Connection pooling per tenant
- Tenant context propagation via AsyncLocalStorage
- Lazy-loading tenant connections (on-demand)
- Tenant-aware model resolution with caching

---

## Core pieces

This page briefly explains the components that enable multi-tenancy in Abimongo Core and shows recommended usage patterns.

### MultiTenantManager

Manages tenant registration and the underlying MongoDB clients.

Key methods (signatures):

```ts
MultiTenantManager.hasTenant(tenantId: string): boolean
MultiTenantManager.registerLazyTenant(tenantId: string, uri: string, logger?: ILogger): void
MultiTenantManager.registerTenant(tenantId: string, uri: string): Promise<MongoClient>
MultiTenantManager.getClient(tenantId: string): Promise<MongoClient | null>
```

Example:

```ts
import { MultiTenantManager } from "abimongo_core";

// Register tenants (eager)
await MultiTenantManager.registerTenant(
  "tenant-a",
  "mongodb://localhost:27017/tenant_a"
);

// Register tenant lazily (connection created on first use)
MultiTenantManager.registerLazyTenant(
  "tenant-b",
  "mongodb://localhost:27017/tenant_b"
);

// Use a tenant client
if (MultiTenantManager.hasTenant("tenant-a")) {
  const client = await MultiTenantManager.getClient("tenant-a");
  // use client.db('...').collection('...')
}
```

---

### TenantContext

Provides a request-scoped tenant context using Node's `AsyncLocalStorage`. Use this to run logic within a tenant boundary so downstream code and services can call `TenantContext.getTenantId()`.

Key methods:

```ts
TenantContext.run<T>(tenantId: string, callback: () => T): T
TenantContext.setTenantId(tenantId: string): void
TenantContext.getTenantId(): string | undefined
TenantContext.clear(): void
```

Example (Express middleware):

```ts
import { TenantContext } from "abimongo_core";

app.use((req, res, next) => {
  const tenantId = req.headers["x-tenant-id"] as string;
  if (!tenantId) return res.status(400).json({ error: "Tenant ID required" });

  TenantContext.run(tenantId, () => next());
});
```

Notes:

- Prefer `TenantContext.run()` to ensure context propagation across async calls.
- Use `TenantContext.setTenantId()` / `clear()` only for simple scripts or tests.

---

### getTenantModel (TenantModelResolver)

Resolve a tenant-scoped model (optionally with a schema). The resolver caches the result per (tenantId, modelName) so repeated calls are cheap.

Signature example:

```ts
type GetTenantModelParams<T> = {
  modelName: string
  tenantId: string
  schema?: AbimongoSchema<T>
}

getTenantModel<T extends Document>(params: GetTenantModelParams<T>): Promise<any>
```

Example:

```ts
import { getTenantModel } from "abimongo_core";

const UserModel = await getTenantModel({
  modelName: "User",
  tenantId: "tenant-a",
  schema: userSchema,
});
const users = await UserModel.find({ active: true });
```

---

## How to enable multi-tenancy (Express example)

1. Define your tenant mappings (or register them dynamically via `MultiTenantManager`).

```ts
const tenants = {
  acme: "mongodb://localhost:27017/acme_corp",
  techstart: "mongodb://localhost:27017/techstart_inc",
};
```

2. Apply the middleware to propagate tenant context.

```ts
import express from "express";
import { applyMultiTenancy } from "abimongo_core";

const app = express();

applyMultiTenancy(app, tenants, {
  headerKey: "x-tenant-id",
  initOptions: { lazy: true, config: { logger: console } },
});
```

3. Resolve models in handlers (or inside services) using `getTenantModel`.

```ts
app.get("/users", async (req, res) => {
  const tenantId = req.headers["x-tenant-id"] as string;
  const UserModel = await getTenantModel({
    modelName: "User",
    tenantId,
    schema: userSchema,
  });
  const users = await UserModel.find();
  res.json(users);
});
```

---

## Advanced / operational topics

### Lazy loading

Lazy loading delays connection creation until a tenant is first used. This is recommended for apps with many tenants.

```ts
applyMultiTenancy(app, tenants, { initOptions: { lazy: true } });
// or register lazily at runtime
MultiTenantManager.registerLazyTenant(
  "new-tenant",
  "mongodb://localhost:27017/new_tenant",
  logger
);
```

### Model caching

`getTenantModel` caches models by tenant and model name. The cache avoids repeatedly building model wrappers.

```ts
const UserModel1 = await getTenantModel({
  modelName: "User",
  tenantId: "tenant-a",
});
const UserModel2 = await getTenantModel({
  modelName: "User",
  tenantId: "tenant-a",
});
// UserModel1 === UserModel2
```

---

## Integration examples

### Service layer integration

```ts
class UserService {
  async createUser(userData: any) {
    const tenantId = TenantContext.getTenantId();
    if (!tenantId) throw new Error("No tenant context available");

    const UserModel = await getTenantModel({
      modelName: "User",
      tenantId,
      schema: userSchema,
    });
    return UserModel.create(userData);
  }

  async getUsersByTenant(tenantId: string) {
    return TenantContext.run(tenantId, async () => {
      const UserModel = await getTenantModel({ modelName: "User", tenantId });
      return UserModel.find();
    });
  }
}
```

---

## Best practices

1. Use meaningful tenant IDs (human-readable, stable).
2. Enable lazy loading when you have many tenants.
3. Secure tenant identification — validate and authorize the tenant id provided by clients.
4. Monitor MongoDB connections and the per-tenant resource usage.
5. Prefer `TenantContext.run()` for scoped operations; avoid globally setting tenant ids.
6. Use model caching via `getTenantModel` to reduce overhead.

---

## Error handling patterns

```ts
try {
  const Model = await getTenantModel({
    modelName: "User",
    tenantId: "invalid-tenant",
  });
} catch (err) {
  // e.g. tenant not registered
}

const tenantId = TenantContext.getTenantId();
if (!tenantId) throw new Error("No tenant context found");
if (!MultiTenantManager.hasTenant(tenantId))
  throw new Error(`Tenant "${tenantId}" is not registered`);
```

---

## Full multi-tenancy example (compact)

```ts
import express from "express";
import {
  applyMultiTenancy,
  getTenantModel,
  TenantContext,
  MultiTenantManager,
} from "abimongo_core";

const app = express();
const tenants = {
  acme: "mongodb://localhost:27017/acme_corp",
  techstart: "mongodb://localhost:27017/techstart_inc",
};

await applyMultiTenancy(app, tenants, {
  headerKey: "x-tenant-id",
  initOptions: { lazy: true, config: { logger: console } },
});

app.get("/api/users", async (req, res) => {
  const tenantId =
    TenantContext.getTenantId() || (req.headers["x-tenant-id"] as string);
  const UserModel = await getTenantModel({ modelName: "User", tenantId });
  res.json(await UserModel.find());
});
```

---

## Where to go next

- See `AbimongoModel` docs for examples of population, cache hints, and GC integration.
- Read the multi-tenancy implementation at `packages/core/src/lib-core/tanancy` for internals and extension points.

---

## Support

If you need help or find a bug, open an issue on the repository with a reproducible example and the tenant setup you used.
