---
slug: /logger/transports
title: (Advanced) Logger transports
---

## Overview

Transports are the pieces that actually deliver log messages to a destination (console, file, remote HTTP endpoint, etc.). The Abimongo logger package ships several ready-to-use transports and transport helpers. This page documents the built-in transports, their options, and example usage.

## Built-in transports

### Console transport

- Module: `consoleTransport`
- Purpose: write formatted messages to the process console; useful for local development or CLI tools.
- Options: `colorize: boolean` (default: true)

Example

```ts
import { consoleTransport } from '@abimongo/logger';

const transport = consoleTransport(true);
await transport.write('Server started', 'info');
```

Notes: the console transport formats timestamps and uses level-based coloring when enabled.

### File transport

- Class / factory: `FileTransporter` / `createFileTransporter(filePath)`
- Purpose: append logs to a specified file stream.
- Key behavior: opens an append stream to the provided path and writes formatted log lines.

Example

```ts
import { createFileTransporter } from '@abimongo/logger';

const fileTransport = createFileTransporter('./logs/app.log');
await fileTransport.write('Application started');
```

When to use: simple single-file logging for small services or local debugging. For rotation or production retention, prefer the rotating/advanced transport below.

### Advanced rolling / rotating file transporter

- Class: `AdvancedRollingFileTransporter`
- Factory wrapper: `createRotatingFileTransporter(options)` (returns a buffered transporter or a compatible interface)
- Purpose: writes logs to files with time/size-based rotation, optional compression, and backup retention.

Options (common)

- `filename: string` — base file path for logs
- `maxSize?: number` — rotate when file exceeds this size (bytes)
- `backupCount?: number` — how many rotated files to keep
- `frequency?: 'daily' | 'hourly'` — rotation cadence
- `compress?: boolean` — gzip rotated files when true
- `flushInterval?: number` — how frequently buffered data is flushed (ms)

Example

```ts
import { createRotatingFileTransporter } from '@abimongo/logger';

const rotating = createRotatingFileTransporter({
  filename: './logs/abimongo.log',
  frequency: 'daily',
  maxSize: 10 * 1024 * 1024,
  backupCount: 7,
  compress: true,
  flushInterval: 5000,
});

await rotating.write('Service event');
```

Notes: the library wraps the rolling file transporter with a `BufferedTransporter` in many code paths so writes are batched and flushed periodically for performance.

### BufferedTransporter

- Class: `BufferedTransporter`
- Purpose: buffer log messages in-memory and flush them to an underlying `Transporter` either periodically or when the buffer reaches a configured size. This reduces write contention and improves throughput.

Options

- `flushInterval?: number` (ms) — default ~5000
- `flushSize?: number` — number of entries before auto-flush (default ~10)

Example

```ts
import { BufferedTransporter } from '@abimongo/logger';
import { createFileTransporter } from '@abimongo/logger';

const file = createFileTransporter('./logs/app.log');
const buffered = new BufferedTransporter(file, { flushInterval: 3000, flushSize: 20 });

await buffered.write('some message');
// buffered.flush() and buffered.stop() available when you need to control lifecycle
```

Notes: call `flush()` before process exit, or use `stop()` to flush and close the underlying transporter. The logger package wires flush/close calls into process lifecycle in production when using the exported singleton.

### AsyncBatchTransporter

- Class: `AsyncBatchTransporter`
- Purpose: collect log entries in batches and send them via a user-provided `sendBatch(entries)` function. Ideal for batching logs to remote sinks or APIs.

Options

- `batchSize?: number` — send when buffer reaches this size (default: 10)
- `flushInterval?: number` — send periodically (ms)
- `sendBatch: (entries) => Promise<void>` — required function that delivers a batch

Example

```ts
import { AsyncBatchTransporter } from '@abimongo/logger';

const transporter = new AsyncBatchTransporter({
  batchSize: 50,
  flushInterval: 3000,
  sendBatch: async (entries) => {
    await sendToApi(entries);
  }
});

transporter.log('info', 'event', []);
```

Notes: errors from `sendBatch` should be handled by the provided implementation — consider adding retry/backoff logic and/or wrapping with `createResilientTransporter` when sending to flaky networks.

### Remote transports (HTTP, ElasticSearch, Loki) and resilient wrapper

Provided factories:

- `createHttpTransport(url)` — simple HTTP POST transporter
- `createElasticTransport(url, index)` — posts documents to an Elasticsearch index
- `createLokiTransport(pushUrl, labels)` — pushes logs to Loki
- `createResilientTransporter(baseTransporter)` — wraps a `RemoteTransporter` with retries and a circuit breaker

Example (HTTP)

