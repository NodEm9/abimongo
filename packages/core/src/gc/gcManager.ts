import { AbimongoModel } from '../lib-core';
import { Model, getModelFilesFromPath } from '../utils';
import path from 'path';
import { AbimongoConfig, Document } from '../types';
import { colorize } from '../utils/color-palatte';


let config: AbimongoConfig | undefined; 

export async function runGarbageCollectorOnAllModels() {
	const modelsPath = config?.features?.models || './src/models';
	const absolutePath = path.resolve(modelsPath);

	console.log(colorize(`[GC] Scanning models in: ${absolutePath}`, 'blue'));

	const modelFiles = getModelFilesFromPath(absolutePath);

	for (const file of modelFiles) {
		try {
			const { default: Model } = await import(file);

			if (Model?.prototype instanceof AbimongoModel) {
				console.log(colorize(`[GC] Running GC on model: ${Model.name}`, 'blue'));
				await runGarbageCollector(Model);
			} else {
				console.warn(colorize(`[GC] Skipping ${file} - Not an AbimongoModel`, 'yellow'));
			}

		} catch (err) {
			console.error(colorize(`[GC] Failed to run GC on ${file}:`, 'red'), err);
		}
	}
}

export async function runGarbageCollector(abimongoModel: typeof Model<Document>) {
	const expirationDays = 7; // or fetch from config
	const cutoffDate = new Date(Date.now() - expirationDays * 24 * 60 * 60 * 1000);

	const deletedDocs = await abimongoModel.prototype.deleteMany({
		deletedAt: { $lt: cutoffDate },
	});

	console.log(colorize(`[GC] Deleted ${deletedDocs.deletedCount ?? 0} documents from ${Model.name}`, 'blue'));
}
