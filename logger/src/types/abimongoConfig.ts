
import {
	LoggerFormatOptions,
	LoggerHooks,
	LogLevel,
	ILogger,
	Transporter,
} from "./logger.types";
import { RemoteTransporter } from '../types';


export type AbimongoConfig = {
	circuitBreaker?: {
		enabled?: boolean;
		retryAttempts?: number;
		retryDelay?: number;
	};
	// garbageCollector?: {
	// 	enabled?: boolean;
	// 	retentionPeriod?: number; // in milliseconds
	// 	logResults?: boolean;
	// };
}

export interface LoggerConfig {
	logger?: ILogger;
	level?: LogLevel;
	colorize?: boolean;
	json?: boolean;
	transports?: Array<Transporter | RemoteTransporter>;
	excludedSources?: string[];
	formatOptions?: LoggerFormatOptions;
	hooks?: LoggerHooks;
	enrichMetadata?: (meta: Record<string, any>) => Record<string, any>;
	shouldLog?: (level: LogLevel, meta?: Record<string, any>) => boolean;
	circuitBreaker?: AbimongoConfig['circuitBreaker'];
	// garbageCollector?: AbimongoConfig['garbageCollector'];
	enableMetrics?: {
		enabled?: boolean;
		logInterval?: number;
	},
	compressLogFiles?: boolean; // Whether to compress old log files
}

