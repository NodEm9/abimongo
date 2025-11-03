# AbimongoBootstrap (core)

The core package exposes two cooperating bootstrapper classes located at `packages/core/src/lib-core/bootstrap`:
 
- AbimongoBootstrap — runtime initializer that loads configuration, connects Redis and MongoDB, registers schemas and models, initializes GraphQL, optionally schedules garbage collection, and exposes runtime helpers.
- AbimongoBootstrapFactory — a small factory with a static `create(config?)` method that constructs an `AbimongoBootstrap`, calls `initialize(config?)`, and returns the initialized instance.

This file documents the runtime-oriented bootstrapper (not the separate `cli` package that scaffolds full-stack project templates).

## Responsibilities (short)

- Load configuration (default `abimongo.config.json` or provided path).
- Initialize Redis (when enabled) and expose cache helpers.
- Create and connect an `AbimongoClient` (MongoDB) and register models/schemas.
- Initialize GraphQL when configured.
- Register multi-tenancy middleware via `registerMultiTenancy(application, tenants, options)`.
- Provide lifecycle helpers: `onConnect()`, `shutdown()`, and GC registration when enabled.

## Programmatic example (factory)

```ts
import { initAbimongo } from '@abimongo/core';

// Initialize using the default config file
const abimongo = await initAbimongo.create();

// Access runtime helpers
const mongoClient = abimongo.getMongoClient();
const redisClient = await abimongo.getRedisClient();
const graphql = abimongo.getGraphQL();

// Register an on-connect hook
abimongo.onConnect(async () => {
  console.log('Abimongo connected — running post-connect tasks');
});

// Shutdown when finished
await abimongo.shutdown();
```

## Minimal `abimongo.config.json` example

```json
{
  "projectName": "my-app",
  "mongoUri": "mongodb://localhost:27017/mydb",
  "features": {
    "useRedisCache": true,
    "graphql": { "enabled": true }
  },
  "multiTenant": { "enabled": false }
}
```

## Common public methods (from source)

- `initialize(configFilePath?: string): Promise<void>` — loads config and initializes Redis, MongoDB, GraphQL, GC, models, etc.
- `onConnect(hook: () => Promise<void> | void): void` — register post-connection hooks.
- `registerMultiTenancy(application: Application, tenants: Record<string,string>, options?): Promise<void>` — wire tenant middleware (Express `application` required).
- `cache<T>(key: string, fetcher: () => Promise<T>, options?): Promise<T>` — helper that uses Redis to cache values.
- `invalidateCache(tenantId: string, namespace?: string): Promise<void>` — tenant-scoped cache invalidation.
- `getRedisClient(): Promise<typeof import('../../redis-manager/redisClient').redis>` — returns the redis client.
- `getMongoClient(): import('../AbimongoClient').AbimongoClient | undefined` — returns the AbimongoClient instance.
- `getModel()`, `getSchema()`, `getGraphQL()`, `getGCRunner()` — accessors for runtime components.
- `shutdown(): Promise<void>` — cleanly closes Redis and MongoDB connections and other resources.

## Small Express multi-tenancy example

```ts
import express from 'express';
import { initAbimongo } from '@abimongo/core';

const app = express();
const abimongo = await AbimongoBootstrapFactory.create();

await abimongo.registerMultiTenancy(app, {
  tenant1: 'mongodb://localhost:27017/tenant1db',
  tenant2: 'mongodb://localhost:27017/tenant2db'
}, {
  headerKey: 'x-tenant-id',
  initOptions: {}
});

app.listen(3000);
```

## Notes & gotchas

- The factory's `create(config?)` accepts either a path string or no argument (which falls back to `abimongo.config.json`).
- `registerMultiTenancy` throws if multi-tenancy is not enabled in the loaded configuration — enable it in your config before calling.
- When garbage collection is configured, confirm cron and retention settings to avoid accidental data removal.

## Troubleshooting

- Initialization errors: verify the `mongoUri` and any Redis URIs in `abimongo.config.json` and confirm network access.
- Redis/GraphQL errors: ensure the necessary dependencies are installed and configuration fields (typeDefs/resolvers) are valid.

## Next steps

Would you like me to:

1. Add the exact method signatures and constructor options from `AbimongoBootstrap` as an API reference, or
2. Expand the multi-tenancy example with middleware usage and tenant-aware model resolution, or
3. Do both.

Tell me which you'd prefer and I'll add it.

## Expanded multi-tenancy example

The following example demonstrates a common pattern when using `AbimongoBootstrap` in a multi-tenant Express application:

- Use `registerMultiTenancy(app, tenants, options)` to wire tenant resolution middleware.
- Resolve a tenant-scoped model in request handlers using the tenant id from the request.
- Use the bootstrapper's `cache()` helper to cache tenant-scoped results and `invalidateCache()` to evict tenant keys after writes.

Notes and assumptions:

- This example assumes `initAbimongo.create()` returns an instance with `registerMultiTenancy`, `getModel`, `cache`, and `invalidateCache` methods (these exist in the current core implementation). If your runtime API differs, I can adapt the snippet.

```ts
import express from 'express';
import { initAbimongo } from '@abimongo/core';

const app = express();
const abimongo = await initAbimongo.create();

// Wire tenant mapping and header key
await abimongo.registerMultiTenancy(app, {
  tenantA: 'mongodb://localhost:27017/tenantA',
  tenantB: 'mongodb://localhost:27017/tenantB'
}, { headerKey: 'x-tenant-id', initOptions: {} });

// Middleware: attach tenant id to req (registerMultiTenancy typically does this, but
// show the pattern in case you need custom logic)
app.use((req, res, next) => {
  const tenantId = (req.headers['x-tenant-id'] as string) || 'tenantA';
  (req as any).tenantId = tenantId;
  next();
});

// GET route: read with tenant-aware cache
app.get('/products', async (req, res) => {
  const tenantId = (req as any).tenantId;
  const cacheKey = `products:${tenantId}`;

  const products = await abimongo.cache(cacheKey, async () => {
    // Resolve tenant-scoped model from the bootstrap
    const ProductModel = abimongo.getModel();
    // The model factory returns a model bound to the configured client/tenant
    return await ProductModel.find({}).toArray?.() ?? [];
  }, { ttlSeconds: 60 * 5, tenantId });

  res.json(products);
});

// POST route: create item and invalidate tenant cache
app.post('/products', express.json(), async (req, res) => {
  const tenantId = (req as any).tenantId;
  const ProductModel = abimongo.getModel();
  const doc = await ProductModel.create(req.body);

  // Invalidate cached product list for this tenant
  await abimongo.invalidateCache(tenantId, 'products');

  res.status(201).json(doc);
});

app.listen(3000, () => console.log('listening'));
```

This pattern keeps tenant isolation clear and centralizes cache keys per tenant so invalidation is straightforward after writes.

Once you're happy with this example I can also:

- Add a short test example that demonstrates cache hit/miss behavior for two tenants, or
- Map this pattern to the `getTenantModel` helper if you prefer explicit tenant model resolution over `getModel()`.
