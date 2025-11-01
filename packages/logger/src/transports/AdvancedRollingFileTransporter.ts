import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { setInterval, clearInterval } from 'timers';
import { LogLevel } from '../types';
import { clearAllTimers, MetricsTracker, registerInterval } from '../utils';


const gzip = promisify(zlib.gzip);
const streamPipeline = promisify(pipeline);

interface RollingFileOptions {
  filename: string;
  maxSize?: number; // in bytes
  backupCount?: number;
  frequency?: 'daily' | 'hourly';
  compress?: boolean;
  flushInterval?: number; // in ms
}

/***
 * @class - AdvancedRollingFileTransporter
 *
 * A logging transporter that writes log messages to a file with advanced rolling features.
 * Logs can be rotated based on file size or time intervals (daily/hourly).
 * Supports compression of old log files and maintains a specified number of backup files.
 * Also includes a buffering mechanism to optimize write operations and periodic flushing.
 * @example
 * ```typescript
 * const transporter = new AdvancedRollingFileTransporter({
 *   filename: 'logs/app.log',
 *   maxSize: 10 * 1024 * 1024, // 10 MB
 *   backupCount: 7,
 *   frequency: 'daily',
 *   compress: true,
 *   flushInterval: 5000, // Flush every 5 seconds
 * });
 *
 * await transporter.write('This is a log message', 'info');
 * await transporter.flush(); // Manually flush if needed
 * await transporter.close(); // Close the transporter when done
 * ```
 */
export class AdvancedRollingFileTransporter {
  private currentStream: fs.WriteStream;
  private currentSize = 0;
  private lastRolledAt: Date;
  private flushTimer?: NodeJS.Timeout;
  private buffer: string[] = [];
  private metrics = new MetricsTracker();

  constructor(private options: RollingFileOptions) {
    this.options.maxSize = this.options.maxSize || 5 * 1024 * 1024;
    this.options.backupCount = this.options.backupCount || 5;
    this.options.frequency = this.options.frequency || 'daily';
    this.options.compress = this.options.compress ?? false;
    this.options.flushInterval = this.options.flushInterval ?? 3000;

    this.lastRolledAt = new Date();
    this.currentStream = this.createWriteStream();
    if (process.env.NODE_ENV !== 'test') {
      if(this.metrics.isTrackingMetrics()) {
        this.metrics.start();
        this.startFlusher();
      } else {
        this.metrics.stop();
      }
    }
  }

  private createWriteStream(): fs.WriteStream {
    const base = this.options.filename;
    const logDir = path.dirname(base);
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

    return fs.createWriteStream(base, { flags: 'a' });
  }

  private getTimestampSuffix(): string {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');

    const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const time = `${pad(now.getHours())}-${pad(now.getMinutes())}`;

    return this.options.frequency === 'daily' ? date : `${date}_${time}`;
  }

  private async rotateIfNeeded(): Promise<void> {
    const filePath = this.options.filename;
    const stat = fs.existsSync(filePath) ? fs.statSync(filePath) : null;
    const now = new Date();

    const shouldRotateBySize = stat && stat.size >= (this.options.maxSize || 0);
    const shouldRotateByTime = this.shouldRotateByTime(now);

    if (shouldRotateBySize || shouldRotateByTime) {
      this.currentStream.end();
      const suffix = this.getTimestampSuffix();
      const rotatedFile = `${filePath}.${suffix}`;

      fs.renameSync(filePath, rotatedFile);
      if (process.env.NODE_ENV !== 'test') {
        this.metrics.trackRotation();
      }

      if (this.options.compress) {
        const compressed = `${rotatedFile}.gz`;
        await streamPipeline(
          fs.createReadStream(rotatedFile),
          zlib.createGzip(),
          fs.createWriteStream(compressed)
        );

        fs.unlinkSync(rotatedFile);
      }

      this.cleanupOldLogs();
      this.currentStream = this.createWriteStream();
      this.lastRolledAt = now;;
      this.currentSize = 0;
    }

  }

  private shouldRotateByTime(now: Date): boolean {
    const last = this.lastRolledAt;

    if (this.options.frequency === 'daily') {
      // this.metrics.trackLog()
      // this.metrics.trackRotation()
      return now.getDate() !== last.getDate();
    } else if (this.options.frequency === 'hourly') {
      // this.metrics.trackLog()
      // this.metrics.trackRotation()
      return now.getHours() !== last.getHours() || now.getDate() !== last.getDate();
    }
    return false;
  }

  private cleanupOldLogs() {
    const base = path.basename(this.options.filename);
    const dir = path.dirname(this.options.filename);
    const allFiles = fs.readdirSync(dir);

    const rotated = allFiles
      .filter(f => f.startsWith(base + '.') && (!this.options.compress || f.endsWith('.gz')))
      .sort((a, b) => fs.statSync(path.join(dir, b)).mtime.getTime() - fs.statSync(path.join(dir, a)).mtime.getTime());

    const toDelete = rotated.slice(this.options.backupCount);
    for (const file of toDelete) {
      fs.unlinkSync(path.join(dir, file));
    }
  }

  private startFlusher() {
    if (this.flushTimer) clearInterval(this.flushTimer);
    this.flushTimer = registerInterval(setInterval(() => {
      this.flush();
      this.metrics.trackFlush();
    }, this.options.flushInterval));
  }

  public async write(message: string, _level?: LogLevel): Promise<void> {
    this.buffer.push(message);
    this.currentSize += Buffer.byteLength(message);
    this.metrics.trackLog();
    this.metrics.trackRotation();

    // Check if the total size of the buffer exceeds the maxSize limit
    // This is to ensure we don't exceed the maxSize limit before flushing
    const totalSize = Buffer.byteLength(this.buffer.join(''));
    if (totalSize >= (this.options.maxSize || Infinity)) {
      console.warn('⚠️ Buffer size exceeded maxSize, flushing immediately');
      await this.flush(); // ✅ triggers flush counter
    };
  }

  public async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    const raw = this.buffer.join('');
    this.buffer = [];

    if (process.env.NODE_ENV !== 'test') {
      await this.rotateIfNeeded();
      this.metrics.trackLog();
      this.metrics.trackRotation();
    }

    if (this.options.compress) {
      try {
        const compressed = await gzip(Buffer.from(raw + '\n'));
        this.currentStream.write(compressed);
        this.currentSize += compressed.length;
        this.metrics.trackFlush();
      } catch (err: any) {
        this.metrics.trackFlush();
        console.warn('⚠️ Compression failed. Writing uncompressed:', err.message);
        this.currentStream.write(raw + '\n');
        this.currentSize += Buffer.byteLength(raw + '\n');
      }
    } else {
      this.currentStream.write(raw + '\n');
      this.currentSize += Buffer.byteLength(raw + '\n');
      this.metrics.trackFlush();
      console.log('📦 Log entry compressed');
    }


    if (this.currentStream.destroyed) {
      console.warn('⚠️ Current stream is destroyed, creating a new one');
      this.currentStream = this.createWriteStream();
    }
  }

  public ensureDirectoryExists(): void {
    const dir = path.dirname(this.options.filename);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Directory created: ${dir}`);
    }
  }

  public getLogDirectory(): string {
    return path.dirname(this.options.filename);
  }
  public async close(): Promise<void> {
    if (this.flushTimer) clearInterval(this.flushTimer);
    this.flush();
    this.currentStream.end();
    this.metrics.stop();
    await clearAllTimers();
  }
};



