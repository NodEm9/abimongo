# Read Operations

## Overview

Read operations retrieve data from MongoDB.

Abimongo provides:

- `find`
- `findOne`
- normalized results
- middleware support
- context-aware queries

---

## Find Multiple Documents

```ts
const users = await UserModel.find({});
```

## Find One Document

```ts
const user = await UserModel.findOne({
  email: 'alice@example.com'
});
```

## Behavior

- `beforeFind` / `beforeFindOne` middleware runs
- query is executed
- `afterFind` / `afterFindOne` middleware runs
- results are normalized

## Normalized Results

All _id fields are converted to strings:

```json
{
  _id: "64f...",
  name: "Alice"
}
```

## With Context

```ts
await UserModel.find(
  { active: true },
  { tenantId: 'tenantA' }
);
```

## Middleware Example

```ts
UserModel.beforeFind((ctx) => {
  ctx.filter = {
    ...ctx.filter,
    active: true
  };
});
```

## Soft Delete Integration

By default, soft-deleted documents are excluded:

```ts
await UserModel.find({});
```

Include deleted:

```ts
await UserModel.find({}, { withDeleted: true });
```

Only deleted:

```ts
await UserModel.find({}, { onlyDeleted: true });
```

## Performance Tips

- always use filters where possible
- index frequently queried fields
- avoid large unfiltered queries
