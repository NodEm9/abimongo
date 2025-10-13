// import {
// 	setupLogger,
// 	AsyncBatchTransporter,
// 	FileTransporter,
// 	consoleTransport,
// 	createElasticTransport, 
// 	createLokiTransport,
// 	createResilientTransporter,
// 	createRotatingFileTransporter,
// 	BufferedTransporter
// } from '@abimongo/abimongo-logger';
// // import { setupLogger } from '../../../abimongo_utils/src/logger/setupLogger';
// // import { createLogger } from '../../../abimongo_utils/src/logger/loggerFactory';
// // import {
// // 	createElasticTransport,
// // 	createResilientTransporter,
// // 	createLokiTransport,
// // 	createHttpTransport,
// // } from '../../../abimongo_utils/src/transports/remote.transport';
// // import { createRotatingFileTransporter } from '../../../abimongo_utils/src/transports/rotating.transporter';
// // import { AsyncBatchTransporter } from '../../../abimongo_utils/src/transports/async-batch.transporter';
// // import { BufferedTransporter } from '../../../abimongo_utils/src/transports/buffered.transporter'
// // import { consoleTransport } from '../../../abimongo_utils/src/transports/consoleTransport';
// // import { createFileTransporter } from '../../../abimongo_utils/src/transports/fileTransport';
// import axios from 'axios';
// import { dbConfig } from '../dbConfig';



// // async function mockSendToRemote(entries: any[]) {
// // 	console.log(`Sending ${entries.length} logs to remote...`);
// // 	for (const entry of entries) {
// // 		console.log(`Sending log: ${JSON.stringify(entry)}`);
// // 	}
// // 	// simulate delay
// // 	await new Promise((resolve) => setTimeout(resolve, 100));
// // 	console.log('Logs sent to remote successfully!');
// // }

// // const asyncBatch = new AsyncBatchTransporter({
// // 	tag: 'abimongo-logs',
// // 	batchSize: 5,
// // 	flushInterval: 300,
// // 	sendBatch: async (entries) => {
// // 		try {
// // 			await mockSendToRemote(entries);
// // 			console.log(`Batch of ${entries.length} logs sent successfully.`);
// // 		} catch (error) {
// // 			console.error('Error sending log batch:', error);
// // 			throw error; // Re-throw to allow retry logic in the buffered transporter
// // 		}
// // 	}
// // });

// // const transporter = createFileTransporter('logs/abimongo.log');

// // const createRotatingFileTransporter = (options: any) => {
// // 	return createFileTransporter({
// // 		filename: options.filename,
// // 		frequency: options.frequency,
// // 		maxSize: options.maxSize,
// // 		backups: options.backups,
// // 	});
// // };

// const rotatingTransporter = createRotatingFileTransporter({
// 	filename: 'logs/abimongo.log',
// 	frequency: 'daily',
// 	maxSize: 1024 * 1024 * 10, // 10 MB
// 	backups: 5,
// })

// const bufferedTransporter = new BufferedTransporter(rotatingTransporter, {
// 	flushInterval: 200,
// 	flushSize: 5,
// });

// // // type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'trace';
// // // const logLevels: LogLevel[] = ['debug', 'info', 'warn', 'error', 'fatal', 'trace'];

// // // const infoLog = (msg: string) => {
// // //   const level = logLevels.find(level => msg.toLowerCase().includes(level));
// // //   return level ? level : 'info';
// // // }
// // export type LogEntry = {
// // 	timestamp: string;
// // 	level: string;
// // 	message: string;
// // 	meta?: Record<string, any>;
// // };

// // // export const logIt = new FileTransporter(
// // //   fs.createWriteStream('./logs/abimongo-util.log', { flags: 'a' }),
// // // )
// // // logIt.log('info', 'This is a test log message', ['testMeta1', 'testMeta2']);


// // const elasticTransport = createResilientTransporter(
// // 	createElasticTransport('http://localhost:9200', 'abimongo-logs')
// // );

// export const logger = setupLogger({
// 	level: 'error',
// 	colorize: true,
// 	formatOptions: {
// 		timestamp: true,
// 		colorize: true,
// 		// source: 'abimongo',
// 		json: false,
// 		// prefix: '[ABIMONGO]',
// 	},
// 	transports: [
// 		{
// 			write: (entry) => {
// 				console.log(entry);
// 			}
// 		},
// 		consoleTransport(true),
// 		// elasticTransport,
// 		bufferedTransporter,
// 		// asyncBatch.log.bind(asyncBatch),

// 	],
// 	enrichMetadata: () => ({
// 		timestamp: new Date().toISOString(),
// 		tenant: dbConfig.tenantId,
// 		requestId: axios.defaults.headers.common['X-Request-ID'],
// 		operation: 'create',
// 		model: 'UserModel',
// 	}),
// 	shouldLog: (level, meta) => {
// 		if (level === 'debug' && process.env.NODE_ENV === 'production') return false;
// 		if (level === 'error' && meta?.message?.includes('critical')) return false;
// 		return true;
// 	},
// 	hooks: {
// 		onLog: (entry) => {
// 			if (entry.level === 'info') {
// 				console.log(`[ALERT] ${entry.message}`);
// 			}
// 		},
// 		onError: (err, context) => {
// 			console.error('Logging error occurred:', err, context);
// 		},
// 	}
// })




// const getSource = (source: string) => {
// 	if (source === 'abimongo') {
// 		return 'abimongo';
// 	}
// }

// // export const logger = createLogger({
// //   level: 'error',
// //   colorize: false,
// //   // json: false,
// //   formatOptions: {
// //     timestamp: true,
// //     colorize: true,
// //     source: 'abimongo',
// //     json: false,
// //     prefix: '[ABIMONGO]',
// //   },
// //   transports: [{
// //     write: (entry) => {
// //       console.log(entry);
// //     },
// //   },
// //   consoleTransport(true),
// //   asyncBatch.log.bind(asyncBatch),
// //   bufferedTransporter,
// //   createElasticTransport('http://localhost:9200', 'abimongo.logs'),
// //   // createLokiTransport('http://localhost:3100/loki/api/v1/push', { job: 'abimongo' }),
// //   ],
// //   enrichMetadata: () => ({
// //     timestamp: new Date().toISOString(),
// //     tenant: 'tenant-a',
// //     requestId: 'req-123',
// //     operation: 'create',
// //     model: 'UserModel',
// //     source: 'abimongo',
// //   }),
// //   shouldLog: (level, meta) => {
// //     if (level === 'debug' && process.env.NODE_ENV === 'production') return false;
// //     if (level === 'error' && meta?.message?.includes('critical')) return false;
// //     return true;
// //   },
// //   // excludedSources: [],
// //   hooks: {
// //     onLog: (entry: any) => {
// //       if (entry.level === 'error') {
// //         console.log(`[ALERT] ${entry.message}`);
// //       }
// //     },
// //     onError: (err, context) => {
// //       console.error('Logging error occurred:', err, context);
// //     },
// //   },
// // });
