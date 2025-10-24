# Abimongo Core — Overview

Abimongo Core provides the runtime primitives and helpers for building data-driven applications on MongoDB. It focuses on model/schema management, multi-tenancy, caching, RBAC enforcement, and GraphQL helpers so you can ship production-ready services faster.

This page is a compact orientation for new users. It explains what the core package provides, when to use it, and where to go next in the docs.

## Who is this for

- Backend engineers building Node.js/TypeScript services that use MongoDB.
- Teams that need tenant isolation at the database level (multi-tenant SaaS).
- Projects that require integrated caching (Redis), GraphQL scaffolding, or RBAC-ready middleware.

## Key features

- Type-safe model and schema helpers built with TypeScript.
- Multi-tenancy primitives (TenantContext, MultiTenantManager, tenant-scoped models).
- Redis-based caching and pub/sub helpers (redis-manager).
- GraphQL generation helpers (types, resolvers, subscriptions).
- RBAC enforcement helpers and middleware for authorization checks.
- Utilities for transactions, change-stream subscriptions, and lifecycle hooks.

## Quick example (connect + define a simple model)

```ts
import { AbimongoClient, AbimongoSchema, AbimongoModel } from '@abimongo/core';

const client = new AbimongoClient({ uri: process.env.MONGO_URI });

const userSchema = new AbimongoSchema({
 name: { type: String, required: true },
 email: { type: String, required: true, unique: true },
});

const User = AbimongoModel.create('User', userSchema);

await client.connect();
await User.create({ name: 'Alice', email: 'alice@example.com' });
```

Note: see the Getting Started and AbimongoModel pages for more complete examples and API reference.

## Where to go next

- Getting started: [Getting started](./getting-started/gettting-started.md) (installation and quickstart)
- Core concepts: [AbimongoClient](./core-concepts/AbimongoClient.md), [AbimongoModel](./core-concepts/AbimongoModel.md), [MultiTenancy](./core-concepts/MultiTenancy.md)
- Features & patterns: ./features/Caching.md, ./features/AbimongoGraphQL.md, ./features/rbac.md
- FAQ and troubleshooting: ./faq.md

If you'd like a guided walkthrough (example app, Docker Compose, or GraphQL wiring), tell me which one and I will add a quickstart tutorial page.
