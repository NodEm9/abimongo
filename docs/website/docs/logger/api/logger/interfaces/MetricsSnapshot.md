# Interface: MetricsSnapshot

Defined in: utils/MetricsTracker.ts:16

MetricsTracker is a utility class for tracking and reporting metrics related to logging operations.
It tracks the total number of logs, flushed buffers, and rotations, and provides periodic snapshots.
It can be used to monitor the performance and efficiency of logging operations in an application.
It supports starting and stopping the tracking process, and can report metrics at a specified interval.
It is designed to be used in a Node.js environment.

## Example

```ts
const metrics = new MetricsTracker();
metrics.start(60000); // Start tracking with a 1-minute interval
// ... logging operations ...
const snapshot = metrics.getSnapshot(); // Get current metrics snapshot
metrics.stop(); // Stop tracking
```

## Properties

### flushedBuffers

> **flushedBuffers**: `number`

Defined in: utils/MetricsTracker.ts:18

***

### logsPerMinute

> **logsPerMinute**: `number`

Defined in: utils/MetricsTracker.ts:20

***

### rotations

> **rotations**: `number`

Defined in: utils/MetricsTracker.ts:19

***

### totalLogs

> **totalLogs**: `number`

Defined in: utils/MetricsTracker.ts:17
