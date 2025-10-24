# @abimongo/core

  ![npm version](https://img.shields.io/npm/v/abimongo_core.svg)
  <!-- (https://www.npmjs.com/package/abimongo_core) -->

  A production-ready, TypeScript-first ORM/ODM for MongoDB built on the official MongoDB Node.js driver. @abimongo/core focuses on developer ergonomics, multi-tenant support, caching, and first-class GraphQL integration while keeping the API small and extensible.

## Key capabilities

- Schema validation and type-safe models
- Middleware (pre/post hooks) for lifecycle events
- Multi-tenancy with tenant context and lazy connection management
- Redis-backed caching utilities for query results
- Transaction helpers for multi-step operations
- Aggregation pipeline helpers and convenience utilities
- Change streams / real-time change listeners
- Optional GraphQL schema generation and resolver wiring
- CLI scaffolding and project bootstrap utilities

    ---

    ## Installation

    Install from npm or using yarn:

    ```bash
    npm install @abimongo/core
    # or
    yarn add @abimongo/core
    ```

    If you are using TypeScript, make sure `tsconfig.json` is configured to include node types and target a supported ECMAScript version.

    ---

    ## Quick start

    This example demonstrates model creation and basic CRUD operations using the high-level API.

    ```ts
    import { AbimongoClient } from '@abimongo/core';

    const clientDB = new AbimongoClient('mongodb://localhost:27017');

    await clientDB.connnect();
    console.log('MongoDB connection successful.')
    ```

    ```ts
    import { AbimongoSchema, AbimongoModel } from '@abimongo/core';

    const userSchema = new AbimongoSchema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      age: { type: Number },
    });

    const UserModel = new AbimongoModel({
      collectionName: 'users',
      schema: userSchema,
    });

    async function example() {
      const created = await UserModel.create({ name: 'Jane', email: 'jane@example.com', age: 28 });
      const found = await UserModel.find({ age: { $gte: 18 } });
      await UserModel.updateOne({ email: 'jane@example.com' }, { $set: { age: 29 } });
      await UserModel.deleteOne({ email: 'jane@example.com' });
    }

    example().catch(console.error);
    ```

    ---

    ## Multi-tenancy

    @abimongo/core includes helpers for multi-tenant applications. You can register tenants with connection URIs and use a tenant-aware model resolver.

    Example (Express middleware + lazy tenant connections):

    ```ts
    import express from 'express';
    import { applyMultiTenancy, getTenantModel } from '@abimongo/core';

    const app = express();

    const tenants = {
      tenant1: 'mongodb://localhost:27017/tenant1',
      tenant2: 'mongodb://localhost:27017/tenant2',
    };

    applyMultiTenancy(app, tenants, { headerKey: 'x-tenant-id', initOptions: { lazy: true } });

    app.get('/users', async (req, res) => {
      const tenantId = req.headers['x-tenant-id'] as string;
      const UserModel = await getTenantModel({ modelName: 'User', tenantId });
      const users = await UserModel.find();
      res.json(users);
    });

    app.listen(3000);
    ```

    Notes

  - Tenant connections are managed by `MultiTenantManager`. Use `registerTenant` at runtime to add tenants dynamically.
  - `TenantContext` provides a way to run code bound to a tenant without threading tenant ids through every function call.

    ---

    ## Schema validation & middleware

    Define schemas with validation rules (types, required, min/max, unique) and attach middleware hooks for lifecycle events.

    ```ts
    const productSchema = new AbimongoSchema({
      name: { type: String, required: true },
      price: { type: Number, required: true, min: 0 },
      category: { type: String },
    });

    productSchema.pre('save', async (doc) => { /* ... */ });
    productSchema.post('save', async (doc) => { /* ... */ });
    ```

    ---

    ## Transactions

    Helpers are provided to make transactional updates simpler. These utilities use MongoDB sessions under the hood.

    ```ts
    await UserModel.updateWithTransaction({ email: 'jane@example.com' }, { $set: { age: 30 } });
    ```

    ---

    ## Caching

    Use built-in Redis-backed caching helpers for expensive aggregation queries or frequently requested results.

    ```ts
    const cached = await UserModel.aggregateWithCache([
      { $match: { active: true } },
    ], 'active_users_cache', 300);
    ```

    ---

    ## Change streams

    Listen for real-time changes on collections with a simple watcher API.

    ```ts
    UserModel.watchChanges((change) => {
      console.log('change:', change);
    });
    ```

    ---

    ## GraphQL integration

    Optional GraphQL helpers can generate type definitions and resolvers from your models. The feature supports queries, mutations and subscriptions and includes RBAC hooks.

    API (examples):

  - `AbimongoGraphQL.generateSchema({ models?, options? })` – generate an executable GraphQL schema.
  - `schema.customResolvers(...)` and `schema.customTypeDefs(...)` – extend generated schema with custom definitions.

    Example (Apollo Server):

    ```ts
    import { AbimongoGraphQL } from '@abimongo/core';
    import { ApolloServer } from '@apollo/server';

    const schema = AbimongoGraphQL.generateSchema({ models: [/* models */], options: { enableSubscriptions: true } });
    const server = new ApolloServer({ schema });
    // start the server with your preferred method
    ```

    Note: GraphQL generation is powerful but may be considered experimental for very complex schemas—review generated types before using them in production.

    ---

    ## CLI scaffolding

    The accompanying CLI accelerates project setup and scaffolding of models, schemas and GraphQL components.

    ```bash
    npx abimongo-core my-app-name
    # with flags
    npx abimongo-core my-app-name --graphql --multi-tenant --logger
    ```

    Flags will toggle features in the generated `abimongo.config.json`. If you omit a flag you can still enable features later by editing the config.

    See the docs-site for a full CLI guide: docs-site/docs/guides/CLI-Scaffolding.md

    ---

    ## RBAC

    Built-in role-based access control utilities make it straightforward to protect resolvers or REST handlers.

  - `enforceRBAC(resolver, action)` — wrap resolvers with permission checks
  - `getRBACAction(resolver)` — inspect mapped action

    The RBAC layer integrates with caching for efficient permission evaluation.

    ---

    ## Plugin system

    Extend the platform using plugins that can add behavior at the model, schema or manager layer.

    ---

    ## Bootstrapping

    `AbimongoBootstrap` helps initialize new projects, creating a recommended folder layout and a starter `abimongo.config.json`.

    ---

    ## API reference (short)

    Abbreviated list of commonly used APIs. See the generated docs in the repo for full signatures and options.

  - AbimongoModel
    - `create(doc)`
    - `find(filter)`
    - `updateOne(filter, update)`
    - `deleteOne(filter)`
    - `aggregate(pipeline)`

  - TenantContext
    - `run(tenantId, callback)`
    - `getTenantId()`

  - MultiTenantManager
    - `registerTenant(tenantId, uri)`
    - `getClient(tenantId)`

  - AbimongoGraphQL
    - `generateSchema({ models, options })`

  - RBAC utilities
    - `enforceRBAC(resolver, action)`

    ---

    ## Contributing

    Contributions are welcome. Please check `CONTRIBUTING.md` in the repository root for guidelines on code style, tests and committing.

    ---

    ## License

    This package is published under the MIT license. See the project `LICENSE` for details.

    ---

    ## Support

    If you find a bug or need help, open an issue in the repository.

    ---

    ## Acknowledgements

    Thanks to the MongoDB Node.js Driver team and the community contributors.
