# Create Operations

---
## Overview

Create operations insert new documents into a collection.

Abimongo supports:

- single document creation
- bulk insertion
- transaction support
- middleware integration

---

## Create a document

```ts
await UserModel.create({
  name: 'Alice',
  email: 'alice@example.com'
});
```

Behavior during create:

- schema validation is applied
- `beforeCreate` middleware runs
- document is inserted
- `afterCreate` middleware runs
- result is normalized (`_id` -> string)

### With context

```ts
await UserModel.create(
  { name: 'Alice' },
  { tenantId: 'tenantA' }
);
```

### Bulk insert

```ts
await UserModel.bulkInsert([
  { name: 'Alice' },
  { name: 'Bob' }
]);
```

### With transaction

```ts
import { AbimongoContext } from '@abimongo/core';

await AbimongoContext.withTransaction(async () => {
  await UserModel.create({ name: 'Alice' });
});
```

### Middleware example

```ts
UserModel.beforeCreate((ctx) => {
  ctx.doc.createdAt = new Date();
});
```

### Returned result example

```json
{
  "_id": "64f...",
  "name": "Alice",
  "email": "alice@example.com"
}
```

## Best practices

- Validate data at the schema level.
- Use middleware for timestamps and auditing.
- Use transactions for multi-step writes.

## Next step

- Read operations
