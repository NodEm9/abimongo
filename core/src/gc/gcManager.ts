import { AbimongoModel } from '../core';
import { createModel, getModelFilesFromPath } from '../utils';
import path from 'path';
import { AbimongoConfig, Document } from '../types';
import chalk from 'chalk';


let config: AbimongoConfig | undefined; 

export async function runGarbageCollectorOnAllModels() {
	const modelsPath = config?.features?.models || './src/models';
	const absolutePath = path.resolve(modelsPath);

	console.log(chalk.blueBright(`[GC] Scanning models in: ${absolutePath}`));

	const modelFiles = getModelFilesFromPath(absolutePath);

	for (const file of modelFiles) {
		try {
			const { default: Model } = await import(file);

			if (Model?.prototype instanceof AbimongoModel) {
				console.log(chalk.blueBright(`[GC] Running GC on model: ${Model.name}`));
				await runGarbageCollector(Model);
			} else {
				console.warn(chalk.yellow(`[GC] Skipping ${file} - Not an AbimongoModel`));
			}

		} catch (err) {
			console.error(chalk.red(`[GC] Failed to run GC on ${file}:`), err);
		}
	}
}

export async function runGarbageCollector(Model: typeof createModel<Document>) {
	const expirationDays = 7; // or fetch from config
	const cutoffDate = new Date(Date.now() - expirationDays * 24 * 60 * 60 * 1000);

	const deletedDocs = await Model.prototype.deleteMany({
		deletedAt: { $lt: cutoffDate },
	});

	console.log(chalk.blueBright(`[GC] Deleted ${deletedDocs.deletedCount ?? 0} documents from ${Model.name}`));
}
