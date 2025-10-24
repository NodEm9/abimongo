# Redis integration (Abimongo Core)

Abimongo Core exposes a small, focused Redis surface that the rest of the library relies on. The real implementation lives in `packages/core/src/redis-manager/redisClient.ts` and exports a shared `redis` client, a `RedisService` singleton helper, and a `connectRedis` convenience helper.

This document describes the actual runtime API and recommended usage patterns.

---

## What the package exports

- `redis` — the shared Redis client instance (created with `createClient`).
- `RedisService` — a singleton helper with lifecycle methods: `getInstance()`, `connect()`, `getClient()`, and `close()`.
- `connectRedis()` — a small helper that returns a `{ connect }` object (used by bootstrapping code/tests).

All code that interacts with Redis in the core package uses these primitives.

---

## Configuration

The Redis client is configured from environment variables. The core code reads `process.env.REDIS_URI` (the implementation variable used in the code is `REDIS_URI`). Example value:

```bash
REDIS_URI=redis://localhost:6379
```

The client is created with a reconnect strategy that logs reconnect attempts and applies a backoff. You can provide your own client by using the lower-level `createClient(...)` helpers if necessary.

---

## `RedisService` — singleton usage

`RedisService` provides a simple lifecycle around the Redis client. Typical usage:

```ts
import { RedisService } from '@abimongo/core';

// Get the singleton
const rsvc = RedisService.getInstance();

// Connect (must be called before getClient)
await rsvc.connect();

// Get the connected client
const client = await rsvc.getClient();

// Use the client
await client.setEx('some:key', 60, JSON.stringify({ hello: 'world' }));

// Close when shutting down
await rsvc.close();
```

Important notes about the API:

- `getInstance()` returns the singleton instance (creates it on first call).
- `connect()` opens the connection to Redis. `getClient()` will throw if `connect()` hasn't been called.
- `getClient()` returns a `Promise<RedisClientType>` (the underlying client from the `redis` package).
- `close()` quits the client connection.

---

## `redis` direct client

The module also exports a `redis` client created with `createClient(...)`. In many internal places the code accesses `redis` directly for convenience. If you call `redis` APIs directly you should ensure the client is connected (for example, by calling `await RedisService.getInstance().connect()` early in your bootstrap).

Example (publisher/subscriber pattern):

```ts
import { redis } from '@abimongo/core';

// Publisher (use a duplicate client)
const publisher = redis.duplicate();
await publisher.connect();
await publisher.publish('DB_CHANGE_EVENT_users', JSON.stringify({ type: 'INSERT', document: { /* ... */ } }));

// Subscriber (separate duplicate client)
const subscriber = redis.duplicate();
await subscriber.connect();
await subscriber.subscribe('DB_CHANGE_EVENT_users', (message) => {
  const payload = JSON.parse(message);
  // handle payload
});
```

Always use `redis.duplicate()` for pub/sub to avoid interfering with the main client's command flow.

---

## `connectRedis()` helper

The codebase exports a small `connectRedis()` helper that returns an object with a `connect()` function (used by some bootstrapping/test helpers). Its simple contract is:

```ts
// returns { connect }
const helper = await connectRedis();
const { connect } = helper;
// connect() returns the shared client (not necessarily a new connection)
const client = connect();
```

This helper is intentionally minimal in the core implementation.

---

## Tenant-aware key namespacing

Abimongo Core relies on tenant-aware key namespacing when a `TenantContext` is active. The library generally stores tenant keys using a `tenant:<tenantId>:` prefix so tenant caches are isolated.

```ts
import { TenantContext } from '@abimongo/core';

TenantContext.run('tenant-123', async () => {
  // key used on Redis: tenant:tenant-123:session:abc
  await redis.setEx('session:abc', 3600, JSON.stringify({ userId: 'u1' }));
});
```

When you need to clear a tenant's cache, scan and delete keys for that tenant prefix using an incremental `SCAN` loop (avoid `KEYS` in production).

---

## Recommended patterns

- Ensure the client is connected early in your app bootstrap:

```ts
await RedisService.getInstance().connect();
```

- Use `redis.duplicate()` for pub/sub clients.
- Use TTLs for cached entries and prefix tenant keys with `tenant:<id>:`.
- Use incremental `SCAN` loops for pattern operations (delete/collect) to avoid blocking Redis.

---

## Example: publish a DB change event

```ts
import { RedisService } from '@abimongo/core';

const r = RedisService.getInstance();
await r.connect();
const client = await r.getClient();
await client.publish(`DB_CHANGE_EVENT_users`, JSON.stringify({ documentInserted: { /* ... */ } }));
```

---

## Monitoring & reconnect behavior

- The shared client is created with a small reconnect/backoff strategy and logs reconnect attempts. If you need to tune reconnection behavior, create a custom client with `createClient()`.
- Use `client.info()` and the `INFO` command to collect metrics and keyspace statistics when instrumenting.

---

## Where to look in the codebase

See `packages/core/src/redis-manager/redisClient.ts` for the authoritative implementation. Other modules reference `redis` and `RedisService` directly (for example `AbimongoGraphQL`, middleware, and model utilities).

---

If you'd like, I can run a repo-wide markdown-lint pass and fix any remaining MDxxx issues across docs, or proceed to reconcile `AbimongoModel.md` and `AbimongoClient.md` next.
