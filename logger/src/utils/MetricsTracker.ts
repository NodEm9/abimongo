import { clearAllTimers, registerInterval } from "./TimerRegistry";

/**
 * MetricsTracker is a utility class for tracking and reporting metrics related to logging operations.
 * It tracks the total number of logs, flushed buffers, and rotations, and provides periodic snapshots.
 * It can be used to monitor the performance and efficiency of logging operations in an application.
 * It supports starting and stopping the tracking process, and can report metrics at a specified interval.
 * It is designed to be used in a Node.js environment.
 */
export interface MetricsSnapshot {
  totalLogs: number;
  flushedBuffers: number;
  rotations: number;
  logsPerMinute: number;
}

export class MetricsTracker {
  private totalLogs = 0;
  private flushedBuffers = 0;
  private rotations = 0;
  private lastTotalLogs = 0;
  private intervalId?: NodeJS.Timeout;

  public trackLog(): void {
    this.totalLogs++;
    // console.log('[metric] log incremented:', this.totalLogs);
  }

  public trackFlush(): void {
    this.flushedBuffers++;
    // console.log('[metric] flush incremented:', this.flushedBuffers);
  }

  public trackRotation(): void {
    this.rotations++;
    // console.log('[metric] rotation incremented:', this.rotations);
  }

  public start(interval = 60_000): void {
    this.intervalId = registerInterval(setInterval(() => {
      const snapshot = this.getSnapshot();
      console.log('📈 Metrics Snapshot:', snapshot);
      this.resetForNextCycle();
    }, interval));
    // console.log(`Metrics tracking started with interval: ${interval}ms`);
  }

  public async stop(): Promise<void> {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
      await clearAllTimers();
      console.log('Metrics tracking stopped.');
    }
  }

  private resetForNextCycle(): void {
    this.flushedBuffers = 0;
    this.rotations = 0;
    this.lastTotalLogs = this.totalLogs;
  }

  public getSnapshot(): MetricsSnapshot {
    return {
      totalLogs: this.totalLogs,
      flushedBuffers: this.flushedBuffers,
      rotations: this.rotations,
      logsPerMinute: this.totalLogs - this.lastTotalLogs,
    };
  }
}
