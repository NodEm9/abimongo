## Abimongo Core — Tutorials & What's Changed
This page highlights the main developer-facing features of `@abimongo/core`, and summarizes recent improvements you should know about. It also includes short, copyable examples for common tasks: bootstrapping, models, multi-tenancy, caching, GraphQL generation and garbage collection.

### Key improvements (summary)

- Stronger GraphQL integration: helpers to generate type defs and resolvers from models via `AbimongoGraphQL`.
- Multi-tenant improvements: lazy tenant connection management and tenant-aware model resolver utilities.
- Redis-backed caching utilities for frequently-run aggregations and query results.
- Transaction helpers and convenience wrappers around MongoDB sessions.
- Garbage collection / cron templates to remove old documents (configurable TTL patterns).
- Bootstrapping and scaffolding helpers in the core library used by the CLI (now packaged as `@abimongo/create`).

These improvements are surfaced by the following public APIs: `AbimongoClient`, `AbimongoModel`, `AbimongoSchema`, `AbimongoGraphQL`, `AbimongoBootstrap` / `AbimongoBootstrapFactory`, `MultiTenantManager` and `TenantContext`.

### Quick start — connect and use a model

```ts
import { AbimongoClient, AbimongoSchema, AbimongoModel } from '@abimongo/core';

async function main() {
	const client = new AbimongoClient('mongodb://localhost:27017');
	await client.connnect();

	const userSchema = new AbimongoSchema({
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
	});

	const UserModel = new AbimongoModel({ collectionName: 'users', schema: userSchema });

	const created = await UserModel.create({ name: 'Jane', email: 'jane@example.com' });
	const users = await UserModel.find({});
	console.log(users.length, 'users');
}

main().catch(console.error);
```

### Multi-tenancy (tenant-aware models)

Use the built-in multi-tenancy helpers to register tenant URIs and resolve tenant-scoped models. The core library supports lazy tenant connection initialization so adding tenants at runtime is straightforward.

```ts
import { applyMultiTenancy, getTenantModel } from '@abimongo/core';
import express from 'express';

const app = express();
const tenants = { tenant1: 'mongodb://localhost:27017/tenant1' };

applyMultiTenancy(app, tenants, { headerKey: 'x-tenant-id', initOptions: { lazy: true } });

app.get('/users', async (req, res) => {
	const tenantId = req.headers['x-tenant-id'] as string;
	const UserModel = await getTenantModel({ modelName: 'User', tenantId });
	const users = await UserModel.find();
	res.json(users);
});
```

### GraphQL generation

`AbimongoGraphQL` can generate GraphQL type definitions and resolvers from your models. This is useful to bootstrap an API quickly and to keep resolvers consistent with your schema definitions.

```ts
import { AbimongoGraphQL } from '@abimongo/core';

const schema = AbimongoGraphQL.generateSchema({ model: [/* your model */], options: { enableSubscriptions: true } });
// Use the generated schema with Apollo Server, Apollo Federation, or any GraphQL server.
```

Notes:
- You can extend generated types with `customTypeDefs` and `customResolvers` provided by the GraphQL helper.
- RBAC hooks are available to protect resolvers at generation time.

### Caching and Garbage Collection

Use the caching helpers for expensive aggregation queries. The library includes templates and utilities to wire Redis caching into model queries.

Example: aggregate with cache

```ts 
const cached = await UserModel.aggregateWithCache([
	{ $match: { active: true } },
], 'active_users_cache', 300 /* ttl seconds */);
```

For cleanup of old documents, the project provides GC templates and a cron runner. See the `gc` utilities in the core package for ready-to-use runners.

### Bootstrapping & CLI

The core package exposes bootstrapping helpers used by the CLI scaffolder (the CLI package has been renamed to `@abimongo/create`). Use `AbimongoBootstrapFactory` or the `AbimongoBootstrap` utilities to scaffold a new project programmatically.

Note: `AbimongoBootstrapFavotry` is exported as `initAbimongo`.

```ts
import { initAbimongo } from '@abimongo/core';

async function scaffold() {
	await initAbimongo.create('my-new-app');
}

scaffold();
```

Migration note: the interactive CLI package was renamed to `@abimongo/create`. If you previously ran `npx abimongo-cli` or consumed the old `@abimongo/cli` package, switch to the new package when scaffolding new projects.

### Where to look in the codebase

- Core entry & examples: `packages/core/README.md` and `packages/core/src/lib-core`
- Bootstrap + scaffolding templates: `packages/core/src/templates` and `packages/core/src/lib-core/bootstrap`
- GraphQL generation: `packages/core/src/graphql`
- Multi-tenancy: `packages/core/src/tanancy`
- Caching & GC: `packages/core/src/gc` and `packages/core/src/redis-manager`.
