import { Logger } from '@abimongo/logger';
import type { AbimongoConfig } from '../types/index.js';

/**
 * Initialize and return the project logger.
 * This function is defensive about the shape of the passed config so callers
 * can pass booleans or partial objects without causing runtime errors.
 */
export function setLogger(
  loggerConfig: Partial<AbimongoConfig['logger'] & AbimongoConfig['advanced']> = {}
) {
  const cfg = loggerConfig as any || {};

  // Defensive coercions: accept boolean shorthand for nested logger settings
  if (typeof cfg.logger === 'boolean') cfg.logger = { enabled: cfg.logger };
  if (!cfg.logger) cfg.logger = {};

  if (typeof cfg.compressLogFiles === 'boolean') cfg.compressLogFiles = { enabled: cfg.compressLogFiles };
  if (!cfg.compressLogFiles) cfg.compressLogFiles = { enabled: false };

  if (typeof cfg.enableMetrics === 'boolean') cfg.enableMetrics = { enabled: cfg.enableMetrics };
  if (!cfg.enableMetrics) cfg.enableMetrics = { enabled: false };

  if (typeof cfg.circuitBreaker === 'boolean') cfg.circuitBreaker = { enabled: cfg.circuitBreaker };
  if (!cfg.circuitBreaker) cfg.circuitBreaker = { enabled: false };

  if (typeof cfg.garbageCollector === 'boolean') cfg.garbageCollector = { enabled: cfg.garbageCollector };
  if (!cfg.garbageCollector) cfg.garbageCollector = { enabled: false };

  const advancedOptions = {
    enableCircuitBreaker: {
      enabled: cfg?.circuitBreaker ?? undefined,
      retryAttempts: cfg?.circuitBreaker?.retryAttempts ?? 3,
    },
    garbageCollector: cfg?.garbageCollector?.enabled
      ? { enabled: true, retentionDays: 30, logResults: true }
      : { enabled: Boolean(cfg?.garbageCollector?.enabled) },
    gcCron: cfg?.gcCron || '0 0 * * *',
  };

  const compressLogs = {
    compressLogFiles: { enabled: cfg?.compressLogFiles?.enabled ?? false },
  };

  return Logger.initialize({
    ...cfg,
    ...advancedOptions,
    ...compressLogs,
  });
}
