import { LogLevel, Transporter } from '../types';
import { colorByLevel } from '../logger';
import { formatConsole, now } from '../utils'; 

export const consoleTransport = (colorize = true): Transporter => ({
	write: (message: string, level?: LogLevel) => {
		const timestamp = now();
		const base = formatConsole(level || 'info', message, timestamp);
		colorize ? colorByLevel(level || 'info', base) : base;
		return Promise.resolve();
	}
})
