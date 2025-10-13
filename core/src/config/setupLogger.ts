import { consoleTransport, Logger } from '@abimongo/logger';
import {
  bufferedTransporter,
} from '../utils';


Logger.initialize({
  formatOptions: {
    colorize: true,
    json: false,
  },
  transports: [
    {
      write: async (message) => {
        console.log(`[ABIMONGO] message received: ${message}`);
      }
    },
    consoleTransport(true),
    bufferedTransporter,
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
      // if (entry.level === 'error') {
      //   console.log(`[ALERT] ${entry.message}`);
      //   bufferedTransporter.stop();
      // }
    },
    onError: (err, context) => {
      console.error('Logging error occurred:', err, context);
      bufferedTransporter.stop();
    },
  },
  
});

const logger = Logger.instance;

export { logger };
// const debugMode = process.env.DEBUG === 'true' || false;
// if (debugMode) {
//   Logger.instance.debug('Debug mode is enabled.');
//   Logger.instance.info('Debug mode is enabled. Log level set to debug.');
// }


