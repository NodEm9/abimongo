# Logger FAQ

## What is the Abimongo logger?

The Abimongo logger is a lightweight logging utility used across the Abimongo packages. It provides configurable transports, structured logs, and helper utilities for clean shutdown in long-running processes or tests.

## How do I configure logging level and transports?

You configure the logger by calling the exported setup/initialize function from the `@abimongo/logger` package (see `docs/logger/intro.md` for full examples). Typical options include:

- level: the minimum log level to emit (e.g., `info`, `warn`, `error`, `debug`).
- console: enable or disable console output.
- file: configure file transport path, rotation, and max size.
- custom transports: provide your own transport implementing the expected interface.

Example (simplified):

```ts
import { Logger } from '@abimongo/logger';

Logger.initialize({ level: 'info', console: true });
```

## Can I use multiple transports at once?

Yes. The logger supports multiple transports — for example, you can write to console and also to a rotating file. Configure each transport in the logger options.

## How do I shut down the logger (for tests or graceful exit)?

The logger exports a shutdown function that gracefully flushes buffers and closes transports. Call it during test teardown or application shutdown to avoid lost logs and to prevent Jest from reporting open handles.

```ts
import { shutdownLogger } from '@abimongo/logger';

await shutdownLogger();
```

## Why do I sometimes see "open handle" warnings in Jest after running tests?

If tests create background tasks (e.g., buffered transports, timers, or external clients) the Node process may keep handles open. To avoid this:

- Call `shutdownLogger()` in after/teardown hooks.
- Ensure any mocked transports do not start timers or I/O loops, or explicitly stop them in test teardown.

## How does the logger integrate with the rest of Abimongo?

The core and logger packages use the same logging abstraction. Core components will call the logger for important lifecycle events (connection, errors, GC runs, etc.), so configuring the logger at app start provides consistent logs across packages.

## How can I add a custom transport?

Provide an object implementing the transport interface expected by the logger (usually `log(level, message, meta)`, `flush()` and `close()` where applicable). Pass it to the logger configuration when initializing.

## Is structured (JSON) logging supported?

Yes. The logger can be configured to output structured JSON logs suitable for log aggregation services. Check the `intro.md` for examples configuring JSON formatting and extra metadata.

## What log levels are available?

Typical levels: `error`, `warn`, `info`, `verbose`, `debug`, `silly` (the logger exposes the set supported by the underlying transport). Use the minimum appropriate level in production to reduce noise.

## I configured the logger but no logs appear — what should I check?

1. Confirm the configured log level is not higher than the messages you expect (e.g., if set to `error` you won't see `info`).
2. Ensure the transport you configured (console, file, remote) is enabled and has write permissions.
3. If running in tests, verify `initLogger()` is called before the code under test and that transports weren't accidentally disabled.

## Where can I find examples and API details?

See `docs/logger/intro.md` for a quickstart and configuration examples. For usage in code, inspect the `@abimongo/logger` package source and its public API in the TypeScript declarations.

---

If you'd like, I can:

- Add one or two short runnable examples to this FAQ.
- Add a short note about how to configure the logger for CI vs local development.
- Run the docs build to verify the page renders.

Let me know which of those you'd like me to do next.
