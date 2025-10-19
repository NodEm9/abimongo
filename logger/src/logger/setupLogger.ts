import { ILogger, LoggerConfig } from '../types';
import { createLogger } from './loggerFactory';

/**
 * 
 * @param config Logger configuration object.
 * @param config.logger Optional logger instance to use.
 * @returns 
 */
export function setupLogger(
  config: LoggerConfig,
): ILogger {
  if (config.logger) return config.logger;
  if (config?.circuitBreaker?.enabled) {
    console.warn('Circuit breaker is enabled, consider configuring logger accordingly.');
  }
  return createLogger({ ...config });
}


/**
 * Logger class that provides a singleton instance of the logger.
 * It can be initialized with a configuration object.
 * Usage:
 * ```typescript
 * import { Logger } from 'abimongo-logger';
 * Logger.initialize(YourLoggerConfig);
 */
export class Logger {
  // private static logger: ILogger;
  static instance: ILogger;

  constructor() {
    // Prevent direct instantiation
    if (Logger.instance) {
      throw new Error('Use Logger.initialize(config) to get the logger instance.');
    }
  }

  // Additional methods can be added as needed
  static initialize(config: LoggerConfig) {
    if (process.env.NODE_ENV !== 'test') {
      this.instance = setupLogger({ ...config });
    }
    return this.instance 
  }
};

