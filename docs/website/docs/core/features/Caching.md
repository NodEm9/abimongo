# Caching

## Overview

Abimongo provides built-in Redis-based caching for improving performance and reducing database load.

It supports:

- query caching
- cache invalidation
- tenant-aware keys
- cache statistics

---

### Basic Usage

```ts
await UserModel.aggregateWithCache(
  pipeline,
  'users:active',
  300
);
```

### Cache Key Structure

Abimongo supports tenant-aware caching:

```ts
tenant:tenantA:users:active
tenant:tenantB:users:active
```

This prevents cross-tenant data leakage.

### Manual Cache

```ts
await AbimongoModel.cacheResult(
  'user:123',
  data,
  3600
);
```

### Retrieve Cached Data

```ts
const cached = await UserModel.findCached('user:123');
```

### Cache Invalidation

#### Single Key

```ts
await AbimongoModel.clearCache('user:123');
```

### Pattern-Based Invalidation

```ts
await AbimongoModel.invalidatePattern('tenant:tenantA:*');
```

### Model-Level Invalidation

```ts
await UserModel.invalidateModelPattern('users:*', {
  tenantId: 'tenantA'
});
```

### Cache Warmup

```ts
await UserModel.warmCache([
  {
    filter: { active: true },
    cacheKey: 'users:active'
  }
]);
```

### Cache Statistics

```ts
const stats = await AbimongoModel.getCacheStats();
```

Returns:

- total keys
- memory usage
- hit rate
- miss rate

### Best Practices

- use caching for read-heavy operations
- use short TTL for dynamic data
- always include tenant context in keys
- invalidate cache after updates

### When to Use Caching

- dashboards
- analytics queries
- frequently accessed data
