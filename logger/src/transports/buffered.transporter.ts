import { Transporter } from "../types";
import { clearAllTimers, registerInterval } from "../utils";
import { MetricsTracker } from "../utils/MetricsTracker";

type BufferedLogEntry = {
  timestamp: string;
  level: string;
  message: string;
  meta: any[];
};


export class BufferedTransporter implements Transporter {
  private buffer: BufferedLogEntry[] = [];
  private readonly flushInterval: number;
  private readonly flushSize: number;
  private readonly transporter: Transporter;
  private timer?: NodeJS.Timeout;
  // private metrics = new MetricsTracker();

  constructor(
    transporter: Transporter, options?: {
      flushInterval?: number; // in milliseconds
      flushSize?: number;     // number of entries before auto flush
    }) {
    this.transporter = transporter;
    this.flushInterval = options?.flushInterval || 5000;
    this.flushSize = options?.flushSize || 10;
    if (process.env.NODE_ENV !== 'test') {
      // this.metrics.start(this.flushInterval);
      this.startAutoFlush();
    }
  }

  public write(message: string, level?: string, meta?: any[]): Promise<void> {
    this.buffer.push({
      timestamp: new Date().toISOString(),
      message,
      level: level || 'info',
      meta: meta || [],
    });
    // this.metrics.trackLog();
    // this.metrics.trackRotation();

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
    this.timer = registerInterval(setInterval(
      () => this.flush().catch(console.error),
      this.flushInterval));
    // this.metrics.trackFlush();
  }

  public async stop() {
    // clearInterval(this.timer);
    this.timer = undefined;
    this.flush();
    this.transporter.close?.();
    await clearAllTimers();
  }
}
