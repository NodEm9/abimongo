import { Transporter } from "../types";
import { clearAllTimers, registerInterval } from "../utils";


type BufferedLogEntry = {
  timestamp: string;
  level: string;
  message: string;
  meta: any[];
  filename?: string;
};

/**
 *@class BufferedTransporter
 *
 * A logging transporter that buffers log messages and flushes them to an underlying transporter
 * at specified intervals or when the buffer reaches a certain size. This helps to optimize performance by reducing
 * the number of individual write operations.
 * @example
 * const fileTransporter = new FileTransporter({ filename: 'logs/app.log' });
 * const bufferedTransporter = new BufferedTransporter(fileTransporter, {
 *   flushInterval: 5000, // Flush every 5 seconds
 *  flushSize: 20,      // or when buffer reaches 20 entries
 * });
 *
 * await bufferedTransporter.write('This is a log message', 'info');
 * await bufferedTransporter.flush(); // Manually flush if needed
 * await bufferedTransporter.stop(); // Stop the transporter when done
 */
export class BufferedTransporter implements Transporter {
  private buffer: BufferedLogEntry[] = [];
  private readonly flushInterval: number;
  private readonly flushSize: number;
  private readonly transporter: Transporter;
  private timer?: NodeJS.Timeout;

  constructor(
    transporter: Transporter, options?: {
      flushInterval?: number; // in milliseconds
      flushSize?: number;     // number of entries before auto flush
    }) {
    this.transporter = transporter;
    this.flushInterval = options?.flushInterval || 5000;
    this.flushSize = options?.flushSize || 10;
    this.startAutoFlush();
  }

  public write(message: string, level?: string, meta?: any[]): Promise<void> {
    this.buffer.push({
      timestamp: new Date().toISOString(),
      message,
      level: level || 'info',
      meta: meta || [],
    });

    if (this.buffer.length >= this.flushSize) {
      this.flush();
    }
    return Promise.resolve();
  }

  public flush(): Promise<void> {
    if (this.buffer.length === 0) return Promise.resolve();
    // this.metrics.trackFlush();
    const entries = this.buffer.splice(0, this.buffer.length);
    for (const entry of entries) {
      const logLine = `${entry.timestamp} - ${entry.level.toUpperCase()}: ${entry.message} ${entry.meta}\n`;
      this.transporter.write(logLine);
    }
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined; // Clear the timer after flushing
      this.startAutoFlush(); // Restart the timer after flushing
    }
    return Promise.resolve();
  }

  private startAutoFlush() {
    // During tests we avoid starting background intervals which keep Jest running.
    // Detect Jest by the presence of JEST_WORKER_ID or NODE_ENV === 'test'.
    if (process.env.JEST_WORKER_ID !== undefined || process.env.NODE_ENV === 'test') {
      return;
    }

    this.timer = registerInterval(setInterval(
      () => this.flush().catch(console.error),
      this.flushInterval));
  }

  public async stop() {
    clearInterval(this.timer);
    this.timer = undefined;
    this.flush();
    this.transporter.close?.();
    await clearAllTimers();
  }
};


