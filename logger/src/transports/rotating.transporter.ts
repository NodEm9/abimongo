import { AdvancedRollingFileTransporter } from './AdvancedRollingFileTransporter';
import path from 'path';
import { clearAllTimers, MetricsTracker, registerInterval } from '../utils';

export interface RotatingFileTransporterOptions {
  filename: string;
  maxSize?: number; // in bytes
  backupCount?: number;
  frequency?: 'daily' | 'hourly';
  compress?: boolean;
  flushInterval?: number; // in ms
}


// Initialize metrics tracker
// const metrics = new MetricsTracker();

/**
 * Creates a rotating file transporter for logging.
 * 
 * @param {RotatingFileTransporterOptions} options - Configuration options for the rotating file transporter.
 * @returns {Function} A function that writes log messages to the rotating file.
 */
export function createRotatingFileTransporter(options?: RotatingFileTransporterOptions) {
  const rollingTransport = new AdvancedRollingFileTransporter({
    filename: options?.filename ?? path.join(__dirname, '../logs/abimongo.log'),
    frequency: options?.frequency ?? 'hourly',
    maxSize: options?.maxSize ?? 5 * 1024 * 1024, // 5 MB
    backupCount: options?.backupCount ?? 10,
    compress: options?.compress ? true : false,
    flushInterval: options?.flushInterval ?? 3000, // 3 seconds
  });

  let flushInterval: NodeJS.Timeout;

  // Set up the rotation frequency
  if (options?.frequency === 'daily') {
    console.log('🗓️ Daily rotation enabled');

    // Track metrics for daily rotation
    // metrics.trackLog()
    // metrics.trackRotation();

    // Flush the buffer at the specified interval
    flushInterval = registerInterval(setInterval(() => {
      rollingTransport.flush();
      // metrics.trackFlush();
    }, options?.flushInterval || 60_000)); // Default to 1 minute if no interval is provided
  
  };

  if (options?.frequency === 'hourly') {
    console.log('🕒 Hourly rotation enabled');
    // metrics.trackLog()
    // metrics.trackRotation();

    // Flush the buffer at the specified interval
    flushInterval = registerInterval(setInterval(() => {
      rollingTransport.flush();
      // metrics.trackFlush();
    }, options?.flushInterval || 60_000)); // Default to 1 minute if no interval is provided

  }

  console.log(`📂 Log files will be located at: ${rollingTransport.getLogDirectory()} directory`);
  console.log(`Created log file at: ${options?.filename}`);

  // Clear the interval on process exit
  process.on('exit', async () => {
    clearInterval(flushInterval);
    rollingTransport.close();
    // metrics.stop();
    console.log('🛑 Stopped rotating file transporter and cleared interval');
    await clearAllTimers();
  });

  return {
    write: async (message: string) => {
      const logEntry = `[${new Date().toISOString()}] - ${message}\n`;
      try {
        // metrics.trackLog()
        // metrics.trackRotation();
        // metrics.trackFlush();
        await rollingTransport.write(logEntry);
      } catch (err) {
        console.error('Error writing log entry:', err);
        throw err;
      }
    }
  }
};