/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
// Require built artifacts directly from local packages (no need for npm install)
const loggerPkg = require('../../packages/logger/dist/abimongo-logger.js');
const corePkg = require('../../packages/core/dist/abimongo-core.js');

// Exports may live on different keys depending on build; prefer named exports
const setupLogger = loggerPkg.setupLogger || loggerPkg.createLogger || loggerPkg.logger || loggerPkg.default;
const AbimongoClient = corePkg.AbimongoClient || corePkg.AbiMongoClient || corePkg.default || corePkg.Abimongo || corePkg.AbimongoClient;

// Simple console transport
const logger = (typeof setupLogger === 'function')
  ? setupLogger({
      level: 'info',
			formatOptions: { colorize: true },
      transporters: [
        {
          write: (msg) => {
            console.log('[abimongo-logger]', msg);
          }
        }
      ]
    })
  : (loggerPkg.logger || loggerPkg);

if (logger && typeof logger.info === 'function') {
  logger.info('Example app started', { source: 'example' });
} else {
  console.log('Logger not available as expected, falling back to console');
}

// Create a client instance (attempt; may be a no-op in this environment)
let client = null;
if (AbimongoClient) {
  try {
    client = new AbimongoClient({ uri: process.env.MONGO_URI || 'mongodb://localhost:27017/abimongo-demo' });
    console.log('Created AbimongoClient:', client && client.constructor ? client.constructor.name : typeof client);
  } catch (err) {
    console.warn('Could not construct AbimongoClient locally:', err && err.message);
  }
} else {
  console.log('AbimongoClient constructor not found in local build exports.');
}

// If MONGO_URI is set, try connecting (safe-guarded)
if (process.env.MONGO_URI && client && typeof client.connect === 'function') {
  (async () => {
    try {
      await client.connect();
      logger && logger.info && logger.info('Connected to MongoDB via AbimongoClient', { source: 'example' });
      await client.close();
      logger && logger.info && logger.info('Closed AbimongoClient', { source: 'example' });
    } catch (err) {
      logger && logger.error && logger.error('Failed to connect using AbimongoClient', { source: 'example', error: err });
    }
  })();
} else {
  logger && logger.info && logger.info('MONGO_URI not set or client not connectable; skipping connect', { source: 'example' });
}
