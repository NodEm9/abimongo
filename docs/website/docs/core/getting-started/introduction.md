# Intro to Abimongo

## What is Abimongo

Abimongo is a framework-agnostic data layer for MongoDB in Node.js.

It provides structured model primitives, schema validation, middleware, and request-scoped execution so you can build consistent, scalable data workflows without being tied to a specific backend framework.

Abimongo sits between a traditional ODM and a full data framework — giving you flexibility without sacrificing structure.

### Why it exists

Working with MongoDB in real-world applications often introduces challenges:

- Managing multi-tenant data access cleanly
- Passing sessions across services for transactions
- Enforcing consistent query behavior (filters, auditing, RBAC)

Most solutions either:

- stay too minimal and leave these concerns to the application, or
- become tightly coupled to a specific framework

Abimongo exists to solve this gap.

It provides a structured, composable data layer that:

- keeps your application logic clean
- centralizes cross-cutting concerns
- remains portable across runtimes

### ODM vs Framework-level ODM

Abimongo follows familiar ODM patterns:

- model-based data access
- schema validation
- lifecycle hooks

But it extends beyond a traditional ODM by introducing:

- request-scoped execution via context
- centralized transaction handling
- middleware-driven query shaping
- built-in observability hooks

Unlike framework-bound solutions, Abimongo remains framework-agnostic and integrates through adapters for:

- Express
- Fastify
- NestJS
- GraphQL
- Serverless runtimes

## Key capabilities

### Multi-tenancy

Abimongo supports tenant-aware data access patterns such as:

- tenant-per-database
- tenant-per-client

Models resolve the correct database and client dynamically at runtime.

What to expect:

- tenant registration and lazy initialization
- automatic tenant resolution per request
- context-driven database selection

### Middleware

Abimongo provides a typed middleware system with before and after hooks for operations such as:

- find
- findOne
- create
- updateOne
- deleteOne
- aggregate

Middleware receives a unified execution context and can modify:

- filters
- updates
- documents
- pipelines
- results

Use cases:

- implement soft deletes
- enforce RBAC or tenant scoping
- attach audit metadata
- transform or enrich results

### Transactions

Abimongo simplifies transaction handling by centralizing session management.

```ts
await AbimongoContext.withTransaction(async () => {
  await UserModel.create(...);
  await OrderModel.create(...);
});
```

Behavior highlights:

- automatic session propagation
- reuse of existing sessions for nested flows
- no need to manually pass sessions across layers

### Context system

AbimongoContext is built on `AsyncLocalStorage` and provides request-scoped execution.

It carries metadata such as:

- `tenantId`
- `requestId`
- `dbName`
- `collectionName`
- `session`
- logging metadata

This context is automatically available to:

- models
- middleware
- instrumentation

Capabilities:

- resolve transactions dynamically via context
- enable consistent behavior across async boundaries
- attach structured telemetry to queries

### Query instrumentation

Abimongo includes built-in instrumentation hooks for measuring and observing queries.

```text
[Abimongo Query]
collection: users
operation: find
duration: 12ms
tenant: tenantA
```

This enables:

- performance tracking
- debugging in development
- production observability

## Where to go next

- Core Concepts
- Context system
- Transactions
- Middleware
- Features
- Soft delete
- Multi-tenancy
- Models & CRUD
- Defining models
- Query operations
