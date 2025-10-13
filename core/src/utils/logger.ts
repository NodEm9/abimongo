import { Logger } from "@abimongo/logger";
import { AbimongoConfig } from "../types";

/**
 * Initializes the logger with the provided configuration.
 * If no configuration is provided, it uses default settings.
 *
 * @param loggerConfig - Configuration for the logger.
 * @param advancedConfig - Advanced configuration options for the logger.
 */
export function setLogger(
  loggerConfig: AbimongoConfig['logger'] & AbimongoConfig['advanced'] = {},
  // advancedConfig: AbimongoConfig['advanced'] = {}
) {
  const advancedOptions = {
    enableCircuitBreaker: {
      enabled:
        loggerConfig?.circuitBreaker?.enabled ??
        loggerConfig?.circuitBreaker ??
        false,
      retryAttempts:
        loggerConfig?.circuitBreaker?.retryAttempts ??
        // loggerConfig?.circuitBreaker?.retryAttempts ??
        3,
    },
    garbageCollector: loggerConfig?.garbageCollector ?? {
      enabled: true,
      retentionDays: 30, // Retain data for 30 days
      logResults: true, // Log results of garbage collection
    },
    gcCron: "0 0 * * *", // Default to daily at midnight
  };

 return Logger.initialize({
    ...loggerConfig || {},
    ...advancedOptions,
  });
}
