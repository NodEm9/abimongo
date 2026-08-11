# Context System

---

## Overview

Abimongo provides a request-scoped execution model through `AbimongoContext`. It allows you to attach metadata to a request and access it anywhere in your data layer without manually passing values through every function.

---

Key context fields include:

- `tenantId`
- `requestId`
- `dbName`
- `collectionName`
- `session`
- logging metadata

The context is powered by Node.js `AsyncLocalStorage`, ensuring consistency across async operations.

## Why context matters

In real-world applications you often need to:

- resolve tenant-specific databases
- propagate transactions across services
- attach request-level metadata to queries
- enforce consistent behavior across operations

Without a context system this leads to deeply nested arguments, inconsistent session handling, and duplicated logic. Abimongo centralizes execution state to avoid those problems.

## Basic usage

```ts
import { AbimongoContext } from '@abimongo/core';

await AbimongoContext.run(
  { tenantId: 'tenantA', requestId: 'req-123' },
  async () => {
    await UserModel.find({});
  }
);
```

Inside the execution block, models, middleware, and transactions have access to the same context.

## Accessing context

You can access the current context anywhere:

```ts
const ctx = AbimongoContext.get();
console.log(ctx?.tenantId);
console.log(ctx?.session);
```

## Updating context

You can update context values dynamically:

```ts
AbimongoContext.set({ dbName: 'tenant_db' });
```

## Context fields

| Field | Description |
| --- | --- |
| `tenantId` | Identifies the current tenant |
| `requestId` | Unique request identifier |
| `dbName` | Target database name |
| `collectionName` | Target collection |
| `session` | MongoDB session for transactions |
| `loggerMeta` | Optional metadata for logging |

## Context and models

Models automatically merge context with method-level options. For example:

```ts
await UserModel.find({}, { tenantId: 'overrideTenant' });
```

Priority of values applied to operations:

1. method-level context
2. model default context
3. runtime context (`AbimongoContext`)

## Context in middleware

Middleware receives context automatically:

```ts
UserModel.beforeFind((ctx) => {
  console.log(ctx.tenantId);
});
```

## Best practices

- Always wrap request handlers in `AbimongoContext.run`.
- Avoid manually passing `session` or `tenantId` when possible.
- Use context to enforce consistency across your app.

## Next step - [Transactions]('./transactions.md')
