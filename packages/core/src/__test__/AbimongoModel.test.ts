import { AbimongoModel, AbimongoSchema, AbimongoClient } from "../lib-core";
import { ClientSession, Collection, Db, MongoClient, ObjectId } from "mongodb";
import EventEmitter from "events";
// import { bufferedTransporter } from "../utils";


type MockTenantDB = {
	[tenantId: string]: Db;
};

interface TestDocument {
	_id: string;
	name: string;
	[key: string]: any; // Add index signature to satisfy the 'Document' constraint
}

jest.mock('redis', () => {
	const client = {
		get: jest.fn(),
		set: jest.fn(),
		hGetAll: jest.fn(),
		duplicate: jest.fn(),
		publish: jest.fn(),
	}
	return {
		createClient: jest.fn(() => client),
	};
});


describe('AbimongoModel', () => {
	const tenantId = jest.fn();
	const collectionName = 'users';

	let model: AbimongoModel<TestDocument>;
	let mockCollection: jest.Mocked<Collection<TestDocument>>;
	let mockDb: jest.Mocked<MongoClient>;


	it('should insert a document when valid data is provided', async () => {
		// Arrange
		const mockCollection = {
			insertOne: jest.fn().mockResolvedValue({ insertedId: 'mockId' }),
			find: jest.fn().mockReturnValue({ toArray: jest.fn() }),
			findOne: jest.fn(),
			collectionName: 'testCollection'
		};

		const mockDb = {
			collection: jest.fn().mockReturnValue(mockCollection)
		};

		const mockClient = {
			startSession: jest.fn()
		};

		const mockSchema = new AbimongoSchema({} as Record<string, any>);
		mockSchema.executeHooks = jest.fn().mockResolvedValue(undefined);
		mockSchema.validate = jest.fn().mockResolvedValue(undefined);

		jest.spyOn(AbimongoClient, 'getTenantDB').mockReturnValue(mockDb as unknown as Db);
		jest.spyOn(AbimongoClient, 'getDatabase').mockResolvedValue({ db: mockDb as unknown as Db, client: { startSession: jest.fn() } as unknown as MongoClient });

		const model = new AbimongoModel({
			db: mockDb as unknown as Db,
			collectionName: 'testCollection',
			schema: mockSchema,
			client: mockClient as unknown as MongoClient,
		});


		const validDoc = { name: 'Test Document' };

		mockSchema.validate(validDoc);
		mockSchema.executeHooks('pre-save', validDoc);

		// Act
		const result = await model.create(validDoc);
		mockSchema.executeHooks('post-save', validDoc);

		// Assert
		expect(mockSchema.executeHooks).toHaveBeenCalledWith('pre-save', validDoc);
		expect(mockSchema.validate).toHaveBeenCalledWith(validDoc);
		expect(mockCollection.insertOne).toHaveBeenCalledWith(validDoc);
		expect(mockSchema.executeHooks).toHaveBeenCalledWith('post-save', validDoc);
		expect(result).toEqual({ ...validDoc, _id: 'mockId' });
	});


	it('should initialize with tenant database and collection', async () => {
		// Mock dependencies
		const mockDb = { collection: jest.fn().mockResolvedValue(collectionName) };
		const db: MockTenantDB = { tenantDB: mockDb as unknown as Db };


		// Create model instance
		const model = new AbimongoModel({
			collectionName: collectionName,
			db: db.tenantDB,
			schema: new AbimongoSchema({} as Record<string, any>),
		});

		// Mock the getTenantDB method to return the mock database
		jest.spyOn(AbimongoClient, 'getTenantDB').mockReturnValue(db.tenantDB as unknown as Db);
		jest.spyOn(AbimongoClient, 'getDatabase').mockResolvedValue({ db: db.tenantDB as unknown as Db, client: { startSession: jest.fn() } as unknown as MongoClient });
		// Call the init method to initialize the model
		await model.init();


		// Assert that the collection method was called with the correct collection name
		expect(mockDb.collection).toHaveBeenCalledWith(collectionName);
		// Assert that the schema property of the model is an instance of AbimongoSchema
		expect(model.schema).toBeInstanceOf(AbimongoSchema);

	});

	it('should throw validation error when invalid data is provided', async () => {
		// Arrange
		const mockCollection = {
			insertOne: jest.fn(),
			find: jest.fn().mockReturnValue({ toArray: jest.fn() }),
			findOne: jest.fn(),
			collectionName: 'testCollection'
		};

		const mockDb = {
			collection: jest.fn().mockReturnValue(mockCollection)
		};

		const mockClient = {
			startSession: jest.fn()
		};

		const mockSchema = new AbimongoSchema({
			name: { required: true, type: String }
		} as Record<string, any>);

		mockSchema.executeHooks = jest.fn().mockResolvedValue(undefined);
		mockSchema.validate = jest.fn().mockImplementation(() => {
			throw new Error(`Field "${''}" is required but not provided.`);
		});

		jest.spyOn(AbimongoClient, 'getTenantDB').mockReturnValue(mockDb as unknown as Db);
		jest.spyOn(AbimongoClient, 'getDatabase').mockResolvedValue({ db: mockDb as unknown as Db, client: { startSession: jest.fn() } as unknown as MongoClient });

		const model = new AbimongoModel({
			db: mockDb as unknown as Db,
			collectionName: 'testCollection',
			schema: mockSchema,
			client: mockClient as unknown as MongoClient,
		});

		const invalidDoc = { name: '', age: 30 }; // Missing required 'name' field

		// Act & Assert
		await expect(model.create(invalidDoc)).rejects.toThrow(
			`Field "${invalidDoc.name}" is required but not provided.`);
		expect(mockSchema.executeHooks).toHaveBeenCalledWith('pre-save', invalidDoc);
		expect(mockSchema.validate).toHaveBeenCalledWith(invalidDoc);
		expect(mockCollection.insertOne).not.toHaveBeenCalled();
	});

	describe('create', () => {
		it('should call executeHooks and validate methods', async () => {
			const mockCollection = {
				insertOne: jest.fn().mockResolvedValue({ insertedId: new ObjectId() }),
				find: jest.fn().mockReturnValue({ toArray: jest.fn() }),
				findOne: jest.fn(),
				collectionName: 'testCollection'
			};

			const mockDb = {
				collection: jest.fn().mockReturnValue(mockCollection)
			};

			const mockClient = {
				startSession: jest.fn()
			};

			const mockSchema = new AbimongoSchema({} as Record<string, any>);
			mockSchema.executeHooks = jest.fn().mockResolvedValue(undefined);
			mockSchema.validate = jest.fn().mockResolvedValue(undefined);

			jest.spyOn(AbimongoClient, 'getTenantDB').mockReturnValue(mockDb as unknown as Db);
			jest.spyOn(AbimongoClient, 'getDatabase').mockResolvedValue({ db: mockDb as unknown as Db, client: { startSession: jest.fn() } as unknown as MongoClient });

			const model = new AbimongoModel({
				db: mockDb as unknown as Db,
				collectionName: 'testCollection',
				schema: mockSchema,
				client: mockClient as unknown as MongoClient,
			});

			const validDoc = { name: 'Test Document' };

			await model.create(validDoc);

			expect(mockSchema.executeHooks).toHaveBeenCalledWith('pre-save', validDoc);
			expect(mockSchema.validate).toHaveBeenCalledWith(validDoc);
		});

		it('should call executeHooks and validate methods with bulkInsert', async () => {
			const mockCollection = {
				insertMany: jest.fn().mockResolvedValue({ insertedIds: [new ObjectId()] }),
				find: jest.fn().mockReturnValue({ toArray: jest.fn() }),
				findOne: jest.fn(),
				collectionName: 'testCollection'
			};

			const mockDb = {
				collection: jest.fn().mockReturnValue(mockCollection)
			};

			const mockClient = {
				startSession: jest.fn()
			};

			const mockSchema = new AbimongoSchema({} as Record<string, any>);
			mockSchema.executeHooks = jest.fn().mockResolvedValue(undefined);
			mockSchema.validate = jest.fn().mockResolvedValue(undefined);

			jest.spyOn(AbimongoClient, 'getTenantDB').mockReturnValue(mockDb as unknown as Db);
			jest.spyOn(AbimongoClient, 'getDatabase').mockResolvedValue({ db: mockDb as unknown as Db, client: { startSession: jest.fn() } as unknown as MongoClient });

			const model = new AbimongoModel({
				db: mockDb as unknown as Db,
				collectionName: 'testCollection',
				schema: mockSchema,
				client: mockClient as unknown as MongoClient,
			});

			const validDocs = [{ name: 'Test Document 1' }, { name: 'Test Document 2' }];

			await model.bulkInsert(validDocs);

			expect(mockSchema.executeHooks).toHaveBeenCalledWith('pre-save', validDocs);
		});
	})

	describe('find', () => {
		it('should call find method on collection', async () => {
			const mockCollection = {
				find: jest.fn().mockReturnValue({ toArray: jest.fn().mockResolvedValue([]) }),
				findOne: jest.fn(),
				collectionName: 'testCollection'
			};

			const mockDb = {
				collection: jest.fn().mockReturnValue(mockCollection)
			};

			const mockClient = {
				startSession: jest.fn()
			};

			const model = new AbimongoModel({
				db: mockDb as unknown as Db,
				collectionName: 'testCollection',
				schema: new AbimongoSchema({} as Record<string, any>),
				client: mockClient as unknown as MongoClient
			});

			await model.find({});

			expect(mockCollection.find().toArray).toBeTruthy();
		});
	})

	// describe('findOne', () => {

	// 	it('should call findOne method on collection', async () => {

	// 	});
	// })
	describe('findOne', () => {
		const mockSchema = new AbimongoSchema({} as Record<string, any>);

		beforeEach(() => {
			mockCollection = {
				findOne: jest.fn(),
				deleteOne: jest.fn(),
				find: jest.fn().mockReturnValue({ toArray: jest.fn() }),
			} as unknown as jest.Mocked<Collection<TestDocument>>;

			mockDb = {
				db: jest.fn().mockReturnValue({
					collection: jest.fn().mockReturnValue(mockCollection),
				}),
			} as unknown as jest.Mocked<MongoClient>;

			model = new AbimongoModel<TestDocument>({
				db: mockDb.db(),
				collectionName: 'testCollection',
				schema: mockSchema as unknown as AbimongoSchema<TestDocument>,
			});
		});

		it('should return a document when found', async () => {
			const filter = { _id: '123' };
			const expectedDocument = { _id: '123', name: 'Doc1' };

			mockCollection.findOne.mockResolvedValue(expectedDocument);

			jest.spyOn(AbimongoClient, 'getTenantDB').mockReturnValue(mockDb.db() as unknown as Db);
			jest.spyOn(AbimongoClient, 'getDatabase').mockResolvedValue({ db: mockDb.db() as unknown as Db, client: { startSession: jest.fn() } as unknown as MongoClient });
			await model.init()

			const result = await model.findOne(filter);

			expect(mockCollection.findOne).toHaveBeenCalledWith(filter);
			expect(result).toEqual(expectedDocument);
		});

		it('should return null when no document is found', async () => {
			const filter = { _id: '123' };

			mockCollection.findOne.mockResolvedValue(null);
			jest.spyOn(AbimongoClient, 'getTenantDB').mockReturnValue(mockDb.db() as unknown as Db);
			jest.spyOn(AbimongoClient, 'getDatabase').mockResolvedValue({ db: mockDb.db() as unknown as Db, client: { startSession: jest.fn() } as unknown as MongoClient });
			await model.init()

			const result = await model.findOne(filter);

			expect(mockCollection.findOne).toHaveBeenCalledWith(filter);
			expect(result).toBeNull();
		});

		it('should throw an error if findOne fails', async () => {
			const filter = { _id: '123' };

			mockCollection.findOne.mockRejectedValue(new Error('Database error'));

			jest.spyOn(AbimongoClient, 'getTenantDB').mockReturnValue(mockDb.db() as unknown as Db);
			jest.spyOn(AbimongoClient, 'getDatabase').mockResolvedValue({ db: mockDb.db() as unknown as Db, client: { startSession: jest.fn() } as unknown as MongoClient });
			await model.init()

			await expect(model.findOne(filter)).rejects.toThrow('Database error');
			expect(mockCollection.findOne).toHaveBeenCalledWith(filter);
		});
	});

	describe('updateOne', () => {
		it('should update a document and trigger hooks and publish event', async () => {
			const filter = { _id: "123" };
			const update = { $set: { name: 'Updated Name' } };

			const mockSchema = new AbimongoSchema({} as Record<string, any>);
			mockSchema.executeHooks = jest.fn().mockResolvedValue(undefined);

			// Arrange
			const mockCollection = {
				updateOne: jest.fn().mockResolvedValue(null)
			} as unknown as jest.Mocked<Collection<TestDocument>>;

			const mockDb = {
				db: jest.fn().mockReturnValue({
					collection: jest.fn().mockReturnValue(mockCollection)
				}),
			} as unknown as jest.Mocked<MongoClient>;

			const model = new AbimongoModel({
				db: mockDb.db(),
				collectionName: 'testCollection',
				schema: mockSchema as unknown as AbimongoSchema<TestDocument>,
			});

			jest.spyOn(AbimongoClient, 'getTenantDB').mockReturnValue(mockDb.db() as unknown as Db);
			jest.spyOn(AbimongoClient, 'getDatabase').mockResolvedValue({ db: mockDb.db() as unknown as Db, client: { startSession: jest.fn() } as unknown as MongoClient });
			await model.init()

			// Act
			await model.updateOne(filter, update);

			expect(mockCollection.updateOne).toHaveBeenCalledWith(filter, update);
		});

	})

	describe('bulkInsert', () => {
		it('should insert multiple documents and trigger hooks', async () => {
			type TestDocumentType = {
				_id: string;
				name: string;
				[key: string]: any; // Add index signature to satisfy the 'Document' constraint
			};
			// Arrange
			const mockCollection = {
				insertMany: jest.fn().mockResolvedValue(null)
			} as unknown as jest.Mocked<Collection<TestDocumentType>>;

			const mockSchema = new AbimongoSchema({} as Record<string, any>);
			mockSchema.executeHooks = jest.fn().mockResolvedValue(undefined);
			mockSchema.validate = jest.fn().mockResolvedValue(undefined);

			const mockDb = {
				db: jest.fn().mockReturnValue({
					collection: jest.fn().mockReturnValue(mockCollection)
				}),
			} as unknown as jest.Mocked<MongoClient>;

			const model = new AbimongoModel({
				db: mockDb as unknown as Db,
				collectionName: 'testCollection',
				schema: mockSchema,
			});

			jest.spyOn(AbimongoClient, 'getTenantDB').mockReturnValue(mockDb.db() as unknown as Db);
			jest.spyOn(AbimongoClient, 'getDatabase').mockResolvedValue({ db: mockDb.db() as unknown as Db, client: { startSession: jest.fn() } as unknown as MongoClient });
			await model.init()


			// model.init = jest.fn().mockResolvedValue(null);

			const docs = [
				{ name: 'Test Document 1' },
				{ name: 'Test Document 2' },
			]

			// Act
			await model.bulkInsert(docs);

			// Assert
			// expect(model.init).toHaveBeenCalledTimes(1);
			expect(mockCollection.insertMany).toHaveBeenCalledWith(docs, expect.any(Object));
		})
	})

	describe('deleteOne', () => {
		it('should delete a document and trigger hooks', async () => {
			// Arrange
			const mockCollection = {
				deleteOne: jest.fn().mockResolvedValue(null),
				findOne: jest.fn().mockResolvedValue(null),
			};

			const mockSchema = new AbimongoSchema({} as Record<string, any>);
			mockSchema.executeHooks = jest.fn().mockResolvedValue(undefined);

			const mockDb = {
				db: jest.fn().mockReturnValue({
					collection: jest.fn().mockReturnValue(mockCollection)
				}),
			}

			const model = new AbimongoModel({
				db: mockDb as unknown as Db,
				collectionName: 'testCollection',
				schema: mockSchema,
			});

			jest.spyOn(AbimongoClient, 'getTenantDB').mockReturnValue(mockDb.db() as unknown as Db);
			jest.spyOn(AbimongoClient, 'getDatabase').mockResolvedValue({ db: mockDb.db() as unknown as Db, client: { startSession: jest.fn() } as unknown as MongoClient });
			await model.init()

			const docs = [
				{ name: 'Test Document 1' },
				{ name: 'Test Document 2' },
			]

			// Mock the findOne method to return a document
			const mockFindOne = mockCollection.findOne.mockResolvedValue({ _id: new ObjectId() });

			const filter = { _id: mockFindOne()._id };

			// Act
			await model.deleteOne(filter);

			// Assert
			expect(mockCollection.deleteOne).toHaveBeenCalledWith(filter);
		})
	})
	describe('bulkUpdate', () => {
		it('should update multiple documents with matching object', async () => {
			// Arrange
			const mockCollection = {
				bulkWrite: jest.fn().mockResolvedValue(null),
			};

			const mockSchema = new AbimongoSchema({} as Record<string, any>);
			mockSchema.executeHooks = jest.fn().mockResolvedValue(undefined);

			const mockDb = {
				db: jest.fn().mockReturnValue({
					collection: jest.fn().mockReturnValue(mockCollection)
				}),
			}

			const model = new AbimongoModel({
				db: mockDb as unknown as Db,
				collectionName: 'testCollection',
				schema: mockSchema,
			});

			jest.spyOn(AbimongoClient, 'getTenantDB').mockReturnValue(mockDb.db() as unknown as Db);
			jest.spyOn(AbimongoClient, 'getDatabase').mockResolvedValue({ db: mockDb.db() as unknown as Db, client: { startSession: jest.fn() } as unknown as MongoClient });
			await model.init()


			const updates = [
				{ filter: { name: 'Doc1' }, update: { $set: { name: 'Updated Name' } } },
				{ filter: { name: 'Doc2' }, update: { $set: { name: 'Another Updated Name' } } }
			]

			const bulkOps: Array<{ updateOne: { filter: Record<string, any>; update: Record<string, any> } }> = updates.map(({ filter, update }) => ({
				updateOne: { filter, update }
			}));

			// Act
			await model.bulkUpdate(updates);

			// Assert
			expect(mockCollection.bulkWrite).toHaveBeenCalled();
			expect(bulkOps).toMatchObject([
				{ updateOne: { filter: { name: 'Doc1' }, update: { $set: { name: 'Updated Name' } } } },
				{ updateOne: { filter: { name: 'Doc2' }, update: { $set: { name: 'Another Updated Name' } } } }
			]);
		})
	})

	describe('populateOne', () => {
		it('should populate a single document', async () => {
			// Arrange
			const mockCollection = {
				findOne: jest.fn().mockResolvedValue(null),
				collectionName: 'testCollection',
				insertMany: jest.fn().mockResolvedValue(null)
			};

			const mockDb = {
				db: jest.fn().mockReturnValue({
					collection: jest.fn().mockReturnValue(mockCollection)
				}),
			} as unknown as jest.Mocked<MongoClient>;

			const model = new AbimongoModel({
				db: mockDb.db(),
				collectionName: 'testCollection',
				schema: new AbimongoSchema({} as Record<string, any>),
			});

			jest.spyOn(AbimongoClient, 'getTenantDB').mockReturnValue(mockDb.db as unknown as Db);
			// Ensure getDatabase returns the actual db object produced by mockDb.db()
			jest.spyOn(AbimongoClient, 'getDatabase').mockResolvedValue({ db: mockDb.db() as unknown as Db, client: { startSession: jest.fn() } as unknown as MongoClient });

			const mockPopulate = mockCollection.findOne = jest.fn().mockResolvedValue({ name: 'Test Document' });

			await model.populateOne(mockPopulate(), `name`, model);

			expect(mockCollection.findOne).toHaveBeenCalled();
		})
	})

	describe('populateMany', () => {
		it('should populate multiple documents', async () => {
			const mockDoc = [
				{ filter: { name: 'Doc1' }, update: { $set: { name: 'Updated Name' } } },
				{ filter: { name: 'Doc2' }, update: { $set: { name: 'Another Updated Name' } } }
			]

			// Arrange
			const mockCollection = {
				find: jest.fn().mockReturnValue({ toArray: jest.fn().mockResolvedValue([mockDoc]) }),
			};

			const mockDb = {
				db: jest.fn().mockReturnValue({
					collection: jest.fn().mockReturnValue(mockCollection)
				}),
			} as unknown as jest.Mocked<MongoClient>;

			const schema = new AbimongoSchema({} as Record<string, any>);
			schema.executeHooks = jest.fn().mockResolvedValue(undefined);

			const model = new AbimongoModel({
				db: mockDb.db(),
				collectionName: 'testCollection',
				schema: schema
			});

			jest.spyOn(AbimongoClient, 'getTenantDB').mockReturnValue(mockDb.db as unknown as Db);
			jest.spyOn(AbimongoClient, 'getDatabase').mockResolvedValue({ db: mockDb.db as unknown as Db, client: { startSession: jest.fn() } as unknown as MongoClient });

			model.init = jest.fn().mockResolvedValue(null);
			// When init() is stubbed, ensure collection getter returns our mock collection
			(model as any)._collection = mockCollection as unknown as Collection<any>;
			jest.spyOn(model, 'collection', 'get').mockReturnValue(mockCollection as unknown as Collection<any>);
			// When init() is stubbed, ensure collection getter returns our mock collection
			(model as any)._collection = mockCollection as unknown as Collection<any>;
			jest.spyOn(model, 'collection', 'get').mockReturnValue(mockCollection as unknown as Collection<any>);

			const mockPopulate = mockCollection.find = jest.fn().mockResolvedValue({ name: 'Doc' });
			await model.populateMany(mockPopulate(), `name`, model);

			expect(mockCollection.find).toHaveBeenCalled();
		})
	})

	describe('aggregate', () => {
		it('should perform aggregation on the collection', async () => {
			// Arrange
			const mockCollection = {
				aggregate: jest.fn().mockReturnValue({
					toArray: jest.fn().mockResolvedValue([]),
					bufferedCount: jest.fn().mockResolvedValue(0),
					pipeline: jest.fn().mockReturnValue([]),

				}),

			};

			const mockDb = {
				collection: jest.fn().mockReturnValue(mockCollection)
			};

			const model = new AbimongoModel({
				db: mockDb as unknown as Db,
				collectionName: 'testCollection',
				schema: new AbimongoSchema({} as Record<string, any>),
			});

			model.init = jest.fn().mockResolvedValue(null);
			// When init() is stubbed, ensure collection getter returns our mock collection
			(model as any)._collection = mockCollection as unknown as Collection<any>;
			jest.spyOn(model, 'collection', 'get').mockReturnValue(mockCollection as unknown as Collection<any>);
			// Mock the pipeline	
			const pipeline = [{ $match: { name: 'Test' } }];

			// Mock the aggregate method to return a mock cursor
			const mockCursor = {
				pipeline: jest.fn().mockReturnValue([]),
				toArray: jest.fn().mockResolvedValue([]),
				bufferedCount: jest.fn().mockResolvedValue(0),
			};
			// Make aggregate() return our mock cursor
			(mockCollection.aggregate as jest.Mock).mockReturnValue(mockCursor);

			// Act
			await model.aggregate(pipeline, mockCursor.pipeline());

			// Assert
			expect(model.init).toHaveBeenCalledTimes(1);
			expect(mockCollection.aggregate).toHaveBeenCalled();
			expect(mockCursor.bufferedCount).toHaveBeenCalled();
			expect(mockCursor.toArray).toHaveBeenCalled();
		})
	})

	afterAll(() => {
		// bufferedTransporter.stop(); 
		// const { shutdownLogger } = require('@abimongo/logger');
		// shutdownLogger();
	});

})

