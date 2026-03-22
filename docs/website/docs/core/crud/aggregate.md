# Aggregation

## Overview

Aggregation allows you to perform advanced data transformations using MongoDB pipelines.

Abimongo supports:

- aggregation pipelines
- middleware injection
- transaction support
- streaming

---

### Basic Aggregation

```ts
const results = await UserModel.aggregate([
  { $match: { active: true } },
  { $group: { _id: '$role', count: { $sum: 1 } } }
]);
```



### Behavior

- `beforeAggregate` middleware runs
- pipeline executes
- `afterAggregate` middleware runs


### Middleware Example

```ts
UserModel.beforeAggregate((ctx) => {
  ctx.pipeline.unshift({
    $match: { isDeleted: false }
  });
});
```

### With Context

```ts
await UserModel.aggregate(
  [{ $match: { active: true } }],
  {},
  undefined,
  { tenantId: 'tenantA' }
);
```

### With Transaction

```ts
await AbimongoContext.withTransaction(async () => {
  await UserModel.aggregate([...]);
});
```

### Streaming Aggregation

```ts
const stream = await UserModel.streamAggregation([
  { $match: { active: true } }
]);

stream.on('data', console.log);
```

### Cached Aggregation

```ts
await UserModel.aggregateWithCache(
  pipeline,
  'cache:key',
  300
);
```

### Best Practices

- keep pipelines efficient
- use indexes for $match
- avoid large $lookup operations where possible