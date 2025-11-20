<p align="center">
  <img src="../../abimongo-brand/abimongo-logo_socials.png" width="360" alt="Abimongo Logo">
</p> 

<h1 align="center">@abimongo/logger</h1>
<p align="center">
  <strong>Structured Logging for the Abimongo Ecosystem</strong><br>
  JSON Logs • Transports • Correlation IDs • Production-Ready
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@abimongo/logger">
    <img src="https://img.shields.io/npm/v/@abimongo/logger.svg?style=flat-square&color=00C4B4" alt="npm version">
  </a>
  <a href="https://github.com/Nodem9/abimongo">
    <img src="https://img.shields.io/github/stars/Nodem9/abimongo?style=flat-square&color=1E88E5" alt="GitHub stars">
  </a>
</p>

---
<!-- 
 ![npm version](https://img.shields.io/npm/v/@abimongo/logger.svg)
 ![Release workflow](https://github.com/NodEm9/abimongo/actions/workflows/release.yml/badge.svg) -->


A modular utility library for Node.js projects, starting with a robust, extensible logger utility. This library is designed to be expanded with additional utilities over time, making it a central toolkit for your backend applications.

---

## Release Notes — v2.0.0

Released: 2025-11-09

- Major bump to `@abimongo/logger` -> **2.0.0**.
- Fix: GraphQL-related issues in the core package have been addressed so consumers using Abimongo Core will not encounter runtime logging errors related to transport shapes.
- Fix: Improved robustness when consumers configure transports (defensive checks to avoid runtime TypeError when a transport entry is undefined).
- Fix: Buffered -> file transport flush behavior improved so buffered logs reach the file transport promptly.
- Misc: Docs, metrics card updates, and packaging improvements.

Upgrade notes:
- This is a major release. Please test in staging before upgrading production.
- If you previously passed transport factory references, ensure you follow the transport API: pass either an instantiated transport object (has `.write` or `.log`) or a function-style transporter (`async (message, meta) => ...`) as appropriate.


## Features

- **Advanced Logger Utility**  
  - Customizable log levels (`info`, `debug`, `error`, etc.)
  - Pluggable transporters (console, file, custom)
  - Hooks for log and error events
  - Metadata enrichment
  - Source-based log exclusion
  - TypeScript support

---

## Installation

```sh
npm install @abimongo/logger
```

---

## Logger Usage

### Logger Utility

#### Basic Setup

```typescript
import { setupLogger } from '@abimongo/logger';

const logger = setupLogger({
  level: 'info',
  transporters: [
    {
      write: (msg: string) => {
        // Write to console, file, or any custom destination
        console.log(msg);
      }
    },
    // Add other properties here
  ],
  hooks: {
    onLog: (msg, meta) => {
      // Custom logic after logging
    },
    onError: (err, meta) => {
      // Custom error handling
    }
  },
  enrichMetadata: (meta) => ({
    ...meta,
    timestamp: new Date().toISOString(),
  }),
  excludedSources: ['test'],
});
```

#### Logging

```typescript
logger.info('Application started', { source: 'app' });
logger.error('Something went wrong', { source: 'service', error: new Error('fail') });
```

#### Using a Custom Logger

If you already have a logger instance, you can pass it to `setupLogger`:

```typescript
const customLogger = {
  info: (msg: string) => { /* ... */ },
  error: (msg: string) => { /* ... */ },
};

const logger = setupLogger({ logger: customLogger });
```

---

If you are implementing ( logger ) without using the above setup yourself then follow below steps.

## 🔥 Advanced Logger Usage (`@@abimongo/logger`)

The logger is a pluggable, buffered, rolling log system that supports:

- ✅ JSON or text formatting
- ✅ Daily file rotation with compression
- ✅ Multi-tenant routing
- ✅ Redis real-time log streaming
- ✅ Metrics tracking

### Install Redis for full features

```bash
npm install redis      # windows
brew install redis     # macOS
sudo apt install redis # Linux
```

### Usage

```ts
import { logger } from '@abimongo/logger';

await logger.log('User created', 'info', { tenantId: 'org-123' });
```

### Metrics

```ts
logger.getMetrics(); // { totalLogs, flushedBuffers, logsPerMinute }

```

### Flush & CLose

```ts
await logger.flushAll();
await logger.close();
```

### CLI Tools

```bash
npm run logger:tail      # Tail logs in terminal (from Redis)
npm run logger:flush     # Flush buffered logs
npm run logger:metrics   # View internal metrics
```

### Real-time Dashboard

```bash
npm run start
# Visit /log-dashboard
```

This page connects to a WebSocket server that listens to logs:* Redis channels.

---

## Development

### Running Locally with Docker

A `docker-compose.yml` is provided for local development:

```sh
docker-compose up
```

This will mount your code, install dependencies, build the library, and keep the container running for development and testing.

### Scripts

- `npm run build` – Build the library
- `npm test` – Run tests
- `npm run lint` – Lint the codebase

---

## Publishing

This library is published to npm via GitHub Actions when a new version tag (`v*.*.*`) is pushed to the `main` or `master` branch.

---

## Extending the Library

The `abimongo_logger library is designed to be extended. Future utilities can be added under the`src/` directory and exported via the main entry point.

---

## License

ISC

---

## Maintainers

- Emmanuel Nodolomwanyi ([padave805@gmail.com](mailto:padave805@gmail.com))

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests for new utilities or improvements.
