import { createLogger } from './logger';
import { MetricsTracker } from './utils';
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
const metricsTracker = new MetricsTracker();
let tracker: boolean = false;

(function () {
	if(process.env.ABIMONGO_LOGGER_METRICS === 'enabled' && !tracker) {
		metricsTracker.start();
		tracker = true;
	} else {
		metricsTracker.stop();
		tracker = false;
	}
})()


export * from './logger';
export * from './transports';
export * from './types';
export * from './utils';
export { logger } from './logger/logger';
export { clearAllTimers as shutdownLogger } from './utils/TimerRegistry';