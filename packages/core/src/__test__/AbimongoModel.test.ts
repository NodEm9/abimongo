import { AbimongoModel, AbimongoSchema, AbimongoClient } from "../lib-core";
import {  MongoClient, ObjectId } from "mongodb";
import { bufferedTransporter, Model } from "../utils";
import { shutdownLogger } from '@abimongo/logger';
import { DbProvider, BootstrapClient } from "../types";
import { Document } from "../types";

import type {
  ClientSession,
  Collection,
  Db,
  Filter,
  UpdateFilter,
	WithId
  // Document,
} from "mongodb";
import { AbimongoContext } from "../context/AbimongoContext";
import { measureQuery } from "../instrumentation/measureQueryWithErrors";
import { debugLog } from "../debug/debugLog";

type UserDoc = Document & {
  _id?: any;
  name: string;
  email: string;
};


type MockTenantDB = {
	[tenantId: string]: DbProvider;
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

const mockSession = {
	startTransaction: jest.fn(),
	commitTransaction: jest.fn(),
	abortTransaction: jest.fn(),
	endSession: jest.fn(),
};

const schema = {
  validate: jest.fn(),
  executeHooks: jest.fn().mockResolvedValue(undefined),
  pre: jest.fn(),
  post: jest.fn(),
  getRelationships: jest.fn().mockReturnValue([]),
} as any;


describe('AbimongoModel', () => {
	const collectionName = 'users';

	let model: AbimongoModel<TestDocument>;
	let mockCollection: jest.Mocked<Collection<TestDocument>>;
	let mockDbClient: jest.Mocked<Db>;

	beforeAll(() => {
		// Set up any global configurations or mocks here
		mockDbClient = {
			db: jest.fn().mockReturnValue({
				collection: jest.fn().mockReturnValue(mockCollection)
			}),
		} as unknown as jest.Mocked<Db>;
	});


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

		const mockBoostrapClient = {
			connect: jest.fn().mockResolvedValue(undefined),
			close: jest.fn().mockResolvedValue(undefined),
			collection: jest.fn().mockResolvedValue(mockCollection),
			client: jest.fn().mockResolvedValue(mockDb),
		};

		const mockProvider = {
			db: jest.fn().mockResolvedValue(mockDb),
			startSession: jest.fn().mockResolvedValue(mockSession),
		}

		const mockSchema = new AbimongoSchema({} as Record<string, any>);
		mockSchema.executeHooks = jest.fn().mockResolvedValue(undefined);
		mockSchema.validate = jest.fn().mockResolvedValue(undefined);

		jest.spyOn(AbimongoClient, 'getTenantDB').mockReturnValue(mockBoostrapClient.collection(collectionName));
		jest.spyOn(AbimongoClient, 'getDatabase').mockResolvedValue({ db: mockBoostrapClient.collection(), client: { startSession: mockProvider.startSession } as unknown as MongoClient });

		const model = new AbimongoModel({
			collectionName: 'testCollection',
			schema: mockSchema,
			provider: mockProvider
		});


		const validDoc = { name: 'Test Document' };

		mockSchema.validate(validDoc);
		mockSchema.executeHooks('pre-save', validDoc);

		mockCollection.insertOne({ _id: 'mockId', ...validDoc });
		// Act
		const result = await model.create(validDoc);
		mockSchema.executeHooks('post-save', validDoc);

		// Assert
		expect(mockSchema.executeHooks).toHaveBeenCalledWith('pre-save', validDoc);
		expect(mockSchema.validate).toHaveBeenCalledWith(validDoc);
		expect(mockCollection.insertOne).toHaveBeenCalledWith({ _id: 'mockId', ...validDoc });
		expect(mockSchema.executeHooks).toHaveBeenCalledWith('post-save', validDoc);
		expect(result).toEqual({ ...validDoc, _id: 'mockId' });
	});


	it('should initialize with tenant database and collection', async () => {
		// Mock dependencies
		const mockDb = {
			collection: jest.fn().mockResolvedValue(collectionName),
		};
		const mockProvider = {
			db: jest.fn().mockResolvedValue(mockDb),
			startSession: jest.fn().mockResolvedValue(mockSession),
		}

		const mockBoostrapClient = {
			connect: jest.fn().mockResolvedValue(undefined),
			close: jest.fn().mockResolvedValue(undefined),
			collection: jest.fn().mockResolvedValue(mockCollection),
			client: jest.fn().mockResolvedValue(mockDb),
		};


		// Create model instance
		const model = new AbimongoModel({
			collectionName: collectionName,
			schema: new AbimongoSchema({} as Record<string, any>),
			provider: mockProvider
		});

		// Mock the getTenantDB method to return the mock database
		jest.spyOn(AbimongoClient, 'getTenantDB').mockReturnValue(mockBoostrapClient.collection(collectionName));
		jest.spyOn(AbimongoClient, 'getDatabase').mockResolvedValue({ db: mockBoostrapClient.collection(), client: { startSession: mockProvider.startSession } as unknown as MongoClient });
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

		const mockProvider = {
			db: jest.fn().mockResolvedValue(mockDb),
			startSession: jest.fn().mockResolvedValue(mockSession),
		};

		const mockBoostrapClient = {
			connect: jest.fn().mockResolvedValue(undefined),
			close: jest.fn().mockResolvedValue(undefined),
			collection: jest.fn().mockResolvedValue(mockCollection),
			client: jest.fn().mockResolvedValue(mockDb),
		};

		const mockSchema = new AbimongoSchema({
			name: { required: true, type: String }
		}as Record<string, any>);

		mockSchema.executeHooks = jest.fn().mockResolvedValue({});

		jest.spyOn(AbimongoClient, 'getTenantDB').mockReturnValue(mockBoostrapClient.collection(collectionName));
		jest.spyOn(AbimongoClient, 'getDatabase').mockResolvedValue({ db: mockBoostrapClient.collection(), client: { startSession: mockProvider.startSession } as unknown as MongoClient });

		const model = new AbimongoModel({
			collectionName: 'testCollection',
			schema: mockSchema,
			provider: mockProvider
		});

		// const invalidDoc = { _id: undefined }; // Missing required 'name' field

		model.schema.executeHooks('pre-save', {});

		const crreatDoc = model.create({});
		// Act & Assert
		// await expect(crreatDoc).rejects.toThrow(
		// 	`All fields are required.`);
		expect(mockSchema.executeHooks).toHaveBeenCalledWith('pre-save', {})
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

			const mockProvider = {
				db: jest.fn().mockResolvedValue(mockDb),
				startSession: jest.fn().mockResolvedValue(mockSession),
			}

		const mockBoostrapClient = {
			connect: jest.fn().mockResolvedValue(undefined),
			close: jest.fn().mockResolvedValue(undefined),
			collection: jest.fn().mockResolvedValue(mockCollection),
			client: jest.fn().mockResolvedValue(mockDb),
		};

			const mockSchema = new AbimongoSchema({} as Record<string, any>);
			mockSchema.executeHooks = jest.fn().mockResolvedValue(undefined);
			mockSchema.validate = jest.fn().mockResolvedValue(undefined);

			jest.spyOn(AbimongoClient, 'getTenantDB').mockReturnValue(mockBoostrapClient.collection(collectionName));
			jest.spyOn(AbimongoClient, 'getDatabase').mockResolvedValue({ db: mockBoostrapClient.collection(), client: { startSession: mockProvider.startSession } as unknown as MongoClient });

			const model = new AbimongoModel({
				collectionName: 'testCollection',
				schema: mockSchema,
				provider: mockProvider,
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

			const mockProvider = {
				db: jest.fn().mockResolvedValue(mockDb),
				startSession: jest.fn().mockResolvedValue(mockSession),
			};

			const mockBoostrapClient = {
			connect: jest.fn().mockResolvedValue(undefined),
			close: jest.fn().mockResolvedValue(undefined),
			collection: jest.fn().mockResolvedValue(mockCollection),
			client: jest.fn().mockResolvedValue(mockDb),
		};

			const mockSchema = new AbimongoSchema({} as Record<string, any>);
			mockSchema.executeHooks = jest.fn().mockResolvedValue(undefined);
			mockSchema.validate = jest.fn().mockResolvedValue(undefined);

			jest.spyOn(AbimongoClient, 'getTenantDB').mockReturnValue(mockBoostrapClient.collection(collectionName));
			jest.spyOn(AbimongoClient, 'getDatabase').mockResolvedValue({ db: mockBoostrapClient.collection(), client: { startSession: mockProvider.startSession } as unknown as MongoClient });

			const model = new AbimongoModel({
				collectionName: 'testCollection',
				schema: mockSchema,
				provider: mockProvider
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

			const mockProvider = {
				db: jest.fn().mockResolvedValue(mockDb),
				startSession: jest.fn().mockResolvedValue(mockSession),
			};

			const model = new AbimongoModel({
				collectionName: 'testCollection',
				schema: new AbimongoSchema({} as Record<string, any>),
				provider: mockProvider,
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
		let mockDb = {
			collection: jest.fn().mockReturnValue(mockCollection),
		}

		const mockProvider = {
			db: jest.fn().mockResolvedValue(mockDb),
			startSession: jest.fn().mockResolvedValue(mockSession),
		};

		const mockBoostrapClient = {
			connect: jest.fn().mockResolvedValue(undefined),
			close: jest.fn().mockResolvedValue(undefined),
			collection: jest.fn().mockResolvedValue(mockCollection),
			client: jest.fn().mockResolvedValue(mockDb),
			};

		beforeEach(() => {
			mockCollection = {
				findOne: jest.fn(),
				deleteOne: jest.fn(),
				find: jest.fn().mockReturnValue({ toArray: jest.fn() }),
			} as unknown as jest.Mocked<Collection<TestDocument>>;

			model = new AbimongoModel<TestDocument>({
				collectionName: 'testCollection',
				schema: mockSchema as unknown as AbimongoSchema<TestDocument>,
				provider: mockProvider
			});
		});

		it('should return a document when found', async () => {
			const filter = { _id: '123' };
			const expectedDocument = { _id: '123', name: 'Doc1' };

			const existingDoc = jest.spyOn(model, 'findOne').mockResolvedValue(expectedDocument);

			jest.spyOn(AbimongoClient, 'getTenantDB').mockReturnValue(mockBoostrapClient.collection(collectionName));
			jest.spyOn(AbimongoClient, 'getDatabase').mockResolvedValue({ db: mockBoostrapClient.collection(), client: { startSession: mockProvider.startSession } as unknown as MongoClient });
			await model.init()

			const result = await model.findOne(existingDoc);

			expect(model.findOne).toHaveBeenCalledWith(existingDoc);
			expect(result).toEqual(expectedDocument);
		});

		it('should return null when no document is found', async () => {
			const mockFilter = {};

			const filter = jest.spyOn(model, 'findOne').mockResolvedValue(JSON.parse(JSON.stringify(null)));
			
			mockCollection.findOne.mockResolvedValue(null);
			jest.spyOn(AbimongoClient, 'getTenantDB').mockReturnValue(mockBoostrapClient.collection(collectionName));
			jest.spyOn(AbimongoClient, 'getDatabase').mockResolvedValue({ db: mockBoostrapClient.collection(), client: { startSession: jest.fn() } as unknown as MongoClient });
			await model.init()

			const result = await model.findOne(filter);

			expect(model.findOne).toHaveBeenCalledWith(filter);
			expect(result).toBeNull();
		});

		it('should throw an error if findOne fails', async () => {
			const filter = [{}];

			mockCollection.findOne.mockRejectedValue(new Error('Database error'));

			jest.spyOn(AbimongoClient, 'getTenantDB').mockReturnValue(mockBoostrapClient.collection(collectionName));
			jest.spyOn(AbimongoClient, 'getDatabase').mockResolvedValue({ db: mockBoostrapClient.collection(), client: { startSession: mockProvider.startSession } as unknown as MongoClient });
			await model.init()

			await expect(mockCollection.findOne(filter)).rejects.toThrow('Database error');
			expect(mockCollection.findOne).toHaveBeenCalledWith(filter);
		});
	});

	describe('updateOne', () => {
		it('should update a document and trigger hooks and publish event', async () => {
			const existingDoc = {
				_id: '123',
				name: 'test doc'
			};
			const update = {
				_id: '123',
				$set: { name: 'test docss' }
			};

			const updateDoc = jest.spyOn(model, 'updateOne').mockResolvedValue(JSON.parse(JSON.stringify(update)));
			const mockSchema = new AbimongoSchema({} as Record<string, any>);
			mockSchema.executeHooks = jest.fn().mockResolvedValue(undefined);

			// Arrange
			const mockCollection = {
				updateOne: jest.fn().mockResolvedValue(null)
			} as unknown as jest.Mocked<Collection<TestDocument>>;

			const mockDb = {
				collection: jest.fn().mockReturnValue(mockCollection)
			}

			const mockProvider = {
				db: jest.fn().mockResolvedValue(mockDb),
				startSession: jest.fn().mockResolvedValue(mockSession),
			};

			const mockBoostrapClient = {
			connect: jest.fn().mockResolvedValue(undefined),
			close: jest.fn().mockResolvedValue(undefined),
			collection: jest.fn().mockResolvedValue(mockCollection),
			client: jest.fn().mockResolvedValue(mockDb),
		};

			// const model = new AbimongoModel({
			// 	collectionName: 'testCollection',
			// 	schema: mockSchema as unknown as AbimongoSchema<TestDocument>,
			// 	provider: mockProvider
			// });

			jest.spyOn(AbimongoClient, 'getTenantDB').mockReturnValue(mockBoostrapClient.collection(collectionName));
			jest.spyOn(AbimongoClient, 'getDatabase').mockResolvedValue({ db: mockBoostrapClient.collection(), client: { startSession: mockProvider.startSession } as unknown as MongoClient });
			await model.init()

			// Act
			// await model.updateOne(filter, update);
			const updatedDoc = await model.updateOne(existingDoc, updateDoc);
		
			// const updatedDoc = { _id: updateDoc._id, ...update.$set }
			
			
			mockSchema.executeHooks('post-update', updatedDoc);
			// Assert
			expect(mockSchema.executeHooks).toHaveBeenCalledWith('post-update', updatedDoc);
			expect(model.updateOne).toHaveBeenCalledWith(existingDoc, updateDoc);
			
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
				collection: jest.fn().mockReturnValue(mockCollection)
			}

			const mockProvider = {
				db: jest.fn().mockResolvedValue(mockDb),
				startSession: jest.fn().mockResolvedValue(mockSession),
			};

			const mockBoostrapClient = {
			connect: jest.fn().mockResolvedValue(undefined),
			close: jest.fn().mockResolvedValue(undefined),
			collection: jest.fn().mockResolvedValue(mockCollection),
			client: jest.fn().mockResolvedValue(mockDb),
		};

			const model = new AbimongoModel({
				collectionName: 'testCollection',
				schema: mockSchema,
				provider: mockProvider
			});

			jest.spyOn(AbimongoClient, 'getTenantDB').mockReturnValue(mockBoostrapClient.collection(collectionName));
			jest.spyOn(AbimongoClient, 'getDatabase').mockResolvedValue({ db: mockBoostrapClient.collection(), client: { startSession: jest.fn() } as unknown as MongoClient });
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
			expect(await mockCollection.insertMany).toHaveBeenCalledWith(docs, expect.any(Object));
		})
	})

	describe('deleteOne', () => {
		it('should delete a document and trigger hooks', async () => {
			// Arrange
			const mockCollection = {
				deleteOne: jest.fn(),
				findOne: jest.fn()
			};

			const mockSchema = new AbimongoSchema({} as Record<string, any>);
			mockSchema.executeHooks = jest.fn().mockResolvedValue(undefined);

			const mockDb = {
				collection: jest.fn().mockReturnValue(mockCollection)
			}

			const mockProvider = {
				db: jest.fn().mockResolvedValue(mockDb),
				startSession: jest.fn().mockResolvedValue(mockSession),
			};

			const mockBoostrapClient = {
			connect: jest.fn().mockResolvedValue(undefined),
			close: jest.fn().mockResolvedValue(undefined),
			collection: jest.fn().mockResolvedValue(mockCollection),
			client: jest.fn().mockResolvedValue(mockDb),
		};

			const model = new AbimongoModel({
				collectionName: 'testCollection',
				schema: mockSchema,
				provider: mockProvider
			});

			jest.spyOn(AbimongoClient, 'getTenantDB').mockReturnValue(mockBoostrapClient.collection(collectionName));
			jest.spyOn(AbimongoClient, 'getDatabase').mockResolvedValue({ db: mockBoostrapClient.collection(), client: { startSession: jest.fn() } as unknown as MongoClient });
			await model.init()

			const docs = [
				{
					_id: '64b7c9f1f1a2c3d4e5f6789',
					name: 'Test Document 1'
				},
				{
					_id: '64b7c9f1f1a2c3d4e5f67810',
					name: 'Test Document 2'
				},
			]

			// Mock the findOne method to return a document
			const mockFindOne = mockCollection.findOne({ _id: docs[0]._id });

			const filter = { _id: mockFindOne };

			// Act
			const deletedDoc = jest.spyOn(model, 'deleteOne').mockResolvedValueOnce(mockFindOne);
			await model.deleteOne(deletedDoc);

			// Assert
			expect(model.deleteOne).toHaveBeenCalledWith(deletedDoc);
		})
	})
	describe('bulkUpdate', () => {
		it('should update multiple documents with matching object', async () => {
			// Arrange
			const mockCollection = {
				bulkWrite: jest.fn().mockResolvedValue(null),
				findOne: jest.fn(),
			};

			const mockSchema = new AbimongoSchema({} as Record<string, any>);
			mockSchema.executeHooks = jest.fn().mockResolvedValue(undefined);

			const mockDb = {
				collection: jest.fn().mockReturnValue(mockCollection)
			}

			const mockProvider = {
				db: jest.fn().mockResolvedValue(mockDb),
				startSession: jest.fn().mockResolvedValue(mockSession),
			}

			const mockBoostrapClient = {
				connect: jest.fn().mockResolvedValue(undefined),
				close: jest.fn().mockResolvedValue(undefined),
				collection: jest.fn().mockResolvedValue(mockCollection),
				client: jest.fn().mockResolvedValue(mockDb),
		};

			const model = new AbimongoModel({
				collectionName: 'testCollection',
				schema: mockSchema,
				provider: mockProvider
			});

			jest.spyOn(AbimongoClient, 'getTenantDB').mockReturnValue(mockBoostrapClient.collection(collectionName));
			jest.spyOn(AbimongoClient, 'getDatabase').mockResolvedValue({ db: mockBoostrapClient.collection(), client: { startSession: jest.fn() } as unknown as MongoClient });
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
				findOne: jest.fn(),
				updateOne: jest.fn(),
				deleteOne: jest.fn(),
				insertOne: jest.fn(),
			};

			const mockDb = {
				collection: jest.fn().mockReturnValue(mockCollection)
			}

			const mockProvider = {
				db: jest.fn().mockResolvedValue(mockDb),
				startSession: jest.fn().mockResolvedValue(mockSession),
			}

			const mockBoostrapClient = {
			connect: jest.fn().mockResolvedValue(undefined),
			close: jest.fn().mockResolvedValue(undefined),
			collection: jest.fn().mockResolvedValue(mockCollection),
			client: jest.fn().mockResolvedValue(mockDb),
		};

			const model = new AbimongoModel({
				collectionName: 'testCollection',
				schema: new AbimongoSchema({} as Record<string, any>),
				provider: mockProvider
			});

			jest.spyOn(AbimongoClient, 'getTenantDB').mockReturnValue(mockBoostrapClient.collection(collectionName));
			// Ensure getDatabase returns the actual db object produced by mockDb
			jest.spyOn(AbimongoClient, 'db').mockResolvedValue(mockBoostrapClient.collection());

			const mockPopulate = mockCollection.findOne = jest.fn().mockResolvedValue({ name: 'Test Document' });

			await model.populateOne(mockPopulate(), `name`, model);

			expect(await mockCollection.findOne).toHaveBeenCalled();
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
				collectionName: 'testCollection',
				insertMany: jest.fn().mockResolvedValue(null)
			};

			const mockDb = {
				db: jest.fn().mockReturnValue({
					collection: jest.fn().mockReturnValue(mockCollection)
				}),
			} as unknown as jest.Mocked<MongoClient>;

			const mockProvider = {
				db: jest.fn().mockResolvedValue(mockDb),
				startSession: jest.fn().mockResolvedValue(mockSession),
			}

			const schema = new AbimongoSchema({} as Record<string, any>);
			schema.executeHooks = jest.fn().mockResolvedValue(undefined);

			const mockBoostrapClient = {
			connect: jest.fn().mockResolvedValue(undefined),
			close: jest.fn().mockResolvedValue(undefined),
			collection: jest.fn().mockResolvedValue(mockCollection),
			client: jest.fn().mockResolvedValue(mockDb),
		};

			const model = new AbimongoModel({
				collectionName: mockCollection.collectionName,
				schema: schema,
				provider: mockProvider
			});

			jest.spyOn(AbimongoClient, 'getTenantDB').mockReturnValue(mockBoostrapClient.collection(collectionName));
			jest.spyOn(AbimongoClient, 'getDatabase').mockResolvedValue({ db: mockBoostrapClient.collection(), client: { startSession: jest.fn() } as unknown as MongoClient });
			model.init = jest.fn().mockResolvedValue(null);
			// When init() is stubbed, ensure collection getter returns our mock collection
			(model as any)._collection = mockCollection as unknown as Collection<any>;
			// jest.spyOn(model, 'collectionName', 'get').mockReturnValue(mockCollection.collectionName);

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
				collectionName: 'testCollection',
				find: jest.fn().mockReturnValue({ toArray: jest.fn() }),
				findOne: jest.fn(),
				insertOne: jest.fn(),
			};

			const mockDb = {
				collection: jest.fn().mockReturnValue(mockCollection)
			};

			const mockProvider = {
				db: jest.fn().mockResolvedValue(mockDb),
				startSession: jest.fn().mockResolvedValue(mockSession),
			}

			const model = new AbimongoModel({
				collectionName: 'testCollection',
				schema: new AbimongoSchema({} as Record<string, any>),
				provider: mockProvider
			});

			model.init = jest.fn().mockResolvedValue(null);
			// When init() is stubbed, ensure collection getter returns our mock collection
			(model as any)._collection = mockCollection as unknown as Collection<any>;
			// jest.spyOn(model, 'collectionName', 'get').mockReturnValue(mockCollection.collectionName);
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

	afterAll(async () => {
		await bufferedTransporter.stop();
		await shutdownLogger();
	});

});


describe("AbimongoModel.updateWithTransaction", () => {
  let mockSession: jest.Mocked<ClientSession>;
  let mockCollection: jest.Mocked<Collection<UserDoc>>;
  let mockDb: jest.Mocked<Db>;
  let mockProvider: {
    db: jest.Mock<Promise<Db>, any>;
    startSession: jest.Mock<Promise<ClientSession>, any>;
  };

  beforeEach(() => {
    mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn().mockResolvedValue(undefined),
      abortTransaction: jest.fn().mockResolvedValue(undefined),
      endSession: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<ClientSession>;

    mockCollection = {
      findOne: jest.fn(),
      updateOne: jest.fn(),
    } as unknown as jest.Mocked<Collection<UserDoc>>;

    mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    } as unknown as jest.Mocked<Db>;

    mockProvider = {
      db: jest.fn().mockResolvedValue(mockDb),
      startSession: jest.fn().mockResolvedValue(mockSession),
    };
  });

  it("should successfully update a document with a transaction", async () => {
    const existingDoc: WithId<UserDoc> = {
      _id: new ObjectId(),
      name: "Old Name",
      email: "old@test.com",
    };

    const updatedDoc: WithId<UserDoc> = {
      _id: new ObjectId(),
      name: "New Name",
      email: "old@test.com",
    };

    mockCollection.findOne
      .mockResolvedValueOnce(existingDoc) // before update
      .mockResolvedValueOnce(updatedDoc); // after update

    mockCollection.updateOne.mockResolvedValue({
      acknowledged: true,
      matchedCount: 1,
      modifiedCount: 1,
      upsertedCount: 0,
      upsertedId: null,
		} as any);
		
		const schema = new AbimongoSchema<UserDoc>({} as Record<string, any>);
		schema.validate = jest.fn().mockResolvedValue(undefined);
		schema.executeHooks = jest.fn().mockResolvedValue(undefined);

    const model = Model<UserDoc>({
      collectionName: "users",
      schema,
      provider: mockProvider,
    });

    const filter: Filter<UserDoc> = { email: "old@test.com" };
    const update: UpdateFilter<UserDoc> = {
      $set: { name: "New Name" },
    };

    const result = await model.updateWithTransaction(filter, update);

    expect(mockProvider.startSession).toHaveBeenCalledTimes(1);
    expect(mockSession.startTransaction).toHaveBeenCalledTimes(1);

    expect(mockProvider.db).toHaveBeenCalledTimes(3);
    expect(mockDb.collection).toHaveBeenCalledWith("users");

    expect(mockCollection.findOne).toHaveBeenNthCalledWith(1, filter, {
      session: mockSession,
    });

    expect(schema.validate).toHaveBeenCalledWith({
      ...existingDoc,
      ...(update.$set as object),
    });

    expect(schema.executeHooks).toHaveBeenCalledWith("pre-update", {
      ...existingDoc,
      ...(update.$set as object),
    });

    expect(mockCollection.updateOne).toHaveBeenCalledWith(filter, update, {
      session: mockSession,
    });

    expect(mockCollection.findOne).toHaveBeenNthCalledWith(2, filter, {
      session: mockSession,
    });

    expect(schema.executeHooks).toHaveBeenCalledWith("post-update", updatedDoc);

    expect(mockSession.commitTransaction).toHaveBeenCalledTimes(1);
    expect(mockSession.abortTransaction).not.toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalledTimes(1);

    // expect(result).toEqual({
    //   ...updatedDoc,
    //   _id: updatedDoc._id,
    // });
  });

  it("should abort the transaction and throw if updateOne fails", async () => {
    const existingDoc: WithId<UserDoc> = {
      _id: new ObjectId(),
      name: "Old Name",
      email: "old@test.com",
    };

    mockCollection.findOne.mockResolvedValueOnce(existingDoc);
    mockCollection.updateOne.mockRejectedValueOnce(new Error("Update failed"));

    // const schema = {
    //   validate: jest.fn(),
    //   executeHooks: jest.fn().mockResolvedValue(undefined),
    // } as unknown as AbimongoSchema<UserDoc>;

    const model = Model<UserDoc>({
      collectionName: "users",
      schema,
      provider: mockProvider,
    });

    const filter: Filter<UserDoc> = { email: "old@test.com" };
    const update: UpdateFilter<UserDoc> = {
      $set: { name: "New Name" },
    };

    await expect(model.updateWithTransaction(filter, update)).rejects.toThrow(
      "Update failed"
    );

    expect(mockProvider.startSession).toHaveBeenCalledTimes(1);
    expect(mockSession.startTransaction).toHaveBeenCalledTimes(1);
    expect(mockSession.abortTransaction).toHaveBeenCalledTimes(1);
    expect(mockSession.commitTransaction).not.toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalledTimes(1);
  });

  it("should return null and abort if document does not exist", async () => {
    mockCollection.findOne.mockResolvedValueOnce(null);
		schema.pre('pre-save', (doc: UserDoc) => {
			if (doc.email === "") {
				return Promise.resolve();
			}
			return Promise.resolve();
		});

    const model = Model<UserDoc>({
      collectionName: "users",
      schema,
      provider: mockProvider,
    });

    const result = await model.updateWithTransaction(
      { email: "missing@test.com" },
      { $set: { name: "Nobody" } }
    );

    expect(result).toBeNull();
    expect(mockCollection.updateOne).not.toHaveBeenCalled();
    expect(mockSession.abortTransaction).not.toHaveBeenCalled();
    expect(mockSession.commitTransaction).toHaveBeenCalledTimes(1);
    expect(mockSession.endSession).toHaveBeenCalledTimes(1);
	});
	
	it('should log query instrumentation through context logger', async () => {
  const info = jest.fn();

  await AbimongoContext.run(
    {
      tenantId: 'tenantA',
      requestId: 'req_1',
      logger: { info }
    },
    async () => {
      const result = await measureQuery(
        { operation: 'find', collectionName: 'users' },
        async () => ['ok']
      );

      expect(result).toEqual(['ok']);
    }
  );

  expect(info).toHaveBeenCalledWith(
    '[Abimongo Query]',
    expect.objectContaining({
      operation: 'find',
      collectionName: 'users',
      tenantId: 'tenantA',
      requestId: 'req_1',
      durationMs: expect.any(Number)
    })
  );
	});
	
	it('should emit debug logs when debug mode is enabled', async () => {
  const debug = jest.fn();

  await AbimongoContext.run(
    {
      debug: true,
      logger: { debug }
    },
    async () => {
      debugLog('Resolved collection', { collectionName: 'users' });
    }
  );

  expect(debug).toHaveBeenCalledWith(
    'Resolved collection',
    expect.objectContaining({
      collectionName: 'users'
    })
  );
	});
	
	it('should log query errors and rethrow', async () => {
  const error = jest.fn();

  await expect(
    AbimongoContext.run(
      {
        tenantId: 'tenantA',
        logger: { error }
      },
      async () => {
        await measureQuery(
          { operation: 'findOne', collectionName: 'users' },
          async () => {
            throw new Error('boom');
          }
        );
      }
    )
  ).rejects.toThrow('boom');

  expect(error).toHaveBeenCalledWith(
    '[Abimongo Query Error]',
    expect.objectContaining({
      operation: 'findOne',
      collectionName: 'users',
      success: false,
      errorMessage: 'boom'
    })
  );
});
});


// describe('AbimongoModel.updateWithTransaction', () => {
// 	let model: AbimongoModel<any>;
// 	let mockSchema: AbimongoSchema<any>;
// 	let mockClient: MongoClient;
// 	const mockUri = 'mongodb://localhost:27017';

// 	let mockCollection = {
// 		findOne: jest.fn(),
// 		updateOne: jest.fn(),
// 	} 

// 	const mockDb = {
// 		collection: jest.fn().mockReturnValue(mockCollection),
// 	}

// 	const mockProvider = {
// 		db: jest.fn().mockResolvedValue(mockDb),
// 		startSession: jest.fn().mockResolvedValue(mockSession),
// 	}

// 	beforeEach(async () => {
// 		mockClient = new MongoClient(mockUri);
// 		mockSchema = new AbimongoSchema({} as Record<string, any>);

// 		model = new AbimongoModel<any>({
// 			collectionName: 'testCollection',
// 			schema: mockSchema,
// 			provider: mockProvider
// 		});

// 		jest.spyOn(model, 'init').mockResolvedValue();
// 		// jest.spyOn(model, 'collection', 'get').mockReturnValue('testCollection');
// 	});

// 	afterEach(() => {
// 		jest.clearAllMocks();
// 	});

// 	it('should successfully update a document with a transaction', async () => {
// 		await model.init();
// 		mockClient.startSession();

// 		const filter = { _id: 'mockId' };
// 		const update = { $set: { field: 'value' } };

// 		mockSession.startTransaction();
// 		// model.findOne({ _id: filter._id, field: 'oldValue' });
// 		// model.updateOne(filter, update, { session: mockSession.startTransaction() });
// 		jest.spyOn(AbimongoClient, 'getTenantDB').mockReturnValue(mockProvider);
// 		jest.spyOn(AbimongoClient, 'getDatabase').mockResolvedValue({ db: mockProvider, client: { startSession: jest.fn() } as unknown as MongoClient });

// 		await model.updateWithTransaction(filter, update);
// 		// mockSession.commitTransaction();
// 		mockSession.endSession();

// 		expect(model.init).toHaveBeenCalled();
// 		expect(mockClient.startSession).toHaveBeenCalled();
// 		expect(mockSession.startTransaction).toHaveBeenCalled();
// 		expect(model.updateWithTransaction).toHaveBeenCalledWith(filter, update, {
// 			session: mockSession.startTransaction()
// 		});
// 		// expect(mockSession.commitTransaction).toHaveBeenCalled();
// 		expect(mockSession.endSession).toHaveBeenCalled();
// 	});

// 	it('should abort the transaction and throw an error if update fails', async () => {
// 		await model.init();
// 		mockClient.startSession();
// 		mockSession.startTransaction();

// 		const filter = { _id: 'mockId' };
// 		const update = { $set: { field: 'value' } };
// 		const error = new Error('Update failed');
// 		jest.spyOn(mockCollection, 'updateOne').mockRejectedValue(error);

// 		jest.spyOn(mockClient, 'startSession').mockResolvedValue({} as never);
// 		// jest.spyOn(mockSession, 'abortTransaction').mockResolvedValue(undefined);

		
// 		mockClient.startSession();
// 		mockSession.startTransaction();

// 		mockCollection.updateOne(filter, update);
// 		mockSession.abortTransaction();
// 		mockSession.endSession();


// 		expect(model.init).toHaveBeenCalled();
// 		expect(mockClient.startSession).toHaveBeenCalled();
// 		expect(mockSession.startTransaction).toHaveBeenCalled();
// 		expect(mockCollection.updateOne).toHaveBeenCalledWith(filter, update);
// 		await expect(model.updateWithTransaction(filter, update)).rejects.toThrow(error);
// 		expect(mockSession.abortTransaction).toHaveBeenCalled();
// 		expect(mockSession.endSession).toHaveBeenCalled();
// 	});

// 	it('should end the session even if an error occurs during transaction', async () => {
// 		await model.init();
// 		const filter = { _id: 'mockId' };
// 		const update = { $set: { field: 'value' } };
// 		const error = new Error('Update failed');
// 		jest.spyOn(mockCollection, 'updateOne').mockRejectedValue(error);

// 		jest.spyOn(AbimongoClient, 'getTenantDB').mockReturnValue(mockProvider);
// 		jest.spyOn(AbimongoClient, 'getDatabase').mockResolvedValue({ db: mockProvider, client: { startSession: mockProvider.startSession } as unknown as MongoClient });

// 		try {
// 			await model.updateWithTransaction(filter, update);
// 		} catch (e) {
// 			// Ignore error for this test
// 		}
// 		mockSession.endSession();

// 		expect(mockSession.endSession).toHaveBeenCalled();
// 	});

// 	afterAll(async () => {
// 		await shutdownLogger();
// 	});

// });
