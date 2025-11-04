# Caching in Abimongo Core

Abimongo Core includes a Redis-backed caching layer that reduces database load and speeds up common read patterns. This document explains the concepts, recommended usage patterns, and safe implementation examples using the library's model and Redis helpers.

---

## Goals

- Improve read latency for hot paths
- Reduce repeated work and DB load for expensive queries
- Provide tenant-isolated caches in multi-tenant apps
- Offer safe primitives for cache invalidation and monitoring

---

## Key concepts

- Cache keys should be stable, descriptive, and tenant-prefixed when applicable (e.g. `tenant:<id>:users:active`).
- Prefer short TTLs for highly dynamic data and longer TTLs for stable data.
- Use `SCAN` with batching to delete keys by pattern; avoid `KEYS` in production.
- Keep cache warming focused (specific queries) and avoid bulk caching of very large collections.

---

## Typical primitives (what the library exposes)

Note: the project implements caching helpers on the `AbimongoModel` and reuses the shared Redis client from the redis-manager. Common helpers you will encounter:

- `findWithCache(filter, cacheKey?, ttl?)` — run a query and cache the result (auto-generated key if not provided).
- `findCached(cacheKey)` — return cached value or `null`.
- `cacheResult(cacheKey, data, ttl?)` — write a value to the cache with TTL.
- `invalidatePattern(pattern)` / `invalidateModelPattern(pattern)` — remove keys matching a glob-style pattern (uses incremental SCAN).
- `warmCache(queries[], defaultTtl?)` — pre-populate cache for a list of queries.
- `getCacheStats(tenantId?)` — obtain basic stats (hit rate, total keys, memory estimates).

The exact names or signatures may vary by release; these are the library conventions used across the docs and examples.

---

## Safe usage patterns

### Cache-Aside (recommended)

1. Attempt to read from cache.
2. On miss, fetch from DB, write to cache, then return.

Example:

```ts
// cache-aside example
const cacheKey = `tenant:${tenantId}:user:profile:${userId}`;
let profile = await UserModel.findCached(cacheKey);
if (!profile) {
  profile = await UserModel.findOne({ _id: userId });
  if (profile) await AbimongoModel.cacheResult(cacheKey, profile, 3600);
}
return profile;
```

### Write-Through (when write-latency to cache is acceptable)

Write to DB, then update cache immediately to keep it fresh.

```ts
const updated = await UserModel.findOneAndUpdate({ _id: id }, { $set: updates }, { returnDocument: 'after' });
await AbimongoModel.cacheResult(`tenant:${tenantId}:user:${id}`, updated, 3600);
```

### Ownership / Scoped caching

Always include tenant id and ownership information in keys to prevent data leakage between tenants or users.

---

## Pattern-based invalidation (safe algorithm)

Use incremental SCAN to find and delete keys matching a pattern, batching each deletion to avoid blocking Redis:

```ts
async function deleteByPattern(client, pattern) {
  let cursor = 0;
  do {
    const [next, keys] = await client.scan(cursor, { MATCH: pattern, COUNT: 100 });
    cursor = Number(next);
    if (keys && keys.length) await client.del(...keys);
  } while (cursor !== 0);
}
```

Call this from model invalidation hooks (for example, after writes or schema-level events). When possible, narrow the pattern to tenant prefixes.

---

## Cache warming

Warm only targeted, high-value queries. Avoid warming entire large collections. Example warm plan:

- Identify top 10 queries by traffic.
- Warm them with sensible TTLs during startup or a low-traffic window.
- Use circuit-breakers and timeouts to avoid delaying app startup.

Example:

```ts
await UserModel.warmCache([
  { filter: { status: 'active' }, cacheKey: `tenant:${tenantId}:users:active`, ttl: 3600 },
  { filter: { featured: true }, cacheKey: `tenant:${tenantId}:content:featured`, ttl: 7200 }
]);
```

---

## Monitoring and metrics

Track at minimum:

- Cache hit / miss ratio
- Total cached keys (global and per-tenant)
- Memory usage on Redis
- Latency for cache reads/writes

Expose an endpoint or integrate with your APM to capture these metrics. Use Redis `INFO` and the library `getCacheStats()` helper (if available) as sources.

---

## Troubleshooting

- Too many misses: check key generation consistency and TTLs.
- High memory usage: reduce TTLs, use more specific keys, or configure an eviction policy (e.g., `allkeys-lru`).
- Slow invalidation: ensure `SCAN` batches are small and do not block Redis.
- Cache inconsistency after writes: use write-through or explicitly invalidate related cache keys after mutations.

---

## Example: production-ready flow (compact)

```ts
// 1) Ensure redis is connected during bootstrap
await RedisService.getInstance().connect();

// 2) Warm critical caches (non-blocking)
UserModel.warmCache([{ filter: { status: 'active' }, cacheKey: `tenant:${tenantId}:users:active`, ttl: 3600 }]);

// 3) Use cache-aside in request handlers
const users = await UserModel.findWithCache({ status: 'active' }, `tenant:${tenantId}:users:active`, 300);

// 4) Invalidate on updates
await AbimongoModel.invalidatePattern(`tenant:${tenantId}:users:*`);
```

---

## Best practices (summary)

- Use tenant-prefixed, descriptive keys.
- Prefer cache-aside for reads; use write-through only when appropriate.
- Avoid blocking Redis operations; use SCAN for pattern deletions.
- Warm caches selectively and safely.
- Monitor hit/miss ratios and memory; set alerts for regressions.
- Make sure application logic remains correct when cache is cold or unavailable.
