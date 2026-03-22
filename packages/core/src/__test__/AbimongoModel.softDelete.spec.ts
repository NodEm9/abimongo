import type { Collection, Db, Document } from 'mongodb';
import { AbimongoModel, AbimongoSchema } from '../lib-core';
import { applySoftDelete } from '../plugins/softDelete/applySoftDelete';

type UserDoc = Document & {
	_id?: any;
	name?: string;
	deletedAt?: Date | null;
	isDeleted?: boolean;
};

describe('Abimongo soft delete', () => {
	let mockCollection: jest.Mocked<Partial<Collection<UserDoc>>>;
	let mockDb: jest.Mocked<Partial<Db>>;
	let model: AbimongoModel<UserDoc>;

	beforeEach(() => {
		mockCollection = {
			find: jest.fn(),
			findOne: jest.fn(),
			updateOne: jest.fn(),
			updateMany: jest.fn(),
			deleteOne: jest.fn(),
			deleteMany: jest.fn(),
			findOneAndDelete: jest.fn()
		};

		mockDb = {
			collection: jest.fn().mockReturnValue(mockCollection)
		};

		model = applySoftDelete(
			new AbimongoModel<UserDoc>({
				collectionName: 'users',
				provider: {
					db: jest.fn().mockResolvedValue(mockDb as Db)
				},
				schema: new AbimongoSchema<UserDoc>({} as any)
			})
		);
	});

	it('should exclude deleted docs by default in find', async () => {
		const toArray = jest.fn().mockResolvedValue([]);
		mockCollection.find = jest.fn().mockReturnValue({ toArray } as any);

		await model.find({ name: 'Alice' });

		expect(mockCollection.find).toHaveBeenCalledWith(
			expect.objectContaining({
				$and: expect.any(Array)
			}),
			undefined
		);

		const filterArg = (mockCollection.find as jest.Mock).mock.calls[0][0];

		expect(filterArg.$and).toEqual(
			expect.arrayContaining([
				{ name: 'Alice' },
				expect.objectContaining({
					$and: expect.any(Array)
				})
			])
		);
	});

	it('should include deleted docs when withDeleted is true', async () => {
		const toArray = jest.fn().mockResolvedValue([]);
		mockCollection.find = jest.fn().mockReturnValue({ toArray } as any);

		await model.find({ name: 'Alice' }, { withDeleted: true });

		expect(mockCollection.find).toHaveBeenCalledWith(
			{ name: 'Alice' },
			undefined
		);
	});

	it('should soft delete in deleteOne by updating flags', async () => {
		mockCollection.findOne = jest.fn().mockResolvedValue({
			_id: '1',
			name: 'Alice'
		} as any);

		mockCollection.updateOne = jest.fn().mockResolvedValue({
			acknowledged: true,
			modifiedCount: 1,
			matchedCount: 1
		} as any);

		await model.deleteOne({ _id: '1' } as any);

		expect(mockCollection.updateOne).toHaveBeenCalled();
		expect(mockCollection.deleteOne).not.toHaveBeenCalled();
	});

	it('should hard delete when hardDelete is true', async () => {
		mockCollection.findOne = jest.fn().mockResolvedValue({
			_id: '1',
			name: 'Alice'
		} as any);

		mockCollection.deleteOne = jest.fn().mockResolvedValue({
			acknowledged: true,
			deletedCount: 1
		} as any);

		await model.deleteOne({ _id: '1' } as any, { hardDelete: true });

		expect(mockCollection.deleteOne).toHaveBeenCalled();
		expect(mockCollection.updateOne).not.toHaveBeenCalled();
	});

	it('should restore a soft-deleted document', async () => {
		mockCollection.updateOne = jest.fn().mockResolvedValue({
			acknowledged: true,
			modifiedCount: 1,
			matchedCount: 1
		} as any);

		await model.restoreOne({ _id: '1' } as any);

		expect(mockCollection.updateOne).toHaveBeenCalledWith(
			{ _id: '1' },
			{
				$set: {
					deletedAt: null,
					isDeleted: false
				}
			},
			undefined
		);
	});

	it('should soft delete in findOneAndDelete by updating flags instead of deleting', async () => {
		mockCollection.findOne = jest.fn().mockResolvedValue({
			_id: '1',
			name: 'Alice'
		} as any);

		mockCollection.updateOne = jest.fn().mockResolvedValue({
			acknowledged: true,
			modifiedCount: 1,
			matchedCount: 1
		} as any);

		const result = await model.findOneAndDelete({ _id: '1' } as any);

		expect(mockCollection.updateOne).toHaveBeenCalled();
		expect(mockCollection.findOneAndDelete).not.toHaveBeenCalled();
		expect(result).toEqual({
			_id: '1',
			name: 'Alice'
		});
	});

	it('should hard delete in findOneAndDelete when hardDelete is true', async () => {
		mockCollection.findOne = jest.fn().mockResolvedValue({
			_id: '1',
			name: 'Alice'
		} as any);

		mockCollection.findOneAndDelete = jest.fn().mockResolvedValue({
			_id: '1',
			name: 'Alice'
		} as any);

		const result = await model.findOneAndDelete(
			{ _id: '1' } as any,
			{ hardDelete: true }
		);

		expect(mockCollection.findOneAndDelete).toHaveBeenCalled();
		expect(mockCollection.updateOne).not.toHaveBeenCalled();
		expect(result).toEqual({
			_id: '1',
			name: 'Alice'
		});
	});

	it('should exclude soft-deleted documents in findOneAndUpsert by default', async () => {
		mockCollection.findOneAndUpdate = jest.fn().mockResolvedValue({
			_id: '2',
			name: 'Bob'
		} as any);

		await model.findOneAndUpsert(
			{ name: 'Bob' } as any,
			{ $set: { name: 'Bob' } } as any
		);

		expect(mockCollection.findOneAndUpdate).toHaveBeenCalledWith(
			expect.objectContaining({
				$and: expect.any(Array)
			}),
			{ $set: { name: 'Bob' } },
			expect.objectContaining({
				upsert: true,
				returnDocument: 'after'
			})
		);
	});

	it('should prepend aggregate pipeline to exclude deleted docs by default', async () => {
		const toArray = jest.fn().mockResolvedValue([]);
		mockCollection.aggregate = jest.fn().mockReturnValue({
			toArray,
			bufferedCount: jest.fn().mockReturnValue(0)
		} as any);

		await model.aggregate([{ $match: { name: 'Alice' } }]);

		expect(mockCollection.aggregate).toHaveBeenCalledWith(
			[
				{ $match: expect.objectContaining({ $and: expect.any(Array) }) },
				{ $match: { name: 'Alice' } }
			],
			{}
		);
	});
});