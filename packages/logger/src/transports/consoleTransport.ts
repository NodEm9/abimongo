import { LogLevel, Transporter } from '../types';
import { colorByLevel } from '../logger';
import { formatConsole, now } from '../utils'; 

/**
 * 
 * @param colorize - whether to colorize the console output based on log level
 * @returns 
 * A console transporter that outputs log messages to the console with optional colorization.
 */
export const consoleTransport = (colorize = true): Transporter => ({
	write: (message: string, level?: LogLevel) => {
		const timestamp = now();
		const base = formatConsole(level || 'info', message, timestamp);
		colorize ? colorByLevel(level || 'info', base) : base;
		return Promise.resolve();
	}
})


