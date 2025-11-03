---
slug: /logger/consumption
title: Consuming the logger
---

## Overview

The logger package exposes two primary consumption patterns so you can pick the style that best fits your application architecture:

- setupLogger(config): a small factory function that returns an `ILogger` instance (or re-uses one supplied on the config). Ideal for DI and functional code paths.
- AbimongoLogger / exported `logger`: a class-based API and a module-level singleton (the package exports `logger`) for apps that want an instance with built-in transports, metrics tracking, and lifecycle hooks.

Both approaches share the same configuration surface (the `LoggerConfig` type) and the same transport implementations. Choose the pattern that matches your app's lifecycle and dependency style.

## Pattern A — setupLogger(config)

Use `setupLogger` when you want a simple factory that returns an `ILogger` (or uses `config.logger` if provided). This is the preferred approach when wiring logging via configuration or dependency injection.

Signature

```ts
function setupLogger(config: LoggerConfig): ILogger
```

Example (DI-friendly)

```ts
import { setupLogger } from '@abimongo/logger';

const logger = setupLogger({
  level: 'info',
  format: 'json',
  transports: [ { type: 'console' } ]
});

logger.info('App started');
```

Notes

- If you pass `config.logger`, `setupLogger` will return it unchanged.
- `setupLogger` will warn when the circuit breaker is enabled to encourage aligning transports and error handling.
- This pattern gives you a plain `ILogger` object that you can store in your application context, pass to services, or mock in tests.

## Pattern B — AbimongoLogger class and exported singleton

The package also provides a class-based logger implementation (used to create the exported `logger` singleton). `AbimongoLogger` offers features optimized for Abimongo services:

- Tenant-aware transports: creates per-tenant transports and files by default
- Buffered transports with configurable flush intervals and sizes
- Advanced rolling file transport with daily rotation
- Metrics tracking (start/stop) and lifecycle helpers (flush/close/shutdown)

Use cases

- Long-running server processes that require per-tenant log files
- Services that need tight control of flush and shutdown behavior

Basic example (direct usage)

```ts
import { AbimongoLogger } from '@abimongo/logger';

const abLogger = new AbimongoLogger({
  format: 'json',
  baseLogPath: '/var/log/abimongo',
  flushInterval: 2000,
  flushSize: 20,
});

await abLogger.log('Started', 'info', { tenantId: 'tenant-a' });
```

Exported singleton

The package exports a ready-to-use `logger` instance. It is created with default options at module initialization and is convenient for simple apps and scripts. The exported `logger` also wires process signals (SIGINT/SIGTERM) and global handlers (uncaughtException/unhandledRejection) in production/dev modes to flush and shut down transports.

```ts
import { logger } from '@abimongo/logger';

logger.info('Using exported logger');

// During graceful shutdown (example):
await logger.flushAll();
await logger.shutdown();
```

API highlights

```ts
// Common API highlights
log(message: string, level?: LogLevel, meta?: { tenantId?: string }): void
flushAll(): Promise<void>
shutdown(): Promise<void>
close(): Promise<void>
startTrackingMetrics(interval?: number): void
stopTrackingMetrics(): void
```

Lifecycle and production notes

- The `AbimongoLogger` constructor and the exported `logger` check `process.env.NODE_ENV` to decide whether to start metrics and to register signal handlers. Tests are guarded to avoid noise during unit runs.
- If you run the exported `logger` in production, it registers SIGINT and SIGTERM handlers that call `shutdown()` and exit the process. If you prefer to manage shutdown yourself (for example in a server framework with its own lifecycle), use `setupLogger` or instantiate `AbimongoLogger` directly and avoid the module-level singleton.

Choosing between the patterns

- Use `setupLogger` when you want an injectable, testable logger and prefer to control process-level lifecycle in your application code.
- Use `AbimongoLogger` (or the exported `logger`) for convenience in CLI tools or simple services that benefit from the built-in transports and automatic signal handling.

## Example: graceful shutdown (recommended for servers)

```ts
import { setupLogger } from '@abimongo/logger';

const logger = setupLogger({ level: 'info', transports: [{ type: 'console' }] });

process.on('SIGINT', async () => {
  logger.info('SIGINT received — flushing logs');
  await logger.flushAll();
  process.exit(0);
});
```

## Next

- See `./transports.md` for transport configuration details (console, file, buffered, rotating).
- See `../guides.md` for patterns: request-scoped logging, custom transports, and production tuning.
