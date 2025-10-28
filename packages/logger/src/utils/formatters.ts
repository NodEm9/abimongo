import { LoggerFormatOptions, LogLevel } from '../types';
import { now } from './timeUtils';

/** * 
 * Formats a log message based on the provided options.
 * @param level - The log level of the message.
 * @param message - The log message.
 * @param meta - Additional metadata for the log message.
 * @param options - Formatting options.
 * @returns The formatted log message as a string.
 */
export function formatMsg(
  level: LogLevel,
  message: string,
  meta: any[],
  options?: LoggerFormatOptions
) {
const timestamp = options?.timestamp ? now() : new Date().toISOString();
  const prefix = options?.prefix ?? '';
  const source = meta?.[0]?.source ?? '';
  const parts = [`[${timestamp}]`, '-', `[${level.toUpperCase()}]`, prefix, source, message].filter(Boolean);

  if (options?.json) {
    return formatJSON({
      timestamp,
      level,
      prefix,
      source,
      message,
      meta,
    });
  }

  // console.log(colorByLevel(level, parts.join(' ')));
  return parts.join(' ').trim();
}


export function formatConsole(level: string, message: string, timestamp: string): string {
  return `${timestamp} [${level.toUpperCase()}] ${message}`;
};

export function formatJSON(metadata: {}) {
  return JSON.stringify({ metadata }, null, 2);
}
export function formatError(error: Error): string {
  return `${error.name}: ${error.message}\n${error.stack}`;
}

