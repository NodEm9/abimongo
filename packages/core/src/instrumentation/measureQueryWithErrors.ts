import { performance } from 'perf_hooks';
import { AbimongoContext } from '../context/AbimongoContext';

export interface QueryInstrumentationMeta {
	operation: string;
	collectionName?: string;
	filter?: unknown;
	update?: unknown;
	pipeline?: unknown;
	documentCount?: number;
	extra?: Record<string, any>;
}

export async function measureQuery<T>(
	meta: QueryInstrumentationMeta,
	executor: () => Promise<T>
): Promise<T> {
	const start = performance.now();

	try {
		const result = await executor();

		const durationMs = Number((performance.now() - start).toFixed(2));
		const logger = AbimongoContext.getLogger();
		const loggerMeta = AbimongoContext.getLoggerMeta() ?? {};

		const payload = {
			operation: meta.operation,
			collectionName:
				meta.collectionName ?? AbimongoContext.getCollectionName(),
			durationMs,
			success: true,
			tenantId: AbimongoContext.getTenantId(),
			requestId: AbimongoContext.getRequestId(),
			dbName: AbimongoContext.getDbName(),
			filter: meta.filter,
			update: meta.update,
			pipeline: meta.pipeline,
			documentCount: meta.documentCount,
			...loggerMeta,
			...(meta.extra ?? {})
		};

		const observer = AbimongoContext.getObserver();
		await observer?.onQuery?.(payload);
		await observer?.onQueryError?.(payload);
		
		if (logger?.info) {
			logger.info('[Abimongo Query]', payload);
		} else if (AbimongoContext.isDebug()) {
			console.log('[Abimongo Query]', payload);
		}

		return result;
	} catch (error: any) {
		const durationMs = Number((performance.now() - start).toFixed(2));
		const logger = AbimongoContext.getLogger();
		const loggerMeta = AbimongoContext.getLoggerMeta() ?? {};

		const payload = {
			operation: meta.operation,
			collectionName:
				meta.collectionName ?? AbimongoContext.getCollectionName(),
			durationMs,
			success: false,
			tenantId: AbimongoContext.getTenantId(),
			requestId: AbimongoContext.getRequestId(),
			dbName: AbimongoContext.getDbName(),
			filter: meta.filter,
			update: meta.update,
			pipeline: meta.pipeline,
			errorMessage: error?.message,
			errorName: error?.name,
			...loggerMeta,
			...(meta.extra ?? {})
		};

		if (logger?.error) {
			logger.error('[Abimongo Query Error]', payload);
		} else if (AbimongoContext.isDebug()) {
			console.error('[Abimongo Query Error]', payload);
		}

		throw error;
	}
}