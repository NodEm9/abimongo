# Frequently Asked Questions (FAQ)

This FAQ addresses common questions and concerns developers may have when using **Abimongo_Core**. If your question is not answered here, feel free to open an issue on the [GitHub repository](https://github.com/NodEm9/abimongo_core/issues).

## Frequently Asked Questions (FAQ)

This page answers common questions about the core Abimongo package. It focuses on installation, multi-tenancy, caching, GraphQL integration, transactions, and troubleshooting. If your question is not covered here, open an issue on the project's GitHub.

### General

Q: What is the core Abimongo package?

A: The core package provides the runtime and utilities for working with MongoDB in Abimongo: schema definitions, model helpers, multi-tenancy support, caching helpers, RBAC middleware, and GraphQL helpers.

Q: Is this library TypeScript-first?

A: Yes. The codebase is authored in TypeScript and ships type definitions for public APIs.

### Installation and Requirements

Q: How do I add the core package to my project?

A: Using npm or yarn in a workspace-enabled project:

```bash
npm install @abimongo/core
# or
yarn add @abimongo/core
```

Q: What runtime prerequisites are recommended?

A: Node.js 14+ (LTS recommended), a MongoDB server (local or Atlas), and Redis when you plan to use caching or pub/sub features.

Links: See the Getting Started and Installation guides for examples and Docker snippets: ./getting-started/installation.md

### Multi-tenancy

Q: How does multi-tenancy work?

A: Abimongo isolates tenant data at the database level. The library provides a TenantContext (AsyncLocalStorage-backed) and a MultiTenantManager to register and resolve tenant-specific database connections and models. Use getTenantModel to obtain a tenant-scoped model instance at runtime.

Q: Can connections be lazy-created per tenant?

A: Yes. The MultiTenantManager supports lazy loading so tenant connections and models are created on first use to reduce startup overhead.

### Caching (Redis)

Q: Does the core package include caching helpers?

A: Yes. It includes helpers to store and retrieve cached query results (cache-aside patterns), as well as utilities to invalidate cache entries. The Redis client and lifecycle helpers are implemented in packages/core/src/redis-manager.

Q: How do I clear a cache entry?

A: Use the model's cache helpers or the RedisService to remove keys. Example:

```ts
await AbimongoModel.clearCache('some:key');
// or
await RedisService.getInstance().getClient().del('some:key');
```

### GraphQL

Q: What GraphQL helpers are provided?

A: The AbimongoGraphQL helper can generate GraphQL type definitions and resolvers from models, wire up subscriptions for change-stream events, and accept custom resolvers and type overrides.

Q: Can I customize generated resolvers and types?

A: Yes. The generation APIs accept options for custom resolvers and type mappings. See the GraphQL feature docs for examples.

### Transactions

Q: Are MongoDB transactions supported?

A: Yes. The core helpers and Model APIs support using transactions. When using multi-tenancy, ensure you resolve the tenant's connection and use that connection to start a session/transaction.

### Troubleshooting

Q: The core package build fails with "Missing external configuration for type: commonjs" — what should I check?

A: That error typically comes from the bundler configuration (webpack/tsconfig). Verify library and externals settings in the package's webpack config and ensure TypeScript module/target settings match the bundling strategy. If you want, I can inspect the package webpack configs and propose a fix.

Q: My Redis connection fails or times out — how do I debug?

A: Check the Redis connection URL and that Redis is reachable from your environment. Enable debug logging in the Redis client (see redis-manager) and ensure any network/firewall rules allow the connection. If using Docker, confirm the service names and networks in Docker Compose.

### Support and Contribution

If you need help, open an issue on the project's GitHub and include:

- A short description of the problem
- Version of Node, MongoDB, and Redis (if relevant)
- Minimal code sample to reproduce the issue