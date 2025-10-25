**@abimongo/logger**

# MetricsTracker

`MetricsTracker` is a small runtime helper used by the logger to collect lightweight metrics about logging activity. It is intended for operational visibility (local development or production diagnostics) and not for high-frequency, high-precision telemetry.

Key responsibilities:

- Count total logged messages (`totalLogs`)
- Count buffer flush events (`flushedBuffers`)
- Count file/transport rotations (`rotations`)
- Provide periodic snapshots and a simple per-interval `logsPerMinute` metric

## When to use

- Enable it to get a simple heartbeat of how many log entries your app emits.
- Useful during load testing, debugging logging backpressure, and validating transport throughput.

## Basic example

```ts
import { MetricsTracker } from '@abimongo/abimongo-logger';

const metrics = new MetricsTracker();
metrics.start(60_000); // log snapshots every 60s

// called by transports / logger when something happens
metrics.trackLog();       // a log was emitted
metrics.trackFlush();     // a buffer was flushed to disk/remote
metrics.trackRotation();  // a rotating file triggered a rotation

// get a manual snapshot
const snapshot = metrics.getSnapshot();
console.log(snapshot);

// stop tracking when shutting down
await metrics.stop();
```

## API (signatures)

```ts
start(interval?: number): void
stop(): Promise<void>
trackLog(): void
trackFlush(): void
trackRotation(): void
getSnapshot(): MetricsSnapshot
isTrackingMetrics(): boolean
```

### start(interval?: number): void

Start periodic snapshots. `interval` is in milliseconds (defaults to 60_000). Internally the tracker registers a timer and prints a snapshot to console each interval.

### stop()

Stop periodic snapshots and clear internal timers. Returns when timer cleanup is complete.

Return value:

```ts
Promise<void>
```

### trackLog(): void

Increment the internal total log counter. Logger/transports call this when a log is emitted.

### trackFlush(): void

Increment the flushed buffers counter. Call this when buffered transports flush their buffer.

### trackRotation(): void

Increment the rotations counter. Call this when a rotation/rollover occurs.

### getSnapshot(): MetricsSnapshot

Return the current snapshot with shape: `{ totalLogs, flushedBuffers, rotations, logsPerMinute }`.

### isTrackingMetrics(): boolean

Returns true when the tracker is currently running (start was called and not stopped).

## Notes and implementation details

- The tracker maintains a running `totalLogs` counter across the process lifetime. `logsPerMinute` is computed as `totalLogs - lastTotalLogs` where `lastTotalLogs` is the total at the start of the previous interval. That makes it an interval delta (e.g., logs emitted during the last configured interval).
- Periodic snapshots are written to stdout using `console.log('📈 Metrics Snapshot:', snapshot)`; this is intentional for quick visibility but you can remove or redirect that output in your app.
- The tracker uses an internal timer registry (`TimerRegistry`) so the logger package can centrally manage and clear timers during graceful shutdown.
- `stop()` clears the interval and awaits `clearAllTimers()` to ensure any registered timers are removed.

## Caveats

- MetricsTracker is deliberately simple and synchronous. It is not a replacement for a dedicated metrics/telemetry system (Prometheus, StatsD, OpenTelemetry). Use it for quick operational insight and integration testing.
- Heavy use of `trackLog()` (for example, calling it per log in a very high-volume system) is lightweight but still has some cost; if you need high-scale telemetry, wire your transports to a metrics pipeline instead.

## Troubleshooting

- If snapshots don't appear, verify that `start()` was called and the process is not suppressing stdout.
- If `logsPerMinute` is unexpectedly low, check that `trackLog()` is being called from your transport or logger pipeline.
