# Middleware

---

## Overview

Abimongo provides a middleware system that lets you intercept and modify model operations. Middleware runs before and after database operations and receives a unified execution context.

---

## Supported operations

Middleware can be attached to the following operations:

- `find`
- `findOne`
- `create`
- `updateOne`
- `deleteOne`
- `deleteMany`
- `aggregate`
- `findOneAndUpdate`
- `findOneAndDelete`
- `findOneAndReplace`
- `findOneAndUpsert`

## Basic usage

```ts
UserModel.beforeFind((ctx) => {
  ctx.filter = { ...ctx.filter, active: true };
});
```

## Middleware context

Each middleware receives a context object with fields relevant to the operation:

```ts
{
  operation,
  filter,
  update,
  doc,
  result,
  pipeline,
  tenantId,
  dbName,
  session,
  meta
}
```

### Before middleware

Runs before the database operation:

```ts
UserModel.beforeCreate((ctx) => {
  ctx.doc.createdAt = new Date();
});
```

### After middleware

Runs after the operation and can modify the `result`:

```ts
UserModel.afterFind((ctx) => {
  ctx.result = ctx.result.map(user => ({
    ...user,
    displayName: user.name.toUpperCase()
  }));
});
```

## Real-world examples

Soft delete (filter out deleted documents):

```ts
UserModel.beforeFind((ctx) => {
  ctx.filter = { ...ctx.filter, isDeleted: false };
});
```

Audit logging:

```ts
UserModel.afterUpdate((ctx) => {
  console.log('Updated:', ctx.result);
});
```

Tenant enforcement (apply tenant filter automatically):

```ts
UserModel.beforeFind((ctx) => {
  ctx.filter = { ...ctx.filter, tenantId: ctx.tenantId };
});
```

## What middleware can modify

- `ctx.filter`
- `ctx.update`
- `ctx.doc`
- `ctx.pipeline`
- `ctx.result`

## Meta flags

Middleware can use `ctx.meta` to pass flags such as:

- `ctx.meta.withDeleted`
- `ctx.meta.onlyDeleted`
- `ctx.meta.hardDelete`

## Execution order

1. before middleware runs
2. database operation executes
3. after middleware runs

## Best practices

- Keep middleware small and focused.
- Avoid heavy synchronous work inside middleware.
- Use middleware for cross-cutting concerns (validation, auditing, multi-tenancy).