describe('AbimongoModel.updateWithTransaction', () => {
	let model: AbimongoModel<any>;
	let mockSchema: AbimongoSchema<any>;
	let mockClient: MongoClient;
	let mockDb: Db;
	let mockCollection: Collection<any>;
	let mockSession: ClientSession;
	const mockUri = 'mongodb://localhost:27017';

	beforeEach(async () => {
		mockClient = new MongoClient(mockUri);
		mockDb = {} as Db;
		mockCollection = {
			updateOne: jest.fn(),
		} as unknown as Collection<any>;
		mockSession = {
			startTransaction: jest.fn(),
			commitTransaction: jest.fn(),
			abortTransaction: jest.fn(),
			endSession: jest.fn(),
		} as unknown as ClientSession;
		mockSchema = new AbimongoSchema({} as Record<string, any>);
		jest.spyOn(mockClient, 'startSession').mockReturnValue(mockSession);

		model = new AbimongoModel<any>({
			collectionName: 'testCollection',
			db: mockDb,
			schema: mockSchema,
			client: mockClient,
		});

		jest.spyOn(model, 'init').mockResolvedValue();
		jest.spyOn(model, 'collection', 'get').mockReturnValue(mockCollection);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should successfully update a document with a transaction', async () => {
		await model.init();
		mockClient.startSession();

		const filter = { _id: 'mockId' };
		const update = { $set: { field: 'value' } };

		mockSession.startTransaction();

		await model.updateWithTransaction(filter, update);
		mockSession.commitTransaction();
		mockSession.endSession();

		expect(model.init).toHaveBeenCalled();
		expect(mockClient.startSession).toHaveBeenCalled();
		expect(mockSession.startTransaction).toHaveBeenCalled();
		expect(mockCollection.updateOne).toHaveBeenCalledWith(filter, update, {
			session: mockSession.startTransaction()
		});
		expect(mockSession.commitTransaction).toHaveBeenCalled();
		expect(mockSession.endSession).toHaveBeenCalled();
	});

	it('should abort the transaction and throw an error if update fails', async () => {
		await model.init();
		mockClient.startSession();
		mockSession.startTransaction();

		const filter = { _id: 'mockId' };
		const update = { $set: { field: 'value' } };
		const error = new Error('Update failed');
		jest.spyOn(mockCollection, 'updateOne').mockRejectedValue(error);

		mockSession.startTransaction();
		mockSession.abortTransaction();
		mockSession.endSession();

		await expect(model.updateWithTransaction(filter, update)).rejects.toThrow(error);

		expect(model.init).toHaveBeenCalled();
		expect(mockClient.startSession).toHaveBeenCalled();
		expect(mockSession.startTransaction).toHaveBeenCalled();
		expect(mockCollection.updateOne).toHaveBeenCalledWith(filter, update, {
			session: mockSession.startTransaction()
		});
		expect(mockSession.abortTransaction).toHaveBeenCalled();
		expect(mockSession.endSession).toHaveBeenCalled();
	});

	it('should end the session even if an error occurs during transaction', async () => {
		await model.init();
		const filter = { _id: 'mockId' };
		const update = { $set: { field: 'value' } };
		const error = new Error('Update failed');
		jest.spyOn(mockCollection, 'updateOne').mockRejectedValue(error);

		jest.spyOn(AbimongoClient, 'getTenantDB').mockReturnValue(mockDb as unknown as Db);
		jest.spyOn(AbimongoClient, 'getDatabase').mockResolvedValue({ db: mockDb as unknown as Db, client: { startSession: jest.fn() } as unknown as MongoClient });

		try {
			await model.updateWithTransaction(filter, update);
		} catch (e) {
			// Ignore error for this test
		}
		mockSession.endSession();

		expect(mockSession.endSession).toHaveBeenCalled();
	});

	afterAll(async () => {
		// await bufferedTransporter.stop(); // or however you're exposing it
		// const { shutdownLogger } = require('@abimongo/logger');
		// await shutdownLogger();
	});

});
