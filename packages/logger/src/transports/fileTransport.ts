import * as fs from 'fs';
import { now } from '../utils';
import { Transporter, LogLevel, LogEntry } from '../types';

/**
 * FileTransporter
 * A logging transporter that writes log messages to a specified file.
 * It appends log entries to the file in a formatted manner.
 * @example
 * import { createFileTransporter } from './transports/fileTransporter';
 * const fileTransporter = createFileTransporter('logs/app.log');
 *  await fileTransporter.write('This is a log message', 'info');
 */
export class FileTransporter implements Transporter {
  constructor(public stream: fs.WriteStream) { 
    this.stream = stream;
  }
  write(message: string): Promise<void> {
    const formattedLog = formatLogMsg({level: 'info', message, timestamp: now(), meta: []}); ;
    this.stream.write(formattedLog + '\n');
    return Promise.resolve();
  }
  log(level: LogLevel, message: string, meta: any[] = []): Promise<void> {
    const formattedLog = formatLogMsg({
      level,
      message,
      timestamp: now(),
      meta
    });
    this.stream.write(formattedLog + '\n');
    return Promise.resolve();
  }
}

const formatLogMsg = (entry: LogEntry) => {
  const { level, message, meta, timestamp } = entry;
  const formattedMeta = meta.length > 0 ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] - ${level.toUpperCase()}: ${message}${formattedMeta}`;
};

/**
 * Creates a file transport for logging.
 * @param filePath The path to the file where logs will be written.
 * @returns 
 */
export const createFileTransporter = (filePath: string): FileTransporter => {
  const stream = fs.createWriteStream(filePath, { flags: 'a' });
  return new FileTransporter(stream);
}
