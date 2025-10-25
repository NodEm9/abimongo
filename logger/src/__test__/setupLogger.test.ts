 import { setupLogger } from '../logger';

describe('setupLogger', () => {
  let mockTransporter: { write: jest.Mock };
  let mockLogger: any;
  let mockHooks: any;

  beforeEach(() => {
    mockTransporter = { write: jest.fn() };
    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
    };
    mockHooks = {
      onLog: jest.fn(),
      onError: jest.fn(),
    };
	});
	
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should return the provided logger if it exists', () => {
		const config = {
			logger: mockLogger,
		};

		const logger = setupLogger(config);

		expect(logger).toBe(mockLogger);
	});

	it('should create a new logger if no logger is provided', () => {
		const config = {
			level: 'info' as any, // or as LogLevel if imported
			transporters: [mockTransporter],
			hooks: mockHooks,
		};

		const logger = setupLogger(config);

		expect(logger).toHaveProperty('info');
		expect(logger).toHaveProperty('error');
	});
});