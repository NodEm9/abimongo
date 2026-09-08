# Update Operations

## Overview

Update operations modify existing documents.

Abimongo supports:

- `updateOne`
- `findOneAndUpdate`
- upsert operations
- middleware integration
- transaction support

---

### Update One

```ts
await UserModel.updateOne(
  { email: 'alice@example.com' },
  { $set: { name: 'Updated' } }
);
```

### Find and Update

```ts
const updated = await UserModel.findOneAndUpdate(
  { email: 'alice@example.com' },
  { $set: { name: 'Updated' } }
);
```

Returns the updated document.

### Upsert (Insert if Not Exists)

```ts
await UserModel.findOneAndUpsert(
  { email: 'alice@example.com' },
  { $set: { name: 'Alice' } }
);
```

### Behavior

- `beforeUpdate` middleware runs
- update is applied
- `afterUpdate` middleware runs

### With Context

```ts
await UserModel.updateOne(
  { email: 'alice@example.com' },
  { $set: { name: 'Updated' } },
  { tenantId: 'tenantA' }
);
```

### Middleware Example

```ts
UserModel.beforeUpdate((ctx) => {
  ctx.update.$set.updatedAt = new Date();
});
```

### With Transaction

```ts
await AbimongoContext.withTransaction(async () => {
  await UserModel.updateOne(...);
});
```

### Best Practices

- always use $set instead of replacing documents
- validate updates when necessary
- use middleware for timestamps
