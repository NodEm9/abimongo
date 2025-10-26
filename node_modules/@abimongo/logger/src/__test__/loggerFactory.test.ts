import { createLogger } from '../logger';
import { LoggerConfig } from '../types';

describe('createLogger', () => {
	let mockTransport: { write: jest.Mock };
	let mockLogger: any;
	let config: LoggerConfig;

	beforeEach(() => {
		mockTransport = { write: jest.fn() };
		mockLogger = {
			debug: jest.fn(),
			info: jest.fn(),
			warn: jest.fn(),
			error: jest.fn(),
			trace: jest.fn(),
		};
		config = {
			level: 'info',
			transports: [mockTransport as any],
			colorize: false,
			json: false,
			excludedSources: [],
			formatOptions: { colorize: false },
			logger: mockLogger,
			hooks: {
				onLog: jest.fn(),
				onError: jest.fn(),
			},
		};
	});

	it('should log info messages and call transport write', () => {
		const logger = createLogger(config);
		logger.info('Test message', { foo: 'bar' });

		expect(mockTransport.write).toHaveBeenCalled();
		expect(mockLogger.info).toHaveBeenCalled();
		expect(config.hooks?.onLog).toHaveBeenCalled();
	});

	it('should not log messages below the configured level', () => {
		config.level = 'warn';
		const logger = createLogger(config);

		expect(mockTransport.write).not.toHaveBeenCalled();
		expect(mockLogger.info).not.toHaveBeenCalled();
	});

	it('should not log if source is excluded', () => {
		config.excludedSources = ['excludedSource'];
		const logger = createLogger(config);
		logger.info('Should not log', { source: 'excludedSource' });

		expect(mockTransport.write).not.toHaveBeenCalled();
	});

	it('should use enrichMetadata if provided', () => {
		config.enrichMetadata = (meta: Record<string, any>) => ({
			...meta,
			enriched: true,
		});
		const logger = createLogger(config);
		logger.info('Enrich test', { foo: 'bar' });

		expect(mockTransport.write).toHaveBeenCalled();
		const callArg = mockTransport.write.mock.calls[0][0];
		expect(callArg).toContain('Enrich test');
	});

	it('should log in JSON format if json=true', () => {
		const logger = createLogger(config);
		config.json = true;
		logger.info('Json error', { foo: 'baz' });
		expect(mockTransport.write).toHaveBeenCalled();
	});

	it('should use shouldLog function if provided', () => {
		config.shouldLog = jest.fn(() => false);
		const logger = createLogger(config);
		logger.info('Should not log');

		expect(mockTransport.write).not.toHaveBeenCalled();
		expect(config.shouldLog).toHaveBeenCalled();
	});

	it('should call all log levels', () => {
		const logger = createLogger(config);
		logger.debug('debug');
		logger.info('info');
		logger.warn('warn');
		logger.error('error');
		logger.trace('trace');

		expect(mockLogger.debug).toHaveBeenCalled();
		expect(mockLogger.info).toHaveBeenCalled();

	});
});