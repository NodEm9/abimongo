import { AbimongoContext } from '../context/AbimongoContext.js';

export function debugLog(
  message: string,
  meta: Record<string, any> = {}
): void {
  if (!AbimongoContext.isDebug()) return;

  const logger = AbimongoContext.getLogger();
  const loggerMeta = AbimongoContext.getLoggerMeta() ?? {};

  const payload = {
    tenantId: AbimongoContext.getTenantId(),
    requestId: AbimongoContext.getRequestId(),
    dbName: AbimongoContext.getDbName(),
    collectionName: AbimongoContext.getCollectionName(),
    ...loggerMeta,
    ...meta
  };

  if (logger?.debug) {
    logger.debug(message, payload);
    return;
  }

  console.debug(`[ABIMONGO_DEBUG] ${message}`, payload);
}