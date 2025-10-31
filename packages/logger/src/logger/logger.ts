import path from 'path';
import {
  BufferedTransporter,
  AdvancedRollingFileTransporter,
  createRotatingFileTransporter
} from '../transports';
import { MetricsTracker, clearAllTimers, formatMsg } from '../utils';
import { LoggerConfig, LogLevel } from '../types';
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
  [key: string]: any;
}

/**
 * AbimongoLogger is a custom logger that supports multiple tenants,
 * file-based logging with daily rotation, and metrics tracking.
 * It can log messages in both JSON and text formats.
 * @example
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
export class AbimongoLogger {
  private transports: Map<string, BufferedTransporter> = new Map();
  private metrics = new MetricsTracker();
  private config!: LoggerConfig

  constructor(private options: LoggerOptions = {}) {
    this.options.baseLogPath ||= path.join(__dirname, '../logs');
    this.options.format ||= 'text';
    this.options.colorize = this.options.colorize ?? true;

    if (process.env.NODE_ENV !== 'test') {
      if (!this.metrics.isTrackingMetrics()) {
        this.stopTrackingMetrics();
        console.log('Metrics tracking was active. Stopping it on initialization.');
      } else if (this.metrics.isTrackingMetrics()) {
        this.startTrackingMetrics();
        console.log('Metrics tracking was inactive. Starting it on initialization.');
      } else { return; }
    }
  }
  /**
   * Logs a message with the specified level and metadata.
   * @param message The message to log.
   * @param level The log level (default: 'info').
   * @param meta Additional metadata for the log entry.
   */
  async log(message: string, level: LogLevel = 'info', meta: LogMeta = {}) {
    const tenantId = meta.tenantId || 'default';
    const appLog = process.env.ABIMONGO_APP_LOG || 'abimongo_app';
    const filename = path.join(__dirname, '../logs/abimongo.log');
    const pubFilename = path.join('', `${appLog}.log`);
    const formatted = formatMsg(level, message, [this.options.format]);

    let transport = this.transports.get(tenantId);

    if (!transport) {
      // const fileTransport = new AdvancedRollingFileTransporter({
      //   filename: filename || pubFilename,
      //   frequency: 'daily',
      //   maxSize: 5 * 1024 * 1024,
      //   backupCount: 5,
      //   compress: false || true,
      //   flushInterval: this.options.flushInterval,
      // });

      const rotatingTransporter = createRotatingFileTransporter({
        filename: filename || pubFilename,
        frequency: 'daily',
        maxSize: 5 * 1024 * 1024, // 10 MB 
        backupCount: 5,
        compress: true || false,
        flushInterval: this.options.flushInterval
      })



      const buffered = new BufferedTransporter(rotatingTransporter, {
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
    await transport.write(coloredMessage, level, [meta]).then(() => {
      this.metrics.trackLog();
    });

    const colorConsole = colorByLevel(level, `[${level}] ${formatted}`);
    console.log(colorConsole);

    process.exitCode = 0; // Reset exit code to 0 on successful log
  }

  async flushAll() {
    for (const t of this.transports.values()) {
      await t.flush?.();
    }
  }

  public startTrackingMetrics(interval: number = 60000) {
    this.metrics.start(interval);
    console.log(`Metrics tracking started with interval: ${interval}ms`);
    return this.metrics;
  }
  public stopTrackingMetrics() {
    this.metrics.stop();
    console.log('Metrics tracking stopped.');
  }

  async close() {
    await this.flushAll();
    for (const t of this.transports.values()) t.stop?.();
    this.metrics.stop();
    await clearAllTimers();
    console.log('Metrics tracking stopped on exit');
    console.log('Logger stopped all transports and flushed all logs.');
  }

  public async shutdown(): Promise<void> {
    await this.flushAll();
    for (const t of this.transports.values()) t.stop?.();
    this.metrics.stop();
    await clearAllTimers();
    console.log('Logger shutdown complete. All transports flushed and stopped.');
  }

  getMetrics() {
    return this.metrics;
  }
}

/**
 * @instance - logger
 * Singleton instance of AbimongoLogger for application-wide use. 
 * Configured to log in JSON format, stream to Redis, and flush logs every 2 seconds or after 20 entries. 
 * Adjust the configuration as needed for your application.
 * @example
 * import { logger } from './logger';
 * logger.log('This is an info message', 'info', { tenantId: 'tenant1' });
 * logger.log('This is an error message', 'error', { tenantId: 'tenant2' });
 */
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

