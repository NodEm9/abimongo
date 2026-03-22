import type { Document, Filter, UpdateFilter } from 'mongodb';
import type { AbimongoModel } from '../../lib-core/AbimongoModelFactory';
import type { SoftDeleteOptions } from './types';

const DEFAULTS: Required<SoftDeleteOptions> = {
	field: 'deletedAt',
	deletedAtField: 'deletedAt',
	deletedByField: 'deletedBy',
	isDeletedField: 'isDeleted',
	enabled: true,
	excludeDeletedByDefault: true
};

function buildNotDeletedFilter<T extends Document>(
	options: Required<SoftDeleteOptions>
): Filter<T> {
	return {
		$and: [
			{
				$or: [
					{ [options.deletedAtField]: { $exists: false } },
					{ [options.deletedAtField]: null }
				]
			},
			{
				$or: [
					{ [options.isDeletedField]: { $exists: false } },
					{ [options.isDeletedField]: false }
				]
			}
		]
	} as Filter<T>;
}

function buildOnlyDeletedFilter<T extends Document>(
	options: Required<SoftDeleteOptions>
): Filter<T> {
	return {
		$or: [
			{ [options.deletedAtField]: { $ne: null } },
			{ [options.isDeletedField]: true }
		]
	} as Filter<T>;
}

function mergeFilter<T extends Document>(
	original: Filter<T> | undefined,
	extra: Filter<T>
): Filter<T> {
	if (!original || Object.keys(original).length === 0) {
		return extra;
	}

	return {
		$and: [original, extra]
	} as Filter<T>;
}

function buildSoftDeleteUpdate<T extends Document>(
	options: Required<SoftDeleteOptions>
): UpdateFilter<T> {
	return {
		$set: {
			[options.deletedAtField]: new Date(),
			[options.isDeletedField]: true
		} as Partial<T>
	} as UpdateFilter<T>;
}

export function applySoftDelete<T extends Document>(
	model: AbimongoModel<T>,
	opts: SoftDeleteOptions = {}
): AbimongoModel<T> {
	const options = { ...DEFAULTS, ...opts };

	if (!options.enabled) {
		return model;
	}

	const applyReadFilter = (ctx: { filter?: Filter<T>; meta?: Record<string, any> }) => {
		if (ctx.meta?.withDeleted === true) return;

		if (ctx.meta?.onlyDeleted === true) {
			ctx.filter = mergeFilter(ctx.filter, buildOnlyDeletedFilter<T>(options));
			return;
		}

		if (options.excludeDeletedByDefault) {
			ctx.filter = mergeFilter(ctx.filter, buildNotDeletedFilter<T>(options));
		}
	};

	model.beforeFind((ctx) => {
		applyReadFilter(ctx);
	});

	model.beforeFindOne((ctx) => {
		applyReadFilter(ctx);
	});

	model.beforeFindOneAndUpdate((ctx) => {
		applyReadFilter(ctx);
	});

	model.beforeFindOneAndReplace((ctx) => {
		applyReadFilter(ctx);
	});

	model.beforeFindOneAndUpsert((ctx) => {
		applyReadFilter(ctx);
	});

	model.beforeAggregate((ctx) => {
		if (ctx.meta?.withDeleted === true) return;

		const stage =
			ctx.meta?.onlyDeleted === true
				? { $match: buildOnlyDeletedFilter<T>(options) }
				: options.excludeDeletedByDefault
					? { $match: buildNotDeletedFilter<T>(options) }
					: null;

		if (!stage) return;

		ctx.pipeline = [stage, ...(ctx.pipeline ?? [])];
	});

	model.beforeDeleteOne((ctx) => {
		if (ctx.meta?.hardDelete === true) return;

		ctx.filter = mergeFilter(ctx.filter, buildNotDeletedFilter<T>(options));
		ctx.meta = {
			...(ctx.meta ?? {}),
			softDelete: true,
			softDeleteUpdate: buildSoftDeleteUpdate<T>(options)
		};
	});

	model.beforeDeleteMany((ctx) => {
		if (ctx.meta?.hardDelete === true) return;

		ctx.filter = mergeFilter(ctx.filter, buildNotDeletedFilter<T>(options));
		ctx.meta = {
			...(ctx.meta ?? {}),
			softDelete: true,
			softDeleteUpdate: buildSoftDeleteUpdate<T>(options)
		};
	});

	model.beforeFindOneAndDelete((ctx) => {
		if (ctx.meta?.hardDelete === true) {
			ctx.filter = mergeFilter(ctx.filter, buildNotDeletedFilter<T>(options));
			return;
		}

		ctx.filter = mergeFilter(ctx.filter, buildNotDeletedFilter<T>(options));
		ctx.meta = {
			...(ctx.meta ?? {}),
			softDelete: true,
			softDeleteUpdate: buildSoftDeleteUpdate<T>(options)
		};
	});

	model.setSoftDeleteConfig({
		deletedAtField: options.deletedAtField,
		isDeletedField: options.isDeletedField
	});

	return model;
}