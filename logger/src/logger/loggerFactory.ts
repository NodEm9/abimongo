import { AbimongoConfig, LoggerConfig } from '../types';
import { colorByLevel } from './colorizer';
import { LOG_LEVELS } from './levels';
import { ILogger, LogEntry, LogLevel } from '../types';
import { MetricsTracker, formatJSON, formatMsg, now } from '../utils';



/**
 * Creates a logger instance based on the provided configuration.
 * 
 * @param {LoggerConfig} config - The configuration for the logger.
 * @param {AbimongoConfig} [abimongoConfig] - Optional Abimongo configuration.
 * @returns {ILogger} - The logger instance.
 */

export function createLogger(config: LoggerConfig, abimongoConfig?: AbimongoConfig): ILogger {
	const {
		level = 'info',
		transports = [],
		colorize = true,
		json = false,
		excludedSources = [],
		formatOptions,
		hooks,
		circuitBreaker,
		enableMetrics = { enabled: false, logInterval: 60000 }
	} = config

	const metrics = new MetricsTracker();
  // enableMetrics.enabled ? metrics.stop() : metrics.start();

	// Track metrics
	if (!config.enableMetrics?.enabled) {
		if (process.env.NODE_ENV !== 'test') {
			if (process.env.NODE_ENV === 'production') {
				metrics.start(); // Default to 1 minute
			}
		}
	} else {
		metrics.stop(); // Disable metrics tracking
		config.enableMetrics.enabled = false;
	}

	const writeToTransports = (level: string, formatted: string) => {
		transports.map((t) => {
			try {
				if ('write' in t){
					t.write(formatted, "info", []) // If the transport has a write method, use it
				}
				// else ('log' in t) && t.log?.(level, formatted);
			} catch (error) {
				hooks?.onError?.(error)
			}
		})
	}

	const shouldLogLevel = (
		config: LoggerConfig,
		level: LogLevel,
		meta?: Record<string, any>
	): boolean => {
		if (typeof config.shouldLog === 'function') {
			return config.shouldLog(level, meta);
		}
		const configuredLevelIndex = LOG_LEVELS[config.level ?? 'info'];
		const currentLevelIndex = LOG_LEVELS[level];
		return currentLevelIndex >= configuredLevelIndex;
	}

	const log = (levelKey: LogLevel) => {
		return (message: string, ...meta: any[]) => {
			const source = meta?.[0]?.source ?? '';
			if (excludedSources.includes(source)) return;

			const metadata: LogEntry = {
				timestamp: now(),
				level: level,
				message,
				meta: meta.length === 1 && typeof meta[0] === 'object' ? meta[0] : meta,
			};

			// Enrich metadata if user supplied enrichMetadata()
			const enriched = config.enrichMetadata ? config.enrichMetadata(metadata) : metadata;

			// Filter out logs based on the shouldLog function
			if (!shouldLogLevel(config, levelKey, enriched)) return;

			const formatted = formatMsg(
				levelKey,
				message,
				enriched as LogEntry[],
				formatOptions
			);
			const output = formatOptions?.colorize
				? colorByLevel(levelKey, formatted)
				: formatted
					? (colorize == true
						?
						colorByLevel(levelKey, formatted)
						: formatted)
					: formatted

			// Log the output
			if (json === true) {
				const jsonOutput = formatJSON({
					timestamp: now(),
					level: levelKey,
					message,
					meta: enriched,
					source: meta[0]?.source,
					prefix: formatOptions?.prefix,
				})
				const applyColor = colorize == true
					? colorByLevel(levelKey, jsonOutput)
					: jsonOutput
				writeToTransports(levelKey, applyColor);
				return;
			}

			if (abimongoConfig?.circuitBreaker?.enabled) {
				// Implement circuit breaker logic here
				// This is a placeholder for actual circuit breaker implementation
				let attempts = 0;
				const maxAttempts = abimongoConfig.circuitBreaker.retryAttempts || 3;
				const retryDelay = abimongoConfig.circuitBreaker.retryDelay || 1000;

				const attemptLog = async () => {
					try {
						writeToTransports(levelKey, output);
					} catch (error) {
						if (attempts < maxAttempts) {
							attempts++;
							setTimeout(attemptLog, retryDelay);
						} else {
							hooks?.onError?.(new Error(`Failed to log after ${maxAttempts} attempts: ${error}`));
						}
					}
				};

				attemptLog();
				return;
			}


			config.logger?.[levelKey as keyof ILogger]?.(output, ...meta, enriched, colorize);
			writeToTransports(levelKey, output);
			hooks?.onLog?.(metadata);
			// Track metrics
			if (!config.enableMetrics?.enabled) {
				metrics.start(); // Ensure metrics tracking is active
				metrics.trackLog()
				metrics.trackFlush()
				metrics.trackRotation();
			} 
			metrics.stop()
		};
	};

	process.on('exit', async () => {
		await metrics.stop();
		console.log('Metrics tracking stopped on exit.');
		console.log('Logger closed and all transports flushed.');
	});

	return {
		debug: log('debug'),
		info: log('info'),
		warn: log('warn'),
		error: log('error'),
		trace: log('trace')
	};
}
