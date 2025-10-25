# Overview

The logger package provides a lightweight, extensible logging system tailored for Abimongo services and applications. It offers structured log output, multiple transport options, and runtime configuration helpers so you can capture diagnostics consistently across CLI tools, server processes, and worker jobs.

This package is intentionally small and framework-agnostic: use the provided logger directly, or plug its transports into your existing logging stack.

## Key features

- Structured JSON and human-readable formats
- Multiple transports (console, files, external sinks)
- Pluggable transports and custom formatters
- Minimal runtime configuration with sensible defaults
- TypeScript-friendly API and transports with small footprint

## Quick start

Install and create a logger instance, then log messages using standard levels:

```ts
import { createLogger } from '@abimongo/logger';

const logger = createLogger({
  level: 'info',
  format: 'pretty', // or 'json'
});

logger.info('Server started', { port: 3000 });
logger.error('Failed to connect to DB', { err });
```

## Configuration

The logger exposes a small configuration surface:

- level: 'debug' | 'info' | 'warn' | 'error' (default: 'info')
- format: 'json' | 'pretty' (default: 'json' in production)
- transports: array of transport definitions (console, file, custom)

Example: add a rotating file transport:

```ts
setupLogger({
  level: 'info',
  transports: [
    { type: 'console' },
    { type: 'file', path: './logs/app.log', maxSize: '10m' },
  ],
});
```

## Extending with custom transports

To integrate a third-party sink or ship logs to an external system, implement the transport interface and register it with the logger's configuration. Transports receive structured log objects and are responsible for delivery and error handling.

## When to use this package

Use the logger package when you need a small, opinionated logger that:

- Works well inside Abimongo services and CLI tools
- Requires structured logs for observability and tracing
- Must be easy to configure and extend for new sinks

For more advanced integrations (tracing, correlation with request IDs), combine this logger with your observability stack or use the application-level middleware examples in the docs.

## Next

- See `./transports.md` for built-in transport options and configuration details.
- See `../guides.md` for common patterns (request-scoped logging, log rotation, and production tips).
