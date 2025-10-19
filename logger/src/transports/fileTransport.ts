// src/transporters/FileTransporter.ts
import * as fs from 'fs';
import { now } from '../utils';
import { Transporter, LogLevel, LogEntry } from '../types';

export class FileTransporter implements Transporter {
  constructor(public stream: fs.WriteStream) { }
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
