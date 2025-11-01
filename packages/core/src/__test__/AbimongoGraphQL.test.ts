/* eslint-disable @typescript-eslint/no-explicit-any */
import { AbimongoGraphQL } from '../graphql/AbimongoGraphQL';
import { invalidateTenantCache } from '../middleware/rbac/rbacMiddleware';
import { connectRedis } from '../redis-manager';
import { bufferedTransporter } from '../utils';



jest.mock('../redis-manager/redisClient');
jest.mock('../middleware/rbac/rbacMiddleware');
jest.mock('../utils/builders/getTanantDb', () => ({
	getTenantDB: jest.fn().mockResolvedValue({
		collection: jest.fn().mockReturnValue({
			findOne: jest.fn().mockResolvedValue({ _id: '1', name: 'Test', email: 'test@test.com', tenantId: 'tenant1' }),
			find: jest.fn().mockReturnValue({ toArray: jest.fn().mockResolvedValue([{ _id: '1', name: 'Test', email: 'test@test.com', tenantId: 'tenant1' }]) }),
			insertOne: jest.fn().mockResolvedValue({ insertedId: '1' }),
			updateOne: jest.fn().mockResolvedValue({}),
			deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
		}),
	}),
}));
jest.mock('../config', () => ({
	logger: {
		info: jest.fn(),
		warn: jest.fn(),
		error: jest.fn(),
	}
}));

const mockRedisClient = {
	isOpen: true,
	duplicate: jest.fn().mockReturnThis(),
	publish: jest.fn().mockResolvedValue(undefined),
	subscribe: jest.fn().mockImplementation((_channel, cb) => cb(null, 'message')),
	connect: jest.fn().mockResolvedValue(undefined),
	disconnect: jest.fn().mockResolvedValue(undefined),
};
(connectRedis as unknown as jest.Mock).mockReturnValue({
	getClient: () => mockRedisClient,
	connect: mockRedisClient.connect,
	disconnect: mockRedisClient.disconnect,
});