```ts
import { createHttpTransport, createResilientTransporter } from '@abimongo/logger';

const httpBase = createHttpTransport('https://logs.example.com/collect');
const httpResilient = createResilientTransporter(httpBase);

await httpResilient('message body', { level: 'info', meta: {} });
```

Notes: remote transports use `axios` and can be wrapped with a circuit-breaker + retry policy. This prevents noisy failures from overwhelming the application and provides automatic retry/backoff.

## Lifecycle and shutdown

- Buffered and rotating transports maintain internal timers to flush periodically. Always call `flush()` or `stop()` on buffered transporters during graceful shutdown to avoid losing log messages.
- The package's exported `logger` instance wires process signals (SIGINT/SIGTERM) and global error handlers to flush and shutdown transports in production mode. If you manage lifecycle elsewhere, instantiate transporters and the logger yourself and call `shutdown()`/`close()` as appropriate.

## Choosing transports

- Local development / CLI: `consoleTransport` (pretty output)
- Persistent single-file logs: `createFileTransporter` or `AdvancedRollingFileTransporter` for rotation
- High-throughput services: add `BufferedTransporter` over file/remote transports
- Remote ingestion / observability: `createHttpTransport`, `createElasticTransport`, `createLokiTransport`, ideally wrapped with `createResilientTransporter` or using `AsyncBatchTransporter`

## Examples — wiring into setupLogger

```ts
import { setupLogger } from '@abimongo/logger';
import { createHttpTransport } from '@abimongo/logger';

const logger = setupLogger({
  level: 'info',
  transports: [ { 
   write: async (message) => {
     console.log(`[ABIMONGO] message received: ${message}`)
    }
  }, 
  createHttpTransport('https://logs.example.com/collect')  
  ],
  hooks: {
    onLog: (entry) => {
      console.log(`[ALERT] ${entry.message}`);
      return entry;
    },
    onError: (err, context) => {
      console.error('Logging error occurred:', err, context);
      bufferedTransporter.stop();
      return false;
    },
  },
  // Pass other LoggerConfig interface property you may need
});
```

## Detailed examples

### 1) Custom sendBatch with retry/backoff (AsyncBatchTransporter)

Use AsyncBatchTransporter when you want to batch logs and push them to a remote HTTP API. Below is an example `sendBatch` implementation that retries transient failures using exponential backoff. It uses the built-in `retryWithBackoff` helper from the logger utils (you can also implement your own retry logic).

```ts
import { AsyncBatchTransporter } from '@abimongo/logger';
import axios from 'axios';
import { retryWithBackoff } from '@abimongo/logger';

async function sendBatchToApi(entries: any[]) {
  await axios.post('https://logs.example.com/batch', { entries });
}

const transporter = new AsyncBatchTransporter({
  batchSize: 50,
  flushInterval: 5000,
  sendBatch: async (entries) => {
    await retryWithBackoff(async () => sendBatchToApi(entries), { retries: 5, baseDelay: 200 });
  },
});

// Usage in logger wiring
transporter.log('info', 'user.created', [{ userId: 123 }]);
```

Notes:

- Keep `sendBatch` small and idempotent if possible.
- Use retries for transient network errors and a dead-letter queue or disk buffer for persistent failures.

### 2) Elasticsearch mapping + bulk ingest example

When sending logs to Elasticsearch, index mapping helps you query logs efficiently (timestamps, levels, structured fields). The example below shows a minimal index template and a bulk ingest function suitable for `AsyncBatchTransporter.sendBatch`.

Index mapping (create once in Elasticsearch)

```json
PUT _index_template/abimongo_logs
{
  "index_patterns": ["abimongo-logs-*"],
  "template": {
    "settings": { "number_of_shards": 1 },
    "mappings": {
      "properties": {
        "timestamp": { "type": "date" },
        "level": { "type": "keyword" },
        "message": { "type": "text" },
        "tenantId": { "type": "keyword" },
        "meta": { "type": "object", "enabled": true }
      }
    }
  }
}
```

Bulk ingest example for sendBatch

```ts
import axios from 'axios';

async function sendBatchToElastic(entries: any[]) {
  // Build a bulk payload (action/meta + source pairs)
  const bodyLines: string[] = [];
  for (const e of entries) {
    const indexMeta = { index: { _index: `abimongo-logs-${new Date().toISOString().slice(0,10)}` } };
    bodyLines.push(JSON.stringify(indexMeta));
    bodyLines.push(JSON.stringify(e));
  }

  const payload = bodyLines.join('\n') + '\n';

  await axios.post('https://elastic.example.com/_bulk', payload, {
    headers: { 'Content-Type': 'application/x-ndjson' }
  });
}

// Use with AsyncBatchTransporter
const transporter = new AsyncBatchTransporter({
  batchSize: 100,
  flushInterval: 3000,
  sendBatch: sendBatchToElastic,
});
```

