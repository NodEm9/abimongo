/* Integration test: ensure AbimongoBootstrap.initialize completes when Redis is absent.
	 This test mocks the Redis layer to simulate an unreachable Redis server and
	 verifies that initialize() resolves (doesn't hang or throw). */
import { AbimongoBootstrap } from '../lib-core/bootstrap/AbimongoBootstrap';
import { shutdownLogger } from '@abimongo/logger';
import { MongoClient } from 'mongodb';


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
		mongoClient: {
			connect: jest.fn().mockResolvedValue(undefined),
			close: jest.fn().mockResolvedValue(undefined),
			client: jest.fn().mockResolvedValue({
				collectionName: jest.fn(),
				dbName: jest.fn()
			}),
			collection: jest.fn()
		},
		provider: {
			connect: jest.fn().mockResolvedValue(undefined),
			close: jest.fn().mockResolvedValue(undefined),
			client: jest.fn().mockResolvedValue({
				collectionName: jest.fn(),
				dbName: jest.fn()
			}),
			collection: jest.fn()
		},
		connection: {
			uri: 'mongodb://localhost:27017/abimongo_test',
			options: { dbName: 'abimongo_test' },
		},
		// mongoUri: 'mongodb://localhost:27017/abimongo_test',
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

describe('AbimongoBootstrap (integration) - redis absent', () => {
	let bootstrap: AbimongoBootstrap;

	beforeEach(() => {
		bootstrap = new AbimongoBootstrap();
		// client = new AbimongoClient('mongodb://localhost:27017/abimongo_test');
	});
	it('initializes cleanly when Redis cannot be reached', async () => {
		const mockCollection = {
			findOne: jest.fn(),
			updateOne: jest.fn(),
			deleteOne: jest.fn(),
			insertOne: jest.fn(),
		};

		const mockDb = {
			db: jest.fn().mockReturnValue({
				collection: jest.fn().mockReturnValue(mockCollection)
			}),
		} as unknown as jest.Mocked<MongoClient>;

		const mockClient = {
			connect: jest.fn().mockResolvedValue(undefined),
			close: jest.fn().mockResolvedValue(undefined),
			db: jest.fn().mockResolvedValue(mockDb),
			collection: jest.fn().mockResolvedValue(mockCollection),
			startSession: jest.fn(),
		};

		bootstrap['provider'] = mockClient as any;

		// const bootstrap = new AbimongoBootstrap();
		await expect(bootstrap.initialize()).resolves.not.toThrow();
		// shutdown should be safe even if redis was not connected
		await expect(bootstrap.shutdown()).resolves.not.toThrow();
	});
	afterAll(async () => {
		await shutdownLogger();
	})
});
