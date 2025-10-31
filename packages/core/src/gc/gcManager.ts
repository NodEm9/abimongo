import { AbimongoModel } from '../lib-core';
import { createModel, getModelFilesFromPath } from '../utils';
import path from 'path';
import { AbimongoConfig, Document } from '../types';
import { colourize } from '../utils';


let config: AbimongoConfig | undefined; 

export async function runGarbageCollectorOnAllModels() {
	const modelsPath = config?.features?.models || './src/models';
	const absolutePath = path.resolve(modelsPath);

	console.log(colourize(`[GC] Scanning models in: ${absolutePath}`, 'blueBright'));

	const modelFiles = getModelFilesFromPath(absolutePath);

	for (const file of modelFiles) {
		try {
			const { default: Model } = await import(file);

			if (Model?.prototype instanceof AbimongoModel) {
				console.log(colourize(`[GC] Running GC on model: ${Model.name}`, 'blueBright'));
				await runGarbageCollector(Model);
			} else {
				console.warn(colourize(`[GC] Skipping ${file} - Not an AbimongoModel`, 'yellow'));
			}

		} catch (err) {
			console.error(colourize(`[GC] Failed to run GC on ${file}:`, 'red'), err);
		}
	}
}

export async function runGarbageCollector(Model: typeof createModel<Document>) {
	const expirationDays = 7; // or fetch from config
	const cutoffDate = new Date(Date.now() - expirationDays * 24 * 60 * 60 * 1000);

	const deletedDocs = await Model.prototype.deleteMany({
		deletedAt: { $lt: cutoffDate },
	});

	console.log(colourize(`[GC] Deleted ${deletedDocs.deletedCount ?? 0} documents from ${Model.name}`, 'blueBright'));
}