Notes:

- Use index templates and daily/weekly indices for retention and performance.
- Monitor bulk API responses for partial failures and retry only the failed items.

#### Robust bulk ingest with partial-failure retry and circuit breaker

The Elasticsearch bulk API may return partial failures. The pattern below:

1. Sends a bulk payload.
2. Parses the bulk response and extracts failed items.
3. Retries only failed items using `retryWithBackoff`.
4. Wraps the send operation in a circuit breaker using `createCircuitBreaker` to avoid repeated hammering.

Note: adjust `retries`, `baseDelay`, and circuit-breaker thresholds to match your SLA and downstream capacity.

```ts
import axios from 'axios';
import { retryWithBackoff } from '@abimongo/logger';
import { createCircuitBreaker } from '@abimongo/logger';

async function sendBulkToElastic(payload: string) {
  const url = 'https://elastic.example.com/_bulk';
  const res = await axios.post(url, payload, {
    headers: { 'Content-Type': 'application/x-ndjson' },
    timeout: 10_000,
  });
  return res.data;
}

async function handleBulkResponseAndRetry(response: any, originalEntries: any[]) {
  // The bulk API returns an array of items with per-action status
  const items = response.items || [];
  const failed: any[] = [];

  items.forEach((it: any, idx: number) => {
    const op = Object.values(it)[0];
    if (op && op.status >= 300) {
      // push the original source line for retry
      failed.push(originalEntries[idx]);
    }
  });

  if (failed.length === 0) return;

  // Retry failed items with backoff
  await retryWithBackoff(async () => {
    // build bulk payload for failed items only
    const lines: string[] = [];
    for (const e of failed) {
      lines.push(JSON.stringify({ index: { _index: `abimongo-logs-${new Date().toISOString().slice(0,10)}` } }));
      lines.push(JSON.stringify(e));
    }
    const retryPayload = lines.join('\n') + '\n';
    const retryRes = await sendBulkToElastic(retryPayload);

    // If retry still has failures, throw to trigger another retry depending on retryWithBackoff config
    const retryItems = retryRes.items || [];
    const stillFailed = retryItems.some((it: any) => Object.values(it)[0].status >= 300);
    if (stillFailed) throw new Error('Retry still had failed items');
    return true;
  }, 5, 500, 2);
}

// Wrap the low-level sender with a circuit breaker
const resilientBulkSender = createCircuitBreaker(sendBulkToElastic, 4, 30_000);

// Example sendBatch function for AsyncBatchTransporter
export async function sendBatchToElasticRobust(entries: any[]) {
  const bodyLines: string[] = [];
  for (const e of entries) {
    bodyLines.push(JSON.stringify({ index: { _index: `abimongo-logs-${new Date().toISOString().slice(0,10)}` } }));
    bodyLines.push(JSON.stringify(e));
  }
  const payload = bodyLines.join('\n') + '\n';

  // Use the circuit-breaker wrapped sender and handle partial failures
  const response = await resilientBulkSender(payload);
  await handleBulkResponseAndRetry(response, entries);
}

// Use with AsyncBatchTransporter
const transporter = new AsyncBatchTransporter({
  batchSize: 100,
  flushInterval: 3000,
  sendBatch: sendBatchToElasticRobust,
});
```

### 3) Loki labels and push example

Loki expects log streams labelled with a set of labels (tenant, service, environment). Use `createLokiTransport` or implement a custom push that formats the body as Loki expects.

Example using the built-in factory

```ts
import { createLokiTransport } from '@abimongo/logger';

const labels = { job: 'abimongo', env: process.env.NODE_ENV || 'dev', tenant: 'tenant-a' };
const loki = createLokiTransport('https://loki.example.com/loki/api/v1/push', labels);

await loki('User created: 123', { level: 'info', meta: { userId: 123 } });
```

Customizing labels per-tenant

```ts
function lokiForTenant(tenantId: string) {
  const labels = { job: 'abimongo', env: process.env.NODE_ENV || 'dev', tenant: tenantId };
  return createLokiTransport('https://loki.example.com/loki/api/v1/push', labels);
}

const tenantLoki = lokiForTenant('tenant-b');
await tenantLoki('Something happened', { level: 'warn', meta: {} });
```

Notes:

- Loki stores streams by labels — make labels selective (keyword-like) and avoid high-cardinality values where possible.
- For high throughput, prefer batching or using a push gateway that accepts bulk payloads.
