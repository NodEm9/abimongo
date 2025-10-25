import {
	BufferedTransporter,
	createElasticTransport,
	createLokiTransport,
	createResilientTransporter,
	createRotatingFileTransporter,  
	FileTransporter,
} from '@abimongo/logger';  



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
 * @returns {BufferedTransporter} - A buffered transporter that handles log rotation and buffering.
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
})


/**
 * Creates a resilient transporter that retries failed log writes with exponential backoff.
 * This is useful for ensuring that logs are not lost due to temporary issues.
 * @param {BufferedTransporter} transporter - The buffered transporter to wrap.
 * @returns {BufferedTransporter} - A resilient buffered transporter.
 * @example
 * const resilientLogger = createResilientTransporter(rotatingTransporter);
 * 
 */
export const bufferedTransporter = new BufferedTransporter(rotatingTransporter, {
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
export const elasticTransport = createResilientTransporter(
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
export const lokiTransport = createResilientTransporter(
	createLokiTransport('http://localhost:3100/loki/api/v1/push', {
		job: 'abimongo',
		instance: 'abimongo-instance',
	})
);

