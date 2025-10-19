import { createLogger } from './logger';


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
export { clearAllTimers as shutdownLogger } from './utils/TimerRegistry';