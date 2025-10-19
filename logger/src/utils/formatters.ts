import { colorByLevel } from '../logger/colorizer';
import { LoggerFormatOptions, LogLevel } from '../types';
import { FormatOptions } from '../types';
import { now } from './timeUtils';
// import { colorize } from '../logger';

export function formatMsg(
  level: LogLevel,
  message: string,
  meta: any[],
  options?: LoggerFormatOptions
) {
  // const timestamp =
  //   typeof options?.timestamp === 'function'
  //     ? options.timestamp()
  //     : options?.timestamp
  //       ? now()
  //       : '';
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

// export function formatLog(message: string, level: LogLevel, opts: FormatOptions = {}): string {
//   const timestamp = new Date().toISOString();

//   const levelTag = opts.colorize ? colorize(level) : level;

//   if (opts.format === 'json') {
//     return JSON.stringify({ timestamp, level, message });
//   }

//   return `[${timestamp}] [${levelTag}] ${message}`;
// }