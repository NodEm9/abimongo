/**
 * @packageDocumentation - The main entry point for the Logger package. 
 * Defines and exports the core Logger functionality, transports, and utilities.
 * @module Logger
 */
import { createLogger } from './logger';
import { AbimongoConfig } from './types';


declare global {
	interface Window {
		logger: typeof createLogger;
	}
};

if (typeof window !== 'undefined') {
	window.logger = createLogger;
	window.Buffer = Buffer;
};


export * from './logger';
export * from './transports';
export * from './types';
export * from './utils';
export { logger } from './logger/logger';
export { Logger, setupLogger } from './logger/setupLogger';
export { BufferedTransporter } from './transports/buffered.transporter';
export { consoleTransport } from './transports/consoleTransport';
export { AsyncBatchTransporter } from './transports/async-batch.transporter';
export {AdvancedRollingFileTransporter} from './transports/AdvancedRollingFileTransporter';
export { FileTransporter } from './transports/fileTransport';
export { createRotatingFileTransporter } from './transports/rotating.transporter';
export type { LoggerConfig } from './types/abimongoConfig';
export { createCircuitBreaker } from './utils/circuitBreaker/circuitBreaker';
export { retryWithBackoff } from './utils/retry/retryWithBackoff';
export { MetricsTracker as loggerMetricsTracker } from './utils/MetricsTracker';
export {
	createElasticTransport,
	createLokiTransport,
	createHttpTransport,
	createResilientTransporter
} from './transports/remote.transport';
export { clearAllTimers as shutdownLogger } from './utils/TimerRegistry';