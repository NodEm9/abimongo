// import { ILogger } from "./ILogger";
// // import { NoOpLogger } from "./NoOpLogger";
// import { LogLevel } from "./levels";
// import fs from "fs";
// import * as chalk from 'chalk';


// const defaultLogLevel: LogLevel = "info";

// interface LoggerTransport {
// 	write: (message: string) => Promise<boolean>;
// }

// interface LoggerConfig {
// 	level?: LogLevel;
// 	transport?: LoggerTransport;
// 	colorize?: boolean;
// 	format?: (message: string, ...meta: any[]) => string;
// }

// export function createLogger(config: LoggerConfig): ILogger {
// 	const logLevel = config.level || defaultLogLevel;

// 	if (!["debug", "info", "warn", "error", "trace"].includes(logLevel)) {
// 		throw new Error(`Invalid log level: ${logLevel}`);
// 	}

// 	const writeMsg = fs.createWriteStream('abimongo.log', { flags: 'a' })
// 		.on('error', (err) => {
// 			console.error('Failed to create log file:', err);
// 		});
	
// 	const log = config.format || ((message: string, ...meta: any[]) => {
// 		const printWithColor = `${message} ${meta.length ? JSON.stringify(meta) : ''}`;
// 		return printWithColor ? colorizer(logLevel, printWithColor) : '';
// 	});

// 	const logger = (level: LogLevel, meta: any[]) => {
// 		if (config.colorize === true) {
// 			writeMsg.write(`${log(level, ...meta)}\n`, 'utf8', (err) => {
// 				if (err) {
// 					console.error('Failed to write log message:', err);
// 				}
// 			});
// 			consoleTransport(true)
// 			console.log(colorizer(level, log(level, ...meta)));
// 		}
// 		else {
// 			consoleTransport(false)
// 			console.log(log(level, ...meta));
// 		}

// 	}

// 	return {
// 		debug: (...meta: any[]) => { logger("debug", meta) },
// 		info: (...meta: any[]) => { logger("info", meta) },
// 		warn: (...meta: any[]) => { logger("warn", meta) },
// 		error: (...meta: any[]) => { logger("error", meta) },
// 		trace: (...meta: any[]) => { logger("trace", meta) }
// 	}
// }


// const colorizer = (level: LogLevel, message: string): string => {
// 	switch (level) {
// 		case 'info': return chalk.blue(message);
// 		case 'debug': return chalk.gray(message);
// 		case 'warn': return chalk.yellow(message);
// 		case 'error': return chalk.red(message);
// 		case 'fatal': return chalk.bgRed.white(message);
// 		case 'trace': return chalk.magenta(message);
// 		default: return message;
// 	}
// }

// export const consoleTransport = (colorize = true): LoggerTransport => ({
// 	write: (message: string) => {
// 		const formattedMessage = colorize ? colorizer("info", message) : message;
// 		console.log(formattedMessage);
// 		return Promise.resolve(true);
// 	}
// });