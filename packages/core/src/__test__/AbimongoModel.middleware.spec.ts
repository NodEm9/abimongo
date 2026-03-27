import type {
	Collection,
	Db,
	Document,
	Filter,
	UpdateFilter
} from 'mongodb';
import { AbimongoModel, AbimongoSchema } from '../lib-core/index.js';
import type { DbProvider, ModelContext } from '../types/index.js';
import { MultiTenantManager } from '../tanancy/index.js';

type UserDoc = Document & {
	_id?: any;
	name?: string;
	deleted?: boolean;
	role?: string;
	updatedAt?: Date;
};

describe('AbimongoModel middleware', () => {
	let mockCollection: jest.Mocked<Partial<Collection<UserDoc>>>;
	let mockDb: jest.Mocked<Partial<Db>>;
	let mockProvider: DbProvider;
	let model: AbimongoModel<UserDoc>;

	beforeEach(() => {
		mockCollection = {
			find: jest.fn(),
			findOne: jest.fn(),
			insertOne: jest.fn(),
			updateOne: jest.fn(),
			deleteOne: jest.fn(),
			deleteMany: jest.fn(),
			findOneAndUpdate: jest.fn(),
			aggregate: jest.fn()
		};

		mockDb = {
			collection: jest.fn().mockReturnValue(mockCollection)
		};

		mockProvider = {
			db: jest.fn().mockResolvedValue(mockDb as Db)
		};

		model = new AbimongoModel<UserDoc>({
			collectionName: 'users',
			provider: mockProvider,
			schema: new AbimongoSchema<UserDoc>({} as any)
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('beforeFind should mutate filter', async () => {
		const toArray = jest.fn().mockResolvedValue([
			{ _id: '1', name: 'Alice', deleted: false }
		]);

		mockCollection.find = jest.fn().mockReturnValue({ toArray } as any);

		model.beforeFind((ctx) => {
			ctx.filter = {
				...(ctx.filter ?? {}),
				deleted: false
			} as Filter<UserDoc>;
		});

		const result = await model.find({ name: 'Alice' });

		expect(mockCollection.find).toHaveBeenCalledWith(
			{ name: 'Alice', deleted: false },
			undefined
		);

		expect(result).toEqual([
			{ _id: '1', name: 'Alice', deleted: false }
		]);
	});

	it('afterFind should mutate result', async () => {
		const toArray = jest.fn().mockResolvedValue([
			{ _id: '1', name: 'Alice' }
		]);

		mockCollection.find = jest.fn().mockReturnValue({ toArray } as any);

		model.afterFind((ctx) => {
			ctx.result = (ctx.result ?? []).map((doc: any) => ({
				...doc,
				tagged: true
			}));
		});

		const result = await model.find({});

		expect(result).toEqual([
			{ _id: '1', name: 'Alice', tagged: true }
		]);
	});

	it('beforeSave should mutate doc in create', async () => {
		mockCollection.insertOne = jest.fn().mockResolvedValue({
			insertedId: 'abc123'
		} as any);

		model.beforeSave((ctx) => {
			ctx.doc = {
				...(ctx.doc ?? {}),
				role: 'user'
			};
		});

		const result = await model.create({ name: 'Bob' });

		expect(mockCollection.insertOne).toHaveBeenCalledWith(
			{ name: 'Bob', role: 'user' },
			undefined
		);

		expect(result).toEqual({
			_id: 'abc123',
			name: 'Bob',
			role: 'user'
		});
	});

	it('beforeUpdateOne should mutate update payload', async () => {
		mockCollection.updateOne = jest.fn().mockResolvedValue({
			acknowledged: true,
			matchedCount: 1,
			modifiedCount: 1,
			upsertedCount: 0,
			upsertedId: null
		} as any);

		model.beforeUpdateOne((ctx) => {
			ctx.update = {
				...(ctx.update ?? {}),
				$set: {
					...((ctx.update as any)?.$set ?? {}),
					updatedAt: new Date('2026-03-19T10:00:00.000Z')
				}
			} as UpdateFilter<UserDoc>;
		});

		await model.updateOne(
			{ name: 'Bob' },
			{ $set: { role: 'admin' } }
		);

		expect(mockCollection.updateOne).toHaveBeenCalledWith(
			{ name: 'Bob' },
			{
				$set: {
					role: 'admin',
					updatedAt: new Date('2026-03-19T10:00:00.000Z')
				}
			},
			undefined
		);
	});

	it('afterDeleteOne should receive deleted payload in middleware result', async () => {
		mockCollection.findOne = jest.fn().mockResolvedValue({
			_id: '1',
			name: 'Alice'
		} as any);

		mockCollection.deleteOne = jest.fn().mockResolvedValue({
			acknowledged: true,
			deletedCount: 1
		} as any);

		const afterDelete = jest.fn();

		model.afterDeleteOne((ctx) => {
			afterDelete(ctx.result);
		});

		await model.deleteOne({ name: 'Alice' });

		expect(afterDelete).toHaveBeenCalledWith({
			_id: '1',
			name: 'Alice'
		});
	});

	it('beforeAggregate should prepend pipeline stage', async () => {
		const toArray = jest.fn().mockResolvedValue([
			{ _id: '1', name: 'Alice', deleted: false }
		]);

		mockCollection.aggregate = jest.fn().mockReturnValue({
			toArray,
			bufferedCount: jest.fn().mockReturnValue(0)
		} as any);

		model.beforeAggregate((ctx) => {
			ctx.pipeline = [
				{ $match: { deleted: false } },
				...(ctx.pipeline ?? [])
			];
		});

		const result = await model.aggregate([
			{ $match: { role: 'admin' } }
		]);

		expect(mockCollection.aggregate).toHaveBeenCalledWith(
			[
				{ $match: { deleted: false } },
				{ $match: { role: 'admin' } }
			],
			{}
		);

		expect(result).toEqual([
			{ _id: '1', name: 'Alice', deleted: false }
		]);
	});

	it('findOneAndUpdate middleware should mutate query and result', async () => {
		mockCollection.findOneAndUpdate = jest.fn().mockResolvedValue({
			_id: '1',
			name: 'Alice',
			role: 'admin'
		} as any);

		model.beforeFindOneAndUpdate((ctx) => {
			ctx.filter = {
				...(ctx.filter ?? {}),
				deleted: false
			} as Filter<UserDoc>;
		});

		model.afterFindOneAndUpdate((ctx) => {
			ctx.result = {
				...(ctx.result ?? {}),
				touchedByMiddleware: true
			};
		});

		const result = await model.findOneAndUpdate(
			{ name: 'Alice' },
			{ $set: { role: 'admin' } }
		);

		expect(mockCollection.findOneAndUpdate).toHaveBeenCalledWith(
			{ name: 'Alice', deleted: false },
			{ $set: { role: 'admin' } },
			{ returnDocument: 'after' }
		);

		expect(result).toEqual({
			_id: '1',
			name: 'Alice',
			role: 'admin',
			touchedByMiddleware: true
		});
	});

	it('should run before middleware in registration order', async () => {
		const order: string[] = [];
		const toArray = jest.fn().mockResolvedValue([]);

		mockCollection.find = jest.fn().mockReturnValue({ toArray } as any);

		model.beforeFind(() => {
			order.push('first');
		});

		model.beforeFind(() => {
			order.push('second');
		});

		await model.find({});

		expect(order).toEqual(['first', 'second']);
	});

	it('should expose merged model context to middleware', async () => {
		const toArray = jest.fn().mockResolvedValue([]);
		mockCollection.find = jest.fn().mockReturnValue({ toArray } as any);

		jest.spyOn(MultiTenantManager, 'getTenant').mockReturnValue({
			tenantId: 'tenantA',
			dbName: 'main_db'
		} as any);

		jest.spyOn(MultiTenantManager, 'getClient').mockResolvedValue({
			db: jest.fn().mockReturnValue(mockDb)
		} as any);

		const seen: any[] = [];

		model.beforeFind((ctx) => {
			seen.push({
				tenantId: ctx.tenantId,
				dbName: ctx.dbName
			});
		});

		await model.find({}, { tenantId: 'tenantA', dbName: 'main_db' });

		expect(seen).toEqual([
			{ tenantId: 'tenantA', dbName: 'main_db' }
		]);
	});

	it('should expose merged model context to middleware', async () => {
		const toArray = jest.fn().mockResolvedValue([]);
		mockCollection.find = jest.fn().mockReturnValue({ toArray } as any);

		const seen: any[] = [];

		model.beforeFind((ctx) => {
			seen.push({
				dbName: ctx.dbName,
				session: ctx.session
			});
		});

		const fakeSession = { id: 'session-1' } as any;

		await model.find(
			{},
			{
				db: mockDb as Db,
				dbName: 'main_db',
				session: fakeSession
			}
		);

		expect(seen).toEqual([
			{
				dbName: 'main_db',
				session: fakeSession
			}
		]);
	});
});