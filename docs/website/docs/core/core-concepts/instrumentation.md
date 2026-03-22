# Instrumentation

---

## Overview

Abimongo provides query instrumentation to observe and debug database operations. Instrumentation measures execution time and emits structured metadata for each query, which helps with performance monitoring and tracing.

---

## Basic example

```text
[Abimongo Query]
collection: users
operation: find
duration: 12ms
tenant: tenantA
```

## How it works

All model operations are wrapped with a measurement layer that:

- captures the start time
- executes the database operation
- logs duration and structured metadata

## Instrumentation metadata

Typical fields included in a measurement:

- `operation` (find, create, update, etc.)
- `collectionName`
- `tenantId`
- `duration`
- optional query data (`filter`, `update`, `pipeline`)

## Using `measureQuery`

```ts
import { measureQuery } from '@abimongo/core';

await measureQuery(
  {
    operation: 'custom',
    collectionName: 'users'
  },
  async () => {
    return await UserModel.find({});
  }
);
```

## Debug mode (optional)

Set the environment variable `ABIMONGO_DEBUG=true` to enable verbose query logs during development.

## Context integration

Instrumentation automatically reads the current `AbimongoContext` (when present), so logs can include tenant information, request identifiers, and session metadata.

```ts
const ctx = AbimongoContext.get();
// ctx.tenantId, ctx.requestId, ctx.session, etc.
```

## Use cases

- Performance monitoring
- Debugging slow queries
- Tracing multi-tenant behavior

## Best practices

- Enable instrumentation in development and selectively in production.
- Use structured logs (JSON) for production monitoring.
- Avoid logging sensitive data (PII, secrets).

## Next steps

- Explore advanced instrumentation features and exporters.
