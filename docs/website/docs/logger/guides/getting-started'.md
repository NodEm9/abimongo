---
slug: /logger/getting-started
title: Logger - Getting started
---

Logger — Getting started

Install
-------

Install the logger package (example uses the scoped package name `@abimongo/logger`).

```bash
npm install @abimongo/logger
```

or (yarn):

```bash
yarn add @abimongo/logger
```

Quick start — factory (`setupLogger`)
----------------------------------

Use `setupLogger` when you want a small, testable logger instance you can inject into services.

```ts
import { setupLogger } from '@abimongo/logger';

const logger = setupLogger({
  level: 'info',
  format: 'json',
  transports: [ { type: 'console' } ],
});

logger.info('App started', { port: 3000 });
```

Quick start — exported singleton
--------------------------------

For quick scripts and simple services, use the package-level `logger` singleton. It is created with sensible defaults and wires graceful-shutdown handlers in production.

```ts
import { logger } from '@abimongo/logger';

logger.info('Using exported logger');

// flush before exit
await logger.flushAll();
await logger.shutdown();
```

Basic configuration options
---------------------------

- level: logging level (`debug|info|warn|error`)
- format: output format (`json|pretty`)
- transports: array of transport definitions or instances (console, file, remote)
- hooks: optional callbacks like `onLog` or `onError` for transforming or observing log entries

Example config snippet

```ts
const cfg = {
  level: 'info',
  format: 'json',
  transports: [ { type: 'console' }, { type: 'file', path: './logs/app.log' } ],
};

const logger = setupLogger(cfg);
```

Where to go next
-----------------

- Transports and examples: [Transports](../transports.md)
- Practical patterns: [Guides](./guides.md)
- Consumption patterns/API: [Consumption](../consumption.md)
