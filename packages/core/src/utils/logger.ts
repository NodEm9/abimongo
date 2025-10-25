import { Logger } from "@abimongo/logger";
import { AbimongoConfig } from "../types";

/**
 * Initializes the logger with the provided configuration.
 * If no configuration is provided, it uses default settings.
 *
 * @param loggerConfig - Configuration for the logger.
 */
export function setLogger(
  loggerConfig: AbimongoConfig['logger'] & AbimongoConfig['advanced'] = {},
) {
  const advancedOptions = {
    enableCircuitBreaker: {
      enabled:
        // loggerConfig?.circuitBreaker?.enabled ??
        loggerConfig?.circuitBreaker ??
        undefined,
      retryAttempts:
        loggerConfig?.circuitBreaker?.retryAttempts ??
        3,
    },
    garbageCollector: loggerConfig?.garbageCollector?.enabled ? {
      enabled: true,
      retentionDays: 30, // Retain data for 30 days
      logResults: true, // Log results of garbage collection
    } : { enabled: false },
    gcCron: "0 0 * * *", // Default to daily at midnight
  };
  const compressLogs = {
    compressLogFiles: {
      enabled: loggerConfig?.compressLogFiles?.enabled ? true : false,
    },
  };

 return Logger.initialize({
    ...loggerConfig || {},
   ...advancedOptions,
    ...compressLogs,
  });
}
