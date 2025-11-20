# Abimongo + Express — Quick tutorial

This short tutorial shows a minimal, practical integration of @abimongo/core with an Express server.

It covers:
- Installing the packages
- Connecting to MongoDB with AbimongoClient
- Defining a schema and a model
- Wiring Abimongo into Express request handlers
- Notes on multi-tenancy, logger behavior, and CLI scaffolding

## Install

From your project root (using pnpm / npm / yarn):

```powershell
# Using pnpm
pnpm add @abimongo/core @abimongo/logger express

# Or npm
npm install @abimongo/core @abimongo/logger express
```

## Minimal server

Create `src/server.ts` and paste the code below. It demonstrates a simple Abimongo startup and a single `GET /users` route.

```ts
import express from 'express';
import { AbimongoClient, AbimongoSchema, AbimongoModel } from '@abimongo/core';
import { initLogger } from '@abimongo/logger';

// configure logger early
initLogger({ level: 'info', console: true });

const app = express();
const port = process.env.PORT || 3000;

// Create an Abimongo client and connect
const client = new AbimongoClient('mongodb://localhost:27017');

async function start() {
  await client.connect();

  // Define a schema + model (in real apps put these in their own modules)
  const userSchema = new AbimongoSchema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
  });

  const UserModel = new AbimongoModel({ collectionName: 'users', schema: userSchema });

  // Simple route using the model
  app.get('/users', async (req, res) => {
    const users = await UserModel.find();
    res.json(users);
  });

  app.listen(port, () => console.log(`Listening on ${port}`));
}

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
```

Tip: In more complex apps prefer `AbimongoBootstrap` to register schemas, configure GraphQL, multi-tenant wiring and GC, rather than instantiating models directly in the server entrypoint.

## Multi-tenancy (brief)

If you need multi-tenant behavior the `MultiTenantManager` and `TenantContext` helpers in `@abimongo/core` let you map tenant IDs to connection URIs and resolve tenant-aware models at request time. A typical pattern is to attach the current tenant id to the request (from a header) and use a helper to get the tenant model inside handlers.

Example middleware sketch:

```ts
app.use((req, res, next) => {
  // assume tenant id is provided in header `x-tenant-id`
  req.tenantId = req.headers['x-tenant-id'] as string || 'default';
  next();
});

// This API can implement a full regitatration of applyMultiTenancy()

app.get('/tenant/users', async (req, res) => {
  const tenantId = req.tenantId;
  const TenantUserModel = await getTenantModel({ modelName: 'User', tenantId });
  const list = await TenantUserModel.find();
  res.json(list);
});
```

See the `tanancy` docs and tests for detailed examples of registration and lazy connections.

## Logger & CLI notes

- The `abimongo` CLI (shipped inside `@abimongo/core`) sets an environment guard `ABIMONGO_DISABLE_SIGNAL_HANDLERS=1` when invoked. This prevents the logger from registering SIGINT/SIGTERM handlers during one-off scaffold runs. When running inside an Express server you DO NOT need to set this — the logger will behave normally and register graceful shutdown handlers.
- If you scaffold a project with the CLI, the default behavior is to skip package installs (safe for CI/offline). Use `--install` to opt into installing dependencies during scaffold.

## Scaffolding with the CLI

To generate a starter Express app using the core CLI:

```bash
npx abimongo init my-express-app --with-graphql --multi-tenant --logger
# To auto-install dependencies during scaffold (optional):
npx abimongo init my-express-app --install
```

The generated project includes a `src/main.ts` and `abimongo.config.json` that you can tweak.

## Testing locally

- Start MongoDB (or use a memory server for tests).
- Run your server with `pnpm dev` (or `node dist/server.js` after building).
- For integration tests use the testing helpers in `@abimongo/core` or `mongodb-memory-server`.

## Next steps

- Move schema and model definitions into separate modules.
- Add request-scoped DI for tenant/model resolution if you need strict isolation.
- Consider using `AbimongoBootstrap` to centralize initialization and GraphQL wiring.
