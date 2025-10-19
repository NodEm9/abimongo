import * as  chalk from 'chalk';
import { LogLevel } from '../types';

/** 
 * Colorizes a log message based on its level.
 * @param level - The log level (e.g., 'info', 'debug', 'warn', 'error', 'fatal', 'trace').
 * @param message - The log message to colorize.
 * @returns A string with the colored log message.
 */
export function colorByLevel(level: LogLevel, message: string): string {
  switch (level) {
    case 'info': return chalk.blue(message);
    case 'debug': return chalk.gray(message);
    case 'warn': return chalk.yellow(message);
    case 'error': return chalk.red(message);
    case 'fatal': return chalk.redBright(message);
    case 'trace': return chalk.magenta(message);
    default: return message;
  }
};