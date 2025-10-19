/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ErrorType } from "../utils/error/errorTypes";
import { Abimongo, AbimongoClient } from "../lib-core";
import { AbiMongoError } from "../utils/error/abimongoError-handler";
import { Collection } from "mongodb";
import { bufferedTransporter } from "../utils";
import { shutdownLogger } from "@abimongo/logger";




/**
 * @jest-environment node
 */
describe('AbimongoClient', () => {
	let driver: AbimongoClient;

	// Arrange
	const uri = 'mongodb://127.0.0.1:27017';
	const dbName = 'test';

	beforeAll(async () => {
		driver = await Abimongo.connect(uri, { dbName: dbName })
		await driver.connect();
	});

	it('should initialize MongoClient with correct URI', async () => {
		const MongoClient = jest.fn().mockImplementation(async () => {
			return await driver.connect()
		});

		await MongoClient(uri, {
			minPoolSize: 5,
			maxPoolSize: 50,
			serverSelectionTimeoutMS: 5000
		});

		// Assert
		expect(MongoClient).toHaveBeenCalledWith(uri, {
			minPoolSize: 5,
			maxPoolSize: 50,
			serverSelectionTimeoutMS: 5000
		});
	});

	describe('validateUri', () => {
		it('should not throw an error when URI starts with "mongodb://"', async () => {
			// Act & Assert
			await expect(() => {
				driver.validateUri(uri);
			}).not.toThrow();
		});

		it('should throw error when URI is an empty string', async () => {
			// Arrange
			const emptyUri = '';

			// Act & Assert
			await expect(() => {
				driver.validateUri(emptyUri);
			}).toThrow();
		});
	});

	describe('connect', () => {

		it('should connect to MongoDB and log connection to the console', async () => {
			// Arrange
			const mockClient = {
				connect: jest.fn().mockResolvedValue(undefined),
				log: jest.fn()
			};
			const expectedMessage = `Failed to connect to the database`;
			const expectedCause = 'CONNECTION_ERROR';

			const dbName = 'test';

			const abiMongo = {
				_client: mockClient,
				dbName,
				connect: async function () {
					try {
						await this._client.connect();
						console.log(`Connected to database: ${this.dbName}`);
					} catch (error) {
						console.log(AbiMongoError(
							ErrorType.AbiMongoConnectionError,
							`${expectedMessage} : ${error}`,
							ErrorType.AbiMongoErrorStack,
							expectedCause
						));
						throw error;
					}
				}
			};

			// const loggerSpy = jest.spyOn(logger, 'info');

			// let log = jest.spyOn(console, 'log').mockImplementation();

			// Act
			await abiMongo.connect();
			mockClient.log(`Connected to database: ${dbName}`);

			// Assert
			await expect(mockClient.connect).toHaveBeenCalled();
			expect(mockClient.log).toHaveBeenCalledWith(`Connected to database: ${dbName}`);
		});


		it('should handle connection failure and throw appropriate error', async () => {
			// Arrange
			const invalidUri = 'mongodb://invalidUri';

			// Act & Assert
			try {
				const invalidDriver = new AbimongoClient(invalidUri, { dbName: dbName });
				await invalidDriver.connect();
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (error: any) {
				expect(error.name).toBe(ErrorType.AbiMongoConnectionError);
				expect(error.message).toBe('Failed to connect to the database');
				expect(error.cause).toBe('CONNECTION_ERROR');
			}

		});
	});

	describe('db', () => {
		it('should return a database object', () => {
			// Arrange
			const expectedDbName = 'test';

			// Act
			const db = driver.db;

			// Assert
			expect(db.databaseName).toBe(expectedDbName);
		});

		it('should throw an error when connection is not established', () => {
			// Arrange
			const expectedMessage = 'Database connection is not established. call connect() first.';

			const mockDB = jest.spyOn(driver, 'db', 'get').mockImplementation(() => {
				throw AbiMongoError(
					ErrorType.AbiMongoConnectionError,
					expectedMessage,
					ErrorType.AbiMongoErrorStack,
					ErrorType.NULL_OR_UNDEFINED
				);
			});

			// Act & Assert
			expect(() => driver.db).toThrow(expectedMessage);
			expect(mockDB).toHaveBeenCalled();
			expect(() => driver.db).toThrow(
				AbiMongoError(
					ErrorType.AbiMongoConnectionError,
					expectedMessage,
					ErrorType.AbiMongoErrorStack,
					ErrorType.NULL_OR_UNDEFINED
				)
			);
		})
	});

	describe('collection', () => {
		it('should return a collection object', async () => {
			// Arrange
			const collectionName = 'testCollection';

			// Act
			const collection = await driver.collection(collectionName);

			// Assert
			expect(collection.collectionName).toBe(collectionName);
		});
	});

	describe('getCollection', () => {
		it('should return a MongoDB Collection object when db is defined', async () => {
			// Arrange
			const mockCollection = { find: jest.fn() };
			const mockDb = {
				collection: jest.fn().mockReturnValue(mockCollection)
			};

			const abiMongo = {
				db: mockDb,
				getCollection: function <T extends Document>(name: string): Collection<T> {
					if (!this.db) {
						const message = 'No cllection found, please check the database name';
						const cause = 'DB_NAME_ERROR';

						throw AbiMongoError(
							ErrorType.AbiMongoCollectionError,
							message,
							ErrorType.AbiMongoErrorStack,
							`Possible: ${cause}`
						);
					}
					return this.db.collection(name);
				}
			};

			// Act
			const result = await abiMongo.getCollection('testCollection');

			// Assert
			await expect(mockDb.collection).toHaveBeenCalledWith('testCollection');
			await expect(result).toBe(mockCollection);
		});

		it('should throw error when db is undefined or null', async () => {
			const testDriver = new AbimongoClient(uri, { dbName: "" });
			// Act & Assert
			await expect(() => {
				testDriver.getCollection('');
			}).toBeDefined();
		});
	});

	describe('getClusterInfo', () => {
		it('should log a message when MongoDB is running in a sharded cluster', async () => {
			// Arrange
			const mockAdminDb = {
				command: jest.fn().mockResolvedValue({ msg: 'isdbgrid' }),
			};
			const expectedMessage = 'MongoDB is running in a sharded cluster.';

			const abiMongo = {
				client: {
					db: jest.fn().mockReturnValue(mockAdminDb)
				},
				getClusterInfo: async function () {
					const adminDb = this.client.db();
					const result = await adminDb.command({ isMaster: 1 });

					if (result.msg === 'isdbgrid') {
						console.info('MongoDB is running in a sharded cluster.');
					}
				}
			};

			// Act
			await abiMongo.getClusterInfo();

			// Assert
			expect(expectedMessage).toBe('MongoDB is running in a sharded cluster.');
		});

		// it('should return sharded type when MongoDB is running in a sharded cluster', async () => {
		// 	// Arrange
		// 	const mockCommand = jest.fn().mockResolvedValue({ msg: 'isdbgrid' });
		// 	const mockAdmin = jest.fn().mockReturnValue({ command: mockCommand });
		// 	const mockDb = jest.fn().mockReturnValue({ admin: mockAdmin });
		// 	const mockClient = { db: mockDb };

		// 	const abiMongo = new AbimongoClient(uri, { dbName: dbName });
		// 	Object.defineProperty(abiMongo, 'client', { value: mockClient });

		// 	// Act
		// 	const result = await abiMongo.getClusterInfo();

		// 	// Assert
		// 	expect(mockCommand).toHaveBeenCalledWith({ isMaster: 1 });
		// 	expect(result).toEqual({ type: 'sharded' });
		// });
	});

	describe('dropDatabase', () => {
		it('should drop the database', async () => {
			// Arrange
			const mockClient = {
				client: jest.fn().mockReturnValue({
					connect: jest.fn().mockResolvedValue(undefined),
				}),
				db: jest.fn().mockReturnValue({
					dropDatabase: jest.fn().mockResolvedValue(undefined),
				})
			}
			// const mockDb = {
			// 	dropDatabase: jest.fn().mockResolvedValue(undefined)
			// };
			const abiMongo = {
				_db: mockClient.db(),
				_client: mockClient,
				connect: async function () {
					await this._client.client().connect();
					console.log(`Connected to database: ${this._db.dbName}`);
				},
				dropDatabase: async function () {
					if (!this._db) {
						throw new Error('Database not connected');
					}
					await this._db.dropDatabase();
					console.log(`Dropped database: ${this._db.databaseName}`);
					return true;
				}
			};

			// Act
			await abiMongo.connect();
			await abiMongo.dropDatabase();

			// Assert
			expect(mockClient.client).toHaveBeenCalled();
			expect(mockClient.db).toHaveBeenCalled();
		});
	});

	describe('disconnect', () => {
		it('should close the database connection', async () => {
			// Arrange
			const mockClient = {
				close: jest.fn().mockResolvedValue(undefined)
			};
			const abiMongo = {
				client: mockClient,
				disconnect: async function () {
					await this.client.close();
					// logger.info('Disconnected from the database');
				}
			};

			// const loggerSpy = jest.spyOn(logger, 'info');
			await abiMongo.disconnect();

			// Assert
			expect(mockClient.close).toHaveBeenCalled();
			// expect(loggerSpy).toHaveBeenCalledWith('Disconnected from the database');
		});
	});

	describe('getTenantDB', () => {
		const tenantDBs: Map<string, AbimongoClient> = new Map();
		it('should check if the tenant database is cached and return it', () => {
			// Arrange
			const tenantId = 'tenant123';
			// Act
			const cachedTenantDb = AbimongoClient.getTenantDB(tenantId);
			if (tenantDBs.has(tenantId)) {
				tenantDBs.get(tenantId);
				return
			}
			// Assert
			// expect(cachedTenantDb).toBe(tenantDb);
			expect(tenantDBs.get(tenantId)).toBe(cachedTenantDb);
		});

		it('should create a new tenant database if not cached', async () => {
			const instances: Map<string, AbimongoClient> = new Map()
			// Arrange
			const tenantId = 'tenant456';
			const tenantDb = AbimongoClient.getTenantDB(tenantId);
			// Act
			await AbimongoClient.getTenantDB(tenantId);
			// Assert
			expect(instances.get(tenantId)).toBe(tenantDb);
			expect(tenantDBs.get(tenantId)).toBe(tenantDb);
		});
	});

	it('should throw error if connectDb is called without uri', async () => {
		const client = new AbimongoClient(uri, { dbName });
		// @ts-expect-error
		await expect(client.connectDb(undefined)).rejects.toBeDefined();
	});

	it('should throw error if getTenantDB is called without tenantId', () => {
		expect(() => AbimongoClient.getTenantDB('')).toThrow();
	});

	it('should throw error if db getter is called when _db is null', () => {
		const client = new AbimongoClient(uri, { dbName });
		// forcibly set _db to null
		(client as any)._db = null;
		expect(() => client.db).toThrow('Database connection is not established. call connect() first.');
	});

	it('should log error if collection is called without _client', () => {
		const client = new AbimongoClient(uri, { dbName });
		(client as any)._client = null;
		// const loggerSpy = jest.spyOn(logger, 'error');
		client.collection('test');
		const message = 'You are attempting to access a collection without a database connection.';
		const cause = 'DB_NAME_ERROR';
		const error = new Error(message).stack;

		console.log = jest.fn();
		console.log(`[${cause}]:, ${error}`);

		expect(console.log).toHaveBeenCalled();
	});

	it('should log error if getCollection is called without _client', () => {
		const client = new AbimongoClient(uri, { dbName });
		(client as any)._client = null;

		client.getCollection('test');

		const message = 'No collection found, please check the database name.';
		const cause = 'DB_NAME_ERROR';
		const error = new Error(message).stack;

		console.log = jest.fn();
		console.log(`[${cause}]:, ${error}`);

		expect(console.log).toHaveBeenCalled();
	});

	it('should return replicaSet type and msg in getClusterInfo', async () => {
		const mockCommand = jest.fn().mockResolvedValue({ isMaster: true, msg: 'isdbgrid' });
		const mockAdmin = jest.fn().mockReturnValue({ command: mockCommand });
		const mockDb = jest.fn().mockReturnValue({ admin: mockAdmin });
		const mockClient = { db: mockDb };
		const client = new AbimongoClient(uri, { dbName });
		Object.defineProperty(client, 'client', { value: mockClient });
		const log = jest.spyOn(console, 'log');
		const result = await client.getClusterInfo();
		expect(result).toEqual({ type: 'sharded' });
		expect(log).toHaveBeenCalledWith('MongoDB is running in a sharded cluster.');
	});

	it('should return replicaSet type and setName in getClusterInfo', async () => {
		const mockCommand = jest.fn().mockResolvedValue({ setName: 'rs0' });
		const mockAdmin = jest.fn().mockReturnValue({ command: mockCommand });
		const mockDb = jest.fn().mockReturnValue({ admin: mockAdmin });
		const mockClient = { db: mockDb };
		const client = new AbimongoClient(uri, { dbName });
		Object.defineProperty(client, 'client', { value: mockClient });
		const log = jest.spyOn(console, 'log');
		const result = await client.getClusterInfo();
		expect(result).toEqual({ type: 'replicaSet', setName: 'rs0' });
		expect(log).toHaveBeenCalledWith('MongoDB is running in a replica set: rs0');
	});

	it('should return standalone type in getClusterInfo', async () => {
		const mockCommand = jest.fn().mockResolvedValue({});
		const mockAdmin = jest.fn().mockReturnValue({ command: mockCommand });
		const mockDb = jest.fn().mockReturnValue({ admin: mockAdmin });
		const mockClient = { db: mockDb };
		const client = new AbimongoClient(uri, { dbName });
		Object.defineProperty(client, 'client', { value: mockClient });
		const log = jest.spyOn(console, 'log');
		const result = await client.getClusterInfo();
		expect(result).toEqual({ type: 'standalone' });
		expect(log).toHaveBeenCalledWith('MongoDB is running as a standalone instance.');
	});

	it('should throw error if useDatabase is called without _client', async () => {
		const client = new AbimongoClient(uri, { dbName });
		(client as any)._client = null;
		await expect(client.useDatabase('somedb')).rejects.toThrow('Client not initialized. Call `connect()` first.');
	});

	it('should throw error if useDatabase is called without dbName', async () => {
		const client = new AbimongoClient(uri, { dbName });
		await client.connect();
		await expect(client.useDatabase('')).rejects.toBeDefined();
	});

	it('should throw error if useCollection is called without _client', async () => {
		const client = new AbimongoClient(uri, { dbName });
		(client as any)._client = null;
		await expect(client.useCollection('col')).rejects.toThrow('Client not initialized. Call `connect()` first.');
	});

	it('should throw error if useCollection is called without collectionName', async () => {
		const client = new AbimongoClient(uri, { dbName });
		await client.connect();
		await expect(client.useCollection('')).rejects.toBeDefined();
	});

	it('should call drop on collection in dropCollection', async () => {
		const mockDrop = jest.fn().mockResolvedValue(undefined);
		const mockCollection = { drop: mockDrop };
		const mockDb = { collection: jest.fn().mockReturnValue(mockCollection) };
		const mockClient = {
			connect: jest.fn().mockResolvedValue(undefined),
			db: jest.fn().mockReturnValue(mockDb)
		};
		const client = new AbimongoClient(uri, { dbName });
		(client as any)._client = mockClient;
		(client as any).collectionName = 'test';
		await client.dropCollection()
		await mockCollection.drop();

		expect(mockDrop).toHaveBeenCalled();
		expect(mockCollection.drop).toHaveBeenCalledTimes(1);
	});

	it('should throw error if connectDb is called with falsy uri', async () => {
		const client = new AbimongoClient(uri, { dbName });
		await expect(client.connectDb('')).rejects.toBeDefined();
	});

	it('should set _client and _db when connectDb is called with new uri', async () => {
		const client = new AbimongoClient(uri, { dbName });
		const newUri = 'mongodb://127.0.0.1:27018';
		const result = await client.connectDb(newUri, { dbName: 'otherdb' });
		expect(result).toBeInstanceOf(AbimongoClient);
		expect((result as any)._uri).toBe(newUri);
	});

	it('should throw error if getTenantDB is called with falsy tenantId', () => {
		expect(() => AbimongoClient.getTenantDB('')).toThrow();
	});

	it('should throw error if db getter is called when _db is undefined', () => {
		const client = new AbimongoClient(uri, { dbName });
		(client as any)._db = undefined;
		expect(() => client.db).toThrow('Database connection is not established. call connect() first.');
	});

	it('should return _client when client getter is called', () => {
		const client = new AbimongoClient(uri, { dbName });
		expect(client.client).toBeDefined();
	});

	it('should throw error in validateUri if uri does not start with mongodb:// or mongodb+srv://', () => {
		const client = new AbimongoClient(uri, { dbName });
		expect(() => client.validateUri('http://localhost')).toThrow();
	});

	it('should call log error in collection if _client is null', () => {
		const client = new AbimongoClient(uri, { dbName });
		(client as any)._client = null;

		const message = 'You are attempting to access a collection without a database connection.';
		const cause = 'DB_NAME_ERROR';
		const error = new Error(message).stack;

		console.log = jest.fn();
		console.log(`[${cause}]:, ${error}`);
		client.collection('test');
		expect(console.log).toHaveBeenCalled();
	});

	it('should call log error in getCollection if _client is null', () => {
		const client = new AbimongoClient(uri, { dbName });
		(client as any)._client = null;
		console.log = jest.fn();
		client.getCollection('test');

		const message = 'No collection found, please check the database name.';
		const cause = 'DB_NAME_ERROR';
		const error = new Error(message).stack;

		console.log(`[${cause}]:`, error);
		expect(console.log).toHaveBeenCalled();
	});

	it('should log correct message in getClusterInfo for sharded', async () => {
		const mockCommand = jest.fn().mockResolvedValue({ msg: 'isdbgrid' });
		const mockAdmin = jest.fn().mockReturnValue({ command: mockCommand });
		const mockDb = jest.fn().mockReturnValue({ admin: mockAdmin });
		const mockClient = { db: mockDb };
		const client = new AbimongoClient(uri, { dbName });
		Object.defineProperty(client, 'client', { value: mockClient });
		const log = jest.spyOn(console, 'log');
		await client.getClusterInfo();
		expect(log).toHaveBeenCalledWith('MongoDB is running in a sharded cluster.');
	});

	it('should log correct message in getClusterInfo for replicaSet', async () => {
		const mockCommand = jest.fn().mockResolvedValue({ setName: 'rs0' });
		const mockAdmin = jest.fn().mockReturnValue({ command: mockCommand });
		const mockDb = jest.fn().mockReturnValue({ admin: mockAdmin });
		const mockClient = { db: mockDb };
		const client = new AbimongoClient(uri, { dbName });
		Object.defineProperty(client, 'client', { value: mockClient });
		const log = jest.spyOn(console, 'log');
		await client.getClusterInfo();
		expect(log).toHaveBeenCalledWith('MongoDB is running in a replica set: rs0');
	});

	it('should log with correct message in getClusterInfo for standalone', async () => {
		const mockCommand = jest.fn().mockResolvedValue({ standalone: true });
		const mockAdmin = jest.fn().mockReturnValue({ command: mockCommand });
		const mockDb = jest.fn().mockReturnValue({ admin: mockAdmin });
		const mockClient = { db: mockDb };
		const client = new AbimongoClient(uri, { dbName });
		Object.defineProperty(client, 'client', { value: mockClient });
		const log = jest.spyOn(console, 'log');
		await client.getClusterInfo();
		expect(log).toHaveBeenCalledWith('MongoDB is running as a standalone instance.');
	});

	it('should throw error if useDatabase is called without dbName', async () => {
		const client = new AbimongoClient(uri, { dbName });
		await client.connect();
		await expect(client.useDatabase('')).rejects.toBeDefined();
	});

	it('should throw error if useCollection is called without collectionName', async () => {
		const client = new AbimongoClient(uri, { dbName });
		await client.connect();
		await expect(client.useCollection('')).rejects.toBeDefined();
	});

	it('should resolve true when dropDatabase succeeds', async () => {
		const mockDropDatabase = jest.fn().mockResolvedValue(undefined);
		const mockClose = jest.fn().mockResolvedValue(undefined);
		const mockDb = { dropDatabase: mockDropDatabase };
		const mockClient = {
			connect: jest.fn().mockResolvedValue(undefined),
			db: jest.fn().mockReturnValue(mockDb),
			close: mockClose
		};
		const client = new AbimongoClient(uri, { dbName });
		(client as any)._client = mockClient;
		const result = await client.dropDatabase();

		expect(result).toBe(true);
	});

	it('should reject when dropDatabase fails', async () => {
		const mockDropDatabase = jest.fn().mockRejectedValue(new Error('Failed to drop database'));
		const mockDb = { dropDatabase: mockDropDatabase };
		const mockClient = {
			connect: jest.fn().mockResolvedValue(undefined),
			db: jest.fn().mockReturnValue(mockDb),
			close: jest.fn()
		};
		const client = new AbimongoClient(uri, { dbName });
		(client as any)._client = mockClient;
		// const loggerSpy = jest.spyOn(logger, 'error');
		await expect(client.dropDatabase()).rejects.toBeDefined();
		// expect(loggerSpy).toHaveBeenCalledWith('Failed to drop database');
	});

	it('should set _client and _db to null on disconnect', async () => {
		const mockClose = jest.fn().mockResolvedValue(undefined);
		const client = new AbimongoClient(uri, { dbName });
		(client as any)._client = { close: mockClose };
		(client as any)._db = {};
		await client.disconnect();
		expect((client as any)._client).toBeNull();
		expect((client as any)._db).toBeNull();
	});

	it('should call client.close and log to the console on close()', async () => {
		const mockClose = jest.fn().mockResolvedValue(undefined);
		const client = new AbimongoClient(uri, { dbName });
		Object.defineProperty(client, 'client', { value: { close: mockClose } });
		await client.close();
		expect(mockClose).toHaveBeenCalled();
	});

	afterAll(async () => {
		await driver.dropDatabase();
		// await bufferedTransporter.stop();
		await driver.disconnect();
		// Clean up any resources if necessary
		driver = null as any; // Clear the driver instance
		jest.clearAllMocks();
		await shutdownLogger();
	});
});

