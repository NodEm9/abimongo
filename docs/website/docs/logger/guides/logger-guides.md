---
slug: /logger/logger-guides
title: Logger - guides
---

## Practical logging patterns and guidance

This guide collects practical patterns and examples for using the Abimongo logger in real applications: request-scoped logging, correlation/request IDs, graceful shutdown, log rotation and retention, and production tuning.

### Request-scoped logging

Request-scoped (or context-scoped) logging means enriching every log entry produced while handling an incoming request with the same correlation metadata (request id, user id, tenant id). Two common approaches:

1. Use AsyncLocalStorage to bind per-request context and read it in logger middleware.
2. Pass a child or scoped logger to downstream services.

Example — AsyncLocalStorage approach (Node/Express):

```ts
import express from 'express';
import { setupLogger } from '@abimongo/logger';
import { AsyncLocalStorage } from 'async_hooks';

const app = express();
const als = new AsyncLocalStorage<Record<string, any>>();
const logger = setupLogger({ level: 'info', transports: [{ type: 'console' }] });

app.use((req, res, next) => {
  const context = { requestId: req.headers['x-request-id'] || generateId(), tenantId: req.headers['x-tenant-id'] };
  als.run(context, () => next());
});

function logWithContext(level: 'info' | 'error' | 'debug', message: string, meta = {}) {
  const ctx = als.getStore() || {};
  logger.log(`${message} [request=${ctx.requestId}]`, level, { tenantId: ctx.tenantId, ...meta });
}

app.get('/', (req, res) => {
  logWithContext('info', 'handling root');
  res.send('ok');
});
```

Notes:

- Keep the context minimal and avoid high-cardinality values in logged labels.
- If you prefer functional injection, use `setupLogger` and pass the logger instance to controllers/services.

### Correlation IDs and tracing

Correlation IDs tie together logs, traces, and metrics. Add a middleware that extracts/generates a correlation id and ensures it flows into logs and external tracing systems.

Best practices

- Generate a UUID when missing and propagate it via a request header (e.g., `X-Request-Id`).
- Include correlation IDs in structured logs as a top-level field for easy querying.
- If you use distributed tracing, ensure logs include trace/span identifiers.

### Graceful shutdown and flushing logs

Always flush buffered transports before exiting to avoid losing messages. The Abimongo logger exposes `flushAll()` and `shutdown()` helpers.

Example — graceful shutdown in an HTTP server

```ts
import http from 'http';
import { setupLogger } from '@abimongo/logger';

const logger = setupLogger({ level: 'info', transports: [{ type: 'file', path: './logs/app.log' }] });
const server = http.createServer((req, res) => { res.end('ok'); });

process.on('SIGINT', async () => {
  logger.info('SIGINT received — flushing logs and shutting down');
  await logger.flushAll();
  await logger.shutdown();
  server.close(() => process.exit(0));
});

server.listen(3000);
```

Notes:

- `shutdown()` closes transports and clears timers. Call it during your application's controlled termination.
- If you use the exported singleton `logger`, it may have already wired signal handlers — choose the pattern (manual or auto) that fits your app.

### Log rotation, retention and file management

For production workloads prefer the rotating/advanced rolling transporter (`AdvancedRollingFileTransporter`). Configure `maxSize`, `frequency`, and `backupCount` to match disk capacity and retention policies.

Tips:

- Use time-based indices or daily files for easier retention policies.
- Compress older logs to save disk and reduce network transfer costs.
- Ensure log directories are created with correct permissions before starting the service.

### Performance and high-throughput tuning

- Use `BufferedTransporter` or `AsyncBatchTransporter` to batch writes and reduce IO.
- Tune `flushInterval` and `flushSize` based on expected QPS and acceptable latency. Larger buffers reduce IO but increase potential message loss on crashes.
- Profile your logging calls — avoid expensive synchronous stringification inside hot paths; prefer structured objects that format at transport time.

### Observability integration

- For metrics and tracing, include trace IDs and request IDs in the log metadata. This makes it easy to correlate logs with traces in APM systems.
- When shipping logs to remote systems (Elasticsearch, Loki), use the respective transport factories and follow the examples in the transports docs for mapping and labels.

### Security and privacy

- Avoid logging sensitive data (passwords, secret tokens, PII). If necessary, redact fields at a single centralized point (formatter) before sending to transports.
- Use access controls on log storage (S3 buckets, Elastic indices) and rotate any credentials used by remote transports.

### Troubleshooting and tips

- If logs are missing, check that buffered transports were flushed and that file permissions and disk space are available.
- Use `logger.getMetrics()` (if using `AbimongoLogger`) to inspect transport flush counts and errors.
- In development, enable `pretty` or console transports for immediate feedback; switch to `json` formatting in production for structured pipelines.

## Next

- See [Tramsports page](../transports.md) for transport-specific examples (Loki, Elastic, HTTP). If you'd like, I can add copy/paste-ready middleware or a small example app demonstrating request-scoped logs and graceful shutdown.
