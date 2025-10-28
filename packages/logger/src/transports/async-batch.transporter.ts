import { clearAllTimers, now, registerInterval } from '../utils';
import {
  LogEntry,
  AsyncBatchTransporterOptions,
  LogLevel
} from '../types';


/**
 * AsyncBatchTransporter
 *
 * A logging transporter that batches log messages and sends them asynchronously.
 * It collects log entries in a buffer and sends them in batches based on a specified size or time interval.
 * This approach optimizes performance by reducing the number of individual log write operations.
 * @example
 * const transporter = new AsyncBatchTransporter({
 *   batchSize: 20, // Send logs in batches of 20
 *  flushInterval: 3000, // or every 3 seconds
 *  sendBatch: async (entries) => {
 *   // Custom logic to send log entries, e.g., to a remote server
 *  await sendLogsToServer(entries);
 *  },
 * });
 *
 * transporter.log('info', 'This is a log message', { userId: 123 });
 * await transporter.flush(); // Manually flush if needed
 * transporter.stop(); // Stop the transporter when done
 */
export class AsyncBatchTransporter {
  private buffer: LogEntry[] = [];
  private readonly batchSize: number;
  private readonly flushInterval: number;
  private readonly sendBatch: (entries: LogEntry[]) => Promise<void>;
  private timer?: NodeJS.Timeout;
  private readonly tag?: string;

  constructor(options: AsyncBatchTransporterOptions & { tag?: string }) {
    this.batchSize = options.batchSize || 10;
    this.flushInterval = options.flushInterval || 5000;
    this.sendBatch = options.sendBatch;
    this.tag = options.tag;

    this.start();
  }

  public log(level: LogLevel, message: string, meta: any[]) {
    const enrichedMeta = this.tag ? [...meta, { type: this.tag }] : meta;
    this.buffer.push({
      timestamp: now(),
      level,
      message,
      meta: enrichedMeta,
    });

    // Check if the buffer has reached the batch size
    // If so, flush the buffer
    if (this.buffer.length >= this.batchSize) {
      this.flush();
    }
  }

  public async flush() {
    if (this.buffer.length === 0) return;

    const entries = this.buffer.splice(0, this.buffer.length);
    try {
      await this.sendBatch(entries);
    } catch (error) {
      // You might want to add retry logic or fallback here
      console.error('Failed to send log batch:', error);
    }
  }

  private start() {
    this.timer = registerInterval(setInterval(() => this.flush(), this.flushInterval));
  }

  public stop() {
    clearInterval(this.timer);
    this.flush();
    clearAllTimers();
    console.log('AsyncBatchTransporter stopped and flushed.');
  }
};


