import path from 'path';
import {
  BufferedTransporter,
  AdvancedRollingFileTransporter
} from '../transports';
import { MetricsTracker, clearAllTimers, formatMsg } from '../utils';
import { LogLevel } from '../types';
import { colorByLevel } from './colorizer';


interface LoggerOptions {
  format?: 'json' | 'text';
  baseLogPath?: string;
  streamToRedis?: boolean;
  redisUrl?: string;
  flushInterval?: number;
  flushSize?: number;
  colorize?: boolean;
}

interface LogMeta {
  tenantId?: string;
}

/**
 * AbimongoLogger is a custom logger that supports multiple tenants,
 * file-based logging with daily rotation, and metrics tracking.
 * It can log messages in both JSON and text formats.
 *  * @example
 * const logger = new AbimongoLogger({
 *  format: 'json', // or 'text'
 * baseLogPath: '/var/logs/abimongo',
 * streamToRedis: true,
 * redisUrl: 'redis://localhost:6379',
 *  flushInterval: 2000, // flush logs every 2 seconds
 *  flushSize: 20, // flush after 20 log entries
 * });
 * * logger.log('This is a log message', 'info', { tenantId: 'tenant1' });
 * * logger.log('This is an error message', 'error', { tenantId: 'tenant2' });
 */
class AbimongoLogger {
  private transports: Map<string, BufferedTransporter> = new Map();
  private metrics = new MetricsTracker();

  constructor(private options: LoggerOptions = {}) {
    this.options.baseLogPath ||= path.join(__dirname, '../logs');
    this.options.format ||= 'text';
    this.options.colorize = this.options.colorize ?? true;

    // if (process.env.NODE_ENV !== 'test') {
    //   this.startTrackingMetrics()
    // }
  }
  /**
   * Logs a message with the specified level and metadata.
   * @param message The message to log.
   * @param level The log level (default: 'info').
   * @param meta Additional metadata for the log entry.
   */
  async log(message: string, level: LogLevel = 'info', meta: LogMeta = {}) {
    const tenantId = meta.tenantId || 'default';
    const filename = path.join(this.options.baseLogPath!, `${tenantId}.log`);
    const formatted = formatMsg(level, message, [this.options.format]);

    let transport = this.transports.get(tenantId);

    if (!transport) {
      const fileTransport = new AdvancedRollingFileTransporter({
        filename,
        frequency: 'daily',
        maxSize: 5 * 1024 * 1024,
        backupCount: 5,
        compress: true,
        flushInterval: this.options.flushInterval,
      });

      const buffered = new BufferedTransporter(fileTransport, {
        flushInterval: this.options.flushInterval || 3000,
        flushSize: this.options.flushSize || 10,
      });

      this.transports.set(tenantId, buffered);
      transport = buffered;

      console.log(`Created new transport for tenant: [${tenantId}] at ${filename}`);
    }

    const coloredMessage = this.options.colorize
      ? formatMsg(level, message, [this.options.format])
      : colorByLevel(level, formatted);

    // Write the log message to the transport
    await transport.write(coloredMessage, level);
    // this.metrics.trackLog();
    // this.metrics.trackRotation();

    const colorConsle = colorByLevel(level, `[${new Date().toISOString()}] [${level}] [${tenantId}] ${formatted}`);
    console.log(colorConsle);

    process.exitCode = 0; // Reset exit code to 0 on successful log

    // if (level === 'fatal') {
    //   console.error(`Fatal error logged: ${message}`);
    //   if (process.env.NODE_ENV !== 'test') {
    //     await this.flushAll();
    //     process.exit(1);
    //   }
    // }
  }

  async flushAll() {
    // if (process.env.NODE_ENV !== 'test') {
      for (const t of this.transports.values()) {
        await t.flush?.();
        // this.metrics.trackFlush();
      // }
    }
  }

  // public startTrackingMetrics(interval: number = 60000) {
  //   this.metrics.start(interval);
  //   console.log(`Metrics tracking started with interval: ${interval}ms`);
  //   return this.metrics;
  // }

  async close() {
    await this.flushAll();
    for (const t of this.transports.values()) t.stop?.();
    // this.metrics.stop();
    await clearAllTimers();
    console.log('Metrics tracking stopped on exit');
    console.log('Logger stopped all transports and flushed all logs.');
  }

  public async shutdown(): Promise<void> {
    await this.flushAll();
    for (const t of this.transports.values()) t.stop?.();
    // this.metrics.stop();
    await clearAllTimers();
    console.log('Logger shutdown complete. All transports flushed and stopped.');
  }

  getMetrics() {
    return this.metrics;
  }
}

export const logger = new AbimongoLogger({
  format: 'json', // or 'text'
  streamToRedis: true,
  flushInterval: 2000,
  flushSize: 20,
});

if (process.env.NODE_ENV === 'production') {
  process.on('SIGINT', async () => {
    console.log('Received SIGINT. Shutting down logger...');
    await logger.shutdown();
    await clearAllTimers();
    console.log('Logger shutdown complete.');
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('Received SIGTERM. Shutting down logger...');
    await logger.shutdown();
    await clearAllTimers();
    console.log('Logger shutdown complete.');
    process.exit(0);
  });
}

if (process.env.NODE_ENV === 'development') {
  process.on('SIGINT', async () => {
    console.log('Received SIGINT. Flushing logs...');
    await logger.flushAll();
    await clearAllTimers();
    console.log('Logs flushed successfully.');
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('Received SIGTERM. Flushing logs...');
    await logger.flushAll();
    await clearAllTimers();
    console.log('Logs flushed successfully.');
    process.exit(0);
  });
}

process.on('uncaughtException', async (err) => {
  console.error('Uncaught Exception:', err);
  await logger.log(`Uncaught Exception: ${err.message}`, 'error', { tenantId: 'default' });
  await logger.flushAll();
  await clearAllTimers();
  console.error('Logger flushed after uncaught exception.');
  process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // await console.log(`Unhandled Rejection: ${reason}`, 'error', { tenantId: 'default' });
  await logger.flushAll();
  await clearAllTimers();
  console.error('Logger flushed after unhandled rejection.');
  process.exit(1);
});

process.on('exit', async (code) => {
  console.log(`Process exiting with code: ${code}`);
  await logger.flushAll();
  await logger.close();
  await clearAllTimers();
  console.log('Logger closed and all transports stopped.');
});