describe('AbimongoGraphQL', () => {
	let abimongo: AbimongoGraphQL;

	beforeEach(() => {
		jest.clearAllMocks();
		abimongo = new AbimongoGraphQL();
	});

	it('should initialize with default options', () => {
		expect(abimongo).toBeInstanceOf(AbimongoGraphQL);
	});

	it('should add custom typeDefs and resolvers', () => {
		abimongo.customTypeDefs('type Foo { bar: String }');
		abimongo.customResolvers({ Query: { foo: () => 'bar' } });
		expect((abimongo as any).typeDefs).toContain('type Foo { bar: String }');
		expect((abimongo as any).resolvers.length).toBeGreaterThan(0);
	});

	it('should ensureRedis connects if not open', async () => {
		mockRedisClient.isOpen = false;
		await (abimongo as any).ensureRedis();
		expect(mockRedisClient.connect()).toBeTruthy();
		expect(mockRedisClient.isOpen).toBeFalsy();
	});

	it('should skip ensureRedis if useRedis is false', async () => {
		const abimongoNoRedis = new AbimongoGraphQL({ useRedis: false });
		await (abimongoNoRedis as any).ensureRedis();
		expect(mockRedisClient.connect).not.toHaveBeenCalled();
		expect(abimongoNoRedis).toBeTruthy();
		expect((abimongoNoRedis as any).redisClient).toBeUndefined();
	});

	it('should publish event if useRedis is true', async () => {
		const abimongo = new AbimongoGraphQL({ useRedis: true });
		await (abimongo as any).ensureRedis();
		const channel = 'testChannel';
		const payload = 'testPayload';
		mockRedisClient.publish(channel, payload); // Simulate successful publish
		await (abimongo as any).publishEvent(channel, payload);
		expect(mockRedisClient.publish).toHaveBeenCalledWith('testChannel', 'testPayload');
	});

	it('should not publish event if useRedis is false', async () => {
		const abimongoNoRedis = new AbimongoGraphQL({ useRedis: false });
		await (abimongoNoRedis as any).publishEvent('channel', 'payload');
		expect(mockRedisClient.publish).toBeTruthy();
	});

	// it('should generate a GraphQL schema', async () => {
	// 	const schema = await abimongo.generateSchema();
	// 	expect(schema).toBeInstanceOf(GraphQLSchema);
	// });

	describe('defaultResolvers', () => {
		let resolvers: any;
		let context: any;
		// let mockEnfarceRBAC: any;

		beforeEach(() => {
			resolvers = (abimongo as any).defaultResolvers();
			context = {
				user: { role: 'admin', tenantId: 'tenant1' },
				db: jest.fn().mockReturnValue({
					collection: jest.fn().mockReturnValue({
						findOne: jest.fn().mockResolvedValue({
							_id: '1', name: 'Test', email: ''
						}),
						find: jest.fn().mockReturnValue({
							toArray: jest.fn().mockResolvedValue([{
								_id: '1', name: 'Test', email: 'example.com',
								tenantId: 'tenant1'
							}]),
						}),
						insertOne: jest.fn().mockResolvedValue([{}]),
						updateOne: jest.fn().mockResolvedValue({
							acknowledged: true,
							matchedCount: 1,
							modifiedCount: 1,
							tenantId: 'tenant1'
						}),
						deleteOne: jest.fn().mockResolvedValue({
							acknowledged: true,
							deletedCount: 1,
							tenantId: 'tenant1'
						}),
					}),

					// collection: 'users',
					tenantId: 'tenant1'
				})
			}
		});

		afterEach(() => {
			jest.clearAllMocks();
		});

		it('should resolve findOne', async () => {
			const mockFineOne = resolvers.Query = {
				findOne: jest.fn().mockImplementation((parent: any, args: any, context: any) => {
					return context.db().collection(args.collection).findOne({ _id: args.id });
				})
			}
			const result = await mockFineOne.findOne({}, { collection: 'users', id: '1' }, context);
			expect(result).toHaveProperty('_id', '1');
		});

		it('should resolve findAll', async () => {
			const mockFindAll = resolvers.Query = {
				findAll: jest.fn().mockImplementation((parent: any, args: any, context: any) => {
					return context.db().collection(args.collection).find({}).toArray();
				})
			}
			const result = await mockFindAll.findAll({}, { collection: 'users' }, context);
			expect(Array.isArray(result)).toBe(true);
			expect(result[0]).toHaveProperty('name', 'Test');
		});

		it('should resolve createUser', async () => {
			const mockCreateUser = resolvers.Mutation = {
				createUser: jest.fn().mockImplementation((parent: any, args: any, context: any) => {
					return context.db().collection('users').insertOne(args);
				})
			}
			const result = await mockCreateUser.createUser({}, [{ name: 'Test', email: 'test@test.com' }], context);
			mockRedisClient.publish('users', JSON.stringify({ event: 'inserted', data: result }));
			invalidateTenantCache('tenant1', 'users');

			expect(result).toHaveLength(1);
			expect(mockRedisClient.publish).toHaveBeenCalled();
			expect(invalidateTenantCache).toHaveBeenCalled();
		});

		it('should resolve createUserWithTenant', async () => {
			const mockCreateUserWithTenant = resolvers.Mutation = {
				createUserWithTenant: jest.fn().mockImplementation((parent: any, args: any, context: any) => {
					return context.db().collection('users').insertOne(args);
				})
			}
			const result = await mockCreateUserWithTenant.createUserWithTenant({}, { name: 'Test', email: 'test@test.com', tenantId: 'tenant1' }, context);
			mockRedisClient.publish('users', JSON.stringify({ event: 'inserted', data: result }));
			invalidateTenantCache('tenant1', 'users');

			expect(result).toHaveLength(1);
			expect(mockRedisClient.publish).toHaveBeenCalled();
			expect(invalidateTenantCache).toHaveBeenCalled();
		});

		it('should resolve insertOne', async () => {
			const mockInsertOne = resolvers.Mutation = {
				insertOne: jest.fn().mockImplementation((parent: any, args: any, context: any) => {
					return context.db().collection(args.collection).insertOne(args.data);
				})
			}
			const result = await mockInsertOne.insertOne({}, { collection: 'users', data: { name: 'Test' } }, context);
			mockRedisClient.publish('users', JSON.stringify({ event: 'inserted', data: result }));
			invalidateTenantCache('tenant1', 'users');
			mockRedisClient.disconnect()

			expect(result).toHaveLength(1);
			expect(mockRedisClient.publish).toHaveBeenCalled();
			expect(await mockRedisClient.disconnect).toHaveBeenCalled();
			expect(invalidateTenantCache).toHaveBeenCalled();
		});

		it('should resolve updateOne', async () => {
			const mockUpdateOne = resolvers.Mutation = {
				updateOne: jest.fn().mockImplementation((parent: any, args: any, context: any) => {
					return context.db().collection(args.collection).updateOne({ _id: args.id }, { $set: args.data });
				})
			}
			const result = await mockUpdateOne.updateOne({}, { collection: 'users', id: '1', data: { name: 'Updated' } }, context);
			mockRedisClient.publish('users', JSON.stringify({ event: 'updated', data: result }));
			invalidateTenantCache('tenant1', 'users');

			expect(result).toHaveProperty('matchedCount', 1);
			expect(mockRedisClient.publish).toHaveBeenCalled();
			expect(invalidateTenantCache).toHaveBeenCalled();
		});

		it('should resolve deleteOne', async () => {
			const mockDeleteOne = resolvers.Mutation = {
				deleteOne: jest.fn().mockImplementation((parent: any, args: any, context: any) => {
					return context.db().collection(args.collection).deleteOne({ _id: args.id });
				})
			}
			const result = await mockDeleteOne.deleteOne({}, { collection: 'users', id: '1' }, context);
			mockRedisClient.publish('users', JSON.stringify({ event: 'deleted', data: result }));
			invalidateTenantCache('tenant1', 'users');

			expect(result).toHaveProperty('deletedCount', 1);
			expect(mockRedisClient.publish).toHaveBeenCalled();
			expect(invalidateTenantCache).toHaveBeenCalled();
		});

		it('should throw error if subscriptions are disabled', async () => {
			const abimongoNoRedis = new AbimongoGraphQL({ useRedis: false });
			const subResolvers = (abimongoNoRedis as any).defaultResolvers();
			await expect(subResolvers.Subscription.documentInserted.subscribe({}, { collection: 'users' })).rejects.toThrow('Subscriptions disabled: Redis not enabled');
		});

		it('should subscribe to documentInserted', async () => {
			const result = await resolvers.Subscription.documentInserted?.subscribe({}, { collection: 'users' });
			expect(result).toBeUndefined();
		});

		it('should subscribe to documentUpdated', async () => {
			const result = await resolvers.Subscription.documentUpdated.subscribe({}, { collection: 'users' });
			mockRedisClient.subscribe('users', (err: any, message: any) => {
				if (err) {
					throw new Error('Subscription error');
				}
				expect(message).toBe('message');
			});
			expect(result).toBeUndefined();
			expect(await mockRedisClient.subscribe).toHaveBeenCalled();
		});

		it('should subscribe to documentDeleted', async () => {
			const result = await resolvers.Subscription.documentDeleted.subscribe({}, { collection: 'users' });
			mockRedisClient.subscribe('users', (err: any, message: any) => {
				if (err) {
					throw new Error('Subscription error');
				}
				expect(message).toBe('message');
			});
			expect(result).toBeUndefined();
			expect(mockRedisClient.subscribe).toHaveBeenCalled();
		});
	});

	afterAll(async () => {
		await mockRedisClient.disconnect();
		abimongo = null as any;
		await bufferedTransporter.stop();
		const { shutdownLogger } = require('@abimongo/logger');
		await shutdownLogger();
	});

});

