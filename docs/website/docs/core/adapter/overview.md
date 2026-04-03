# Adapters

## Overview

Abimongo is designed to be **framework-agnostic**.

Instead of coupling your data layer to a specific runtime, Abimongo provides a flexible adapter system that integrates seamlessly with different environments.

Adapters bridge the gap between:

- your application framework (Express, Fastify, NestJS, etc.)
- Abimongo’s context, transactions, and middleware system

---

## Why Adapters Exist

In most applications, you need to:

- extract request metadata (tenantId, requestId)
- initialize request-scoped context
- propagate transactions automatically
- enforce consistent behavior across routes/services

Without adapters, this logic must be repeated in every handler.

Adapters solve this by:

- standardizing context initialization
- automatically wiring request lifecycle → data layer
- reducing boilerplate across your application

---

## What Adapters Do

An adapter typically:

1. extracts data from the incoming request
2. initializes `AbimongoContext`
3. injects metadata (tenantId, requestId, etc.)
4. optionally enables transaction wrapping
5. ensures all downstream operations share the same context

---

## Conceptual Flow

```ts
Incoming Request
   ↓
Adapter extracts metadata
   ↓
AbimongoContext.run(...)
   ↓
Models + Middleware + Transactions
   ↓
Database Operations
```

## Example (Conceptual)

```ts
app.use(async (req, res, next) => {
  await AbimongoContext.run(
    {
      tenantId: req.headers['x-tenant-id'],
      requestId: req.id
    },
    async () => {
      await next();
    }
  );
});
```

This ensures that:

- all model operations
- middleware execution
- transactions

have access to the same request context.

## Supported Runtimes

Adapters are designed to support:

- Express
- Fastify
- NestJS
- GraphQL (Apollo / Yoga)
- Serverless (AWS Lambda, Vercel, etc.)
- Koa / Hapi

## Planned Adapters

The following adapters are part of the Abimongo roadmap:

- Express Adapter
- Fastify Adapter
- NestJS Integration (Interceptor / Provider)
- GraphQL Adapter
- Serverless Adapter

Each adapter will provide:

- request context initialization
- optional transaction wrapping
- middleware compatibility
- minimal configuration setup

## Adapter Responsibilities

Adapters should remain lightweight and focused.

They are responsible for:

context setup
request metadata extraction

They are NOT responsible for:

- business logic
- database queries
- application-level validation

## When to Use an Adapter

Use an adapter when:

- your application handles HTTP requests
- you need request-scoped context
- you want automatic transaction propagation

## When You Don’t Need an Adapter

You may not need an adapter if:

- you are running scripts or background jobs
- you manually control execution flow
- context is not required

## Manual Context Setup (No Adapter)

```ts
await AbimongoContext.run(
  { tenantId: 'tenantA' },
  async () => {
    await UserModel.find({});
  }
);
```

## Design Philosophy

Abimongo adapters follow these principles:

- minimal abstraction
- zero lock-in
- composability
- framework independence

You can always drop down to manual control if needed.

## Future Direction

Adapters will evolve to include:

- automatic transaction boundaries
- request-level instrumentation
- integration with logging systems
- developer-friendly setup utilities

## Summary

Adapters enable:

- clean integration with any framework
- consistent request-scoped behavior
- reduced boilerplate

They are a key part of making Abimongo a framework-level data layer.
