/* Integration test: ensure AbimongoBootstrap.initialize completes when Redis is absent.
	 This test mocks the Redis layer to simulate an unreachable Redis server and
	 verifies that initialize() resolves (doesn't hang or throw). */

jest.setTimeout(20000);

// Mock the redis manager so calls to redis.get(...) will reject / fail
jest.mock('../redis-manager/redisClient', () => ({
	redis: {
		get: jest.fn().mockResolvedValue({
			isOpen: false,
			connect: jest.fn().mockRejectedValue(new Error('ECONNREFUSED')),
			disconnect: jest.fn(),
			publish: jest.fn(),
		}),
		isOpen: false,
		disconnect: jest.fn(),
	},
}));

// Mock the config loader to provide a minimal config that enables Redis
jest.mock('../config/loadAbimongoConfig', () => ({
	loadAbimongoConfig: jest.fn().mockResolvedValue({
		projectName: 'test-app',
		mongoUri: 'mongodb://localhost:27017/abimongo_test',
		features: {
			useRedisCache: true,
			redisUri: 'redis://127.0.0.1:9999'
		},
		logger: { enabled: false },
	}),
}));

// Mock the AbimongoClient so we don't need a real MongoDB instance for this test.
jest.mock('../lib-core/AbimongoClient', () => ({
	AbimongoClient: class {
		private uri: string | undefined;
		constructor(uri?: string, _opts?: any) {
			this.uri = uri;
		}
		async connect() {
			// no-op: pretend connect succeeded
			return Promise.resolve();
		}
		async disconnect() {
			return Promise.resolve();
		}
		getCollection(name: string) {
			// return a fake collection identifier
			return name;
		}
		get client() {
			// minimal shape used by AbimongoBootstrap
			return {
				db: () => ({ collection: () => ({}) }),
			};
		}
	}
}));

import { AbimongoBootstrap } from '../lib-core/bootstrap/AbimongoBootstrap';

describe('AbimongoBootstrap (integration) - redis absent', () => {
	it('initializes cleanly when Redis cannot be reached', async () => {
		const bootstrap = new AbimongoBootstrap();
		await expect(bootstrap.initialize()).resolves.not.toThrow();
		// shutdown should be safe even if redis was not connected
		await expect(bootstrap.shutdown()).resolves.not.toThrow();
	});
	afterAll(async () => {
		const shutdownLogger = require('@abimongo/logger').shutdownLogger;
		await shutdownLogger();
	})
});
