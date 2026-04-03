import {
	createElasticTransport,
	BufferedTransporter,
	createLokiTransport,
	createResilientTransporter,
	createRotatingFileTransporter,
} from '@abimongo/logger';

// import * as loggerPkg from '@abimongo/logger';

// const rotatingTransporter =
//   (loggerPkg as any).rotatingTransporter ??
//   (loggerPkg as any).default?.rotatingTransporter;

// const BufferedTransporterCtor =
//   (loggerPkg as any).BufferedTransporter ??
//   (loggerPkg as any).default?.BufferedTransporter;

// if (!BufferedTransporterCtor) {
//   throw new Error('BufferedTransporter export not found in @abimongo/logger');
// }

// export const bufferedTransporter = new BufferedTransporterCtor(rotatingTransporter, {
//   flushInterval: 5000,
//   flushSize: 10,
// });  


/**
 * @module logHelpers
 * This module provides utilities for setting up and managing log transports in the Abimongo application.
 * It includes a rotating file transporter, a buffered transporter, and resilient transporters for Elasticsearch and Loki.
 * It also includes a function to shutdown the logger gracefully.
 */


/**
 * Creates a rotating file transporter for logging.
 * The logs will be stored in the 'logs' directory with a daily rotation.
 * The maximum size of each log file is set to 10 MB, and up to 5 backups will be kept.
 * @example
 * const logger = createLogger({
 * 	transports: [rotatingTransporter],
 * });
 * 
 */
const rotatingTransporter = createRotatingFileTransporter({
	filename: 'logs/abimongo.log',
	frequency: 'daily',
	maxSize: 1024 * 1024 * 10, // 10 MB 
	backupCount: 5,
	compress: true,
	flushInterval: 3000, // 3 seconds
})


/**
 * Creates a resilient transporter that retries failed log writes with exponential backoff.
 * This is useful for ensuring that logs are not lost due to temporary issues.
 * @returns {BufferedTransporter} - A resilient buffered transporter.
 * @example
 * const resilientLogger = createResilientTransporter(rotatingTransporter);
 * 
 */
 const bufferedTransporter = new BufferedTransporter(rotatingTransporter, {
	flushInterval: 5000,
	flushSize: 10,
});

/**
 * Create a resilient transporter for elasticsearch logs.
 * This transporter will retry failed log writes with exponential backoff.
 * @param {string} elasticUrl - The URL of the Elasticsearch instance.
 * @param {string} indexName - The name of the Elasticsearch index to write logs to.
 * @example
 * const elasticTransport = createElasticTransport('http://localhost:9200', 'abimongo-logs');
 * 
 */
const elasticTransport = createResilientTransporter(
	createElasticTransport('http://localhost:9200', 'logs/abimongo-logs.log')
);

/**
 * Create a resilient transporter for Loki logs.
 * This transporter will retry failed log writes with exponential backoff.
 * @param {string} lokiUrl - The URL of the Loki instance.
 * @param {object} options - Options for the Loki transport.
 * @example
 * const lokiTransport = createLokiTransport('http://localhost:3100/loki/api/v1/push', {
 * 	job: 'abimongo',
 * 	instance: 'abimongo-instance',
 * });
 */
 const lokiTransport = createResilientTransporter(
	createLokiTransport('http://localhost:3100/loki/api/v1/push', {
		job: 'abimongo',
		// instance: 'abimongo-instance',
	})
);

export {
	rotatingTransporter,
	bufferedTransporter,
	elasticTransport,
	lokiTransport,
};