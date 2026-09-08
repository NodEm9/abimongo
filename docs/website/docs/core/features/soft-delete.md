# Soft Delete

## Overview

Soft delete allows you to mark documents as deleted without permanently removing them from the database.

Instead of deleting records, Abimongo updates internal flags such as:

- `deletedAt`
- `isDeleted`

This enables:

- data recovery
- auditability
- safer deletion workflows

---

## Why Use Soft Delete

Hard deletes permanently remove data:

```ts
await UserModel.deleteOne({ _id });
```

This is irreversible.

Soft delete provides:

- safer operations
- restore capability
- better audit trails

### Default Behavior

When soft delete is enabled:

```ts
await UserModel.deleteOne({ _id });
```

👉 becomes:

```json
{
  isDeleted: true,
  deletedAt: Date
}
```

The document remains in the database.

### Query Behavior

By default, soft-deleted documents are excluded:

```ts
await UserModel.find({});
```

### Include Deleted Documents

```ts
await UserModel.find({}, { withDeleted: true });
```

### Only Deleted Documents

```ts
await UserModel.find({}, { onlyDeleted: true });
```

### Restore Document

```ts
await UserModel.restoreOne({ _id });
```

### Restore Multiple

```ts
await UserModel.restoreMany({ isDeleted: true });
```

### Hard Delete

To permanently delete:

```ts
await UserModel.deleteOne(
  { _id },
  { hardDelete: true }
);
```

### Middleware Integration

Soft delete is implemented using middleware:

```ts
UserModel.beforeFind((ctx) => {
  if (!ctx.meta?.withDeleted) {
    ctx.filter = {
      ...ctx.filter,
      $or: [
        { deletedAt: { $exists: false } },
        { deletedAt: null }
      ]
    };
  }
});
```

### Custom Fields

You can customize behavior by modifying middleware:

```ts
ctx.update.$set = {
  isDeleted: true,
  deletedAt: new Date()
};
```

### Best Practices

- use soft delete by default in production
- reserve hard delete for admin tools
- always index `deletedAt` or `isDeleted`

### When to Use Hard Delete

Use hard delete when:

- data must be permanently removed (compliance)
- storage constraints are critical
- archival is handled separately

### Summary

Soft delete provides:

- safe deletion
- recoverability
- audit-friendly workflows
