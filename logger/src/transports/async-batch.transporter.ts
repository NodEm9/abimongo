import { clearAllTimers, now, registerInterval } from '../utils';
import {
  LogEntry,
  AsyncBatchTransporterOptions,
  LogLevel
} from '../types';


// This class is used to send log entries in batches asynchronously.
// It buffers log entries and sends them in batches to a specified endpoint.
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
}
