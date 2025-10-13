import { LoggerConfig } from "@abimongo/abimongo-logger";
import { AbimongoLoggerSettings } from "../types";


/**
 * Normalizes the logger configuration for Abimongo.
 * This function ensures that the logger settings are in a consistent format
 * and provides default values where necessary.
 *
 * @param {AbimongoLoggerSettings} [logger={}] - The logger settings to normalize.
 * @returns {LoggerConfig} The normalized logger configuration.
 */
export function normalizeLoggerConfig(logger: AbimongoLoggerSettings = {}): LoggerConfig {
  return {
    level: logger.logLevel || logger.logLevel || 'info',
    colorize: logger.useColor ? logger.colorize : true,
    json: logger.json ?? false,
    transports: logger.transports,
    excludedSources: logger.excludedSources,
    formatOptions: logger.formatOptions,
    hooks: logger.hooks,
  };
}
