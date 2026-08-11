# Delete Operations

## Overview

Delete operations remove or mark documents as deleted.

Abimongo supports:

- `deleteOne`
- `deleteMany`
- `findOneAndDelete`
- soft delete (recommended)
- hard delete

---

### Delete One

```ts
await UserModel.deleteOne({
  email: 'alice@example.com'
});
```

### Find and Delete

```ts
const deleted = await UserModel.findOneAndDelete({
  email: 'alice@example.com'
});
```

### Soft Delete Behavior

If soft delete is enabled:

- documents are not removed
- deletedAt / isDeleted fields are set

### Hard Delete

```ts
await UserModel.deleteOne(
  { email: 'alice@example.com' },
  { hardDelete: true }
);
```

### Restore Documents

```ts
await UserModel.restoreOne({ _id: '...' });
```

### Middleware Example

```ts
UserModel.beforeDelete((ctx) => {
  console.log('Deleting:', ctx.filter);
});
```

### With Transaction

```ts
await AbimongoContext.withTransaction(async () => {
  await UserModel.deleteOne(...);
});
```

### Best Practices

- prefer soft delete for recoverability
- use hard delete only when necessary
- audit delete operations with middleware