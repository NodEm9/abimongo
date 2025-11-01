# Abimongo Bootstrap

This page documents the programmatic bootstrap behavior of `@abimongo/core`, outlines
configuration normalization introduced in recent releases, and lists the safer Redis & logger
initialization changes. It's intended to help maintainers and integrators understand the new
behaviour and troubleshooting steps.

## Programmatic bootstrap (Abimongo-first)

The CLI (`@abimongo/cli`) provides an "Abimongo-first" `init` flow which can optionally attempt a
programmatic bootstrap of `@abimongo/core`. Programmatic bootstrap is now opt-in: pass
`--bootstrap` (or `--validate`) to the CLI to attempt initialization. This prevents package
manager flows from being blocked by networked dependencies.

Programmatic bootstrap behaviour:

- Accepts either a path to a configuration file or a configuration object.
- Normalizes common boolean-shorthand values into full configuration objects before use.
- Attempts to initialize logger first (if enabled), then connects to services (MongoDB, Redis)
  where configured. Redis connection attempts are non-fatal — bootstrap will warn but continue
  if a short connect attempt fails.

Example (CLI):

```bash
npx @abimongo/cli init my-app --bootstrap
```

## Configuration normalization

To avoid runtime TypeErrors caused by shorthand configuration shapes (for example `logger: false`
or `redis: true`), the config loader now normalizes several fields:

- `logger` — boolean shorthand is expanded into the full logger config object with defaults.
- `graphql` / `features` — boolean shorthand is normalized to `{ enabled: true }`.
- `advanced.*` options — GC and circuit-breaker shorthand values are normalized.

This normalization happens early in `loadAbimongoConfig` and is also applied when a config
object is passed directly to the programmatic initialize API.

If you previously passed boolean shorthands to programmatic bootstrap, no changes are required —
the loader will coerce them. If you rely on custom logger transports or advanced options, prefer
the explicit object shape in `abimongo.config.json` to avoid surprises.

## Redis handling

To reduce flakiness in tests and CI the Redis manager was refactored:

- Per-URL clients are created via `getRedisClientForUrl(url?)` so code needing different Redis
  endpoints can obtain their own client without reusing a global that may be closed.
- `RedisService` singleton centralizes connect/close behaviour. Call `RedisService.getInstance().connect()`
  from your application entrypoint to establish a shared connection.
- Reconnect and background logs in the Redis reconnect strategy are routed through the project
  `logger` and are silenced during test runs (`NODE_ENV=test`) to avoid "Cannot log after tests are done"
  errors in Jest.
- Bootstrap attempts a short `client.connect()` in a try/catch and warns (non-fatal) if it fails.

If your deployment requires Redis at bootstrap time, ensure `REDIS_URI` (or the config value) is
reachable; otherwise the bootstrap will proceed but Redis-backed features may be degraded.

## Logger hardening

The logger initialization now:

- Accepts boolean shorthand and supplies a rotating-file fallback transport when no transports are
  configured to ensure logs are persisted.
- Routes lower-level system logs (for example, redis reconnect messages) through the same logger
  instance to allow centralized control and suppression in tests.

## Troubleshooting

- Bootstrap errors when running in CI: ensure programmatic bootstrap is invoked only when the
  environment expects network services. Use `--bootstrap` explicitly in CI jobs that have access
  to required services.
- Deterministic tests for Redis-absent flows are included in the test suite — they use a short
  connection timeout to validate bootstrap's non-fatal behaviour. If your environment has a
  long DNS or socket hang, adjust timeouts in the test / environment accordingly.

## Examples & Notes

- Use `initializeRedis({ useRedis: true })` from `packages/core` root entrypoint to establish a
  centralized connection via `RedisService`.
- If you need to bypass automatic bootstrap entirely, do not pass `--bootstrap` to the CLI and
  ensure consumers call `AbimongoBootstrap.initialize()` explicitly when ready.

If you'd like a deeper API-level documentation or code examples for `RedisService` /
`getRedisClientForUrl()`, tell me which APIs you want documented and I'll add code snippets.
