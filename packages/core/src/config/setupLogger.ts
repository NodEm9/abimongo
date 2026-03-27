import { consoleTransport, Logger } from '@abimongo/logger';


import {
  bufferedTransporter,
  elasticTransport,
} from '../utils/logHelpers.js';

Logger.initialize({
  formatOptions: {
    colorize: true,
    json: false,
  },
  transports: [
    {
      write: async (message) => {
        console.log(`[INFO] message received: ${message}`);
      }
    },
    consoleTransport(true),
    bufferedTransporter,
    elasticTransport,
  ],
  enrichMetadata: () => ({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    service: 'abimongo',
    version: process.env.npm_package_version || 'unknown',
    hostname: process.env.HOSTNAME || 'localhost',
  }),
  shouldLog: (level, meta) => {
    if (level === 'debug' && process.env.NODE_ENV === 'production') return false;
    if (level === 'error' && meta?.message?.includes('critical')) return false;
    return true;
  },
  hooks: {
    onLog: (entry) => {
      console.log(`[ALERT] ${entry.message}`);
      return entry;
    },
    onError: (err, context) => {
      console.error('Logging error occurred:', err, context);
      bufferedTransporter.stop();
      return false;
    },
  },
  enableMetrics: {
    enabled: process.env.ABIMONGO_LOGGER_METRICS === 'enabled' ? true : false,
    logInterval: parseInt(process.env.ABIMONGO_LOGGER_METRICS_INTERVAL || '60000', 10) || 60000,
  }
});

const logger = Logger.instance;

export { logger };



// const debugMode = process.env.DEBUG === 'true' || false;
// if (debugMode) {
//   logger.debug('Debug mode is enabled.');
//   logger.info('Debug mode is enabled. Log level set to debug.');
// }


