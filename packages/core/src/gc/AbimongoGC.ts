import { AbimongoClient, AbimongoSchema } from '../lib-core';
import { Collection, Filter } from 'mongodb';
// import { LoggerConfig, setupLogger } from '@abimongo/logger';
import { GCConfig, Document } from '../types';
import { colourize } from '../utils';
// import { logger } from '../config';
import * as cron from 'node-cron';

interface GCOptions {
	enabled?: boolean;
	interval?: string; // e.g., '5m', '1h'
	logger?: any;
	retentionPeriod?: number; // in days
	logResults?: boolean; // whether to log results of GC operations
	cron?: string; // e.g., '0 0 * * *' for daily at midnight
};

interface GCEntry {
	collection: Collection<any>;
	schema: AbimongoSchema<Document>;
}


export class AbimongoGC {
	private collections: GCEntry[] = [];
	private readonly enabled: boolean = true;
	// private cron: cron.ScheduledTask | null = null;
	private intervalMs: number;

	private intervalRef: NodeJS.Timeout | null = null;
	// private readonly logger = logger || console;

	constructor(private options: GCOptions = {}) {
		// this.logger = options.logger || console;
		this.enabled = options.enabled !== false; // Default to true if not specified
		this.intervalMs = options.interval ? this.parseInterval(options.interval) : 60000; // default 60s
		if (options.enabled === false) {
			console.info('[AbimongoGC] Garbage Collector is disabled.');
			return;
		}
		if (options.retentionPeriod) {
			this.intervalMs = options.retentionPeriod * 24 * 60 * 60 * 1000; // convert days to milliseconds
			this.enabled = true;
		}
		if (options.logResults) {
			console.log(colourize('[AbimongoGC]: Logging results of GC operations.', 'blueBright'));
			this.options.logResults = true;
			this.enabled = true;
		}
		this.initialize();
		if (options.cron) {
			console.log(colourize(`[AbimongoGC]: Cron schedule set to: ${options.cron}`, 'blueBright'));
			// You can implement cron scheduling here if needed
			// For example, using node-cron or any other cron library
			cron.schedule(options.cron, () => this.runOnce());
			this.enabled = true;
		} else if (options.interval) {
			console.log(colourize(`[AbimongoGC]: Interval set to: ${options.interval}`, 'blueBright'));
			this.intervalMs = this.parseInterval(options.interval);
			this.enabled = true;
			this.start();
		} else {
			console.log(colourize('[AbimongoGC]: No cron schedule provided, using interval-based cleanup.', 'blackBright'));
		}
	};

	private initialize() {
		console.log(colourize('[AbimongoGC] Initializing Garbage Collector...', 'blackBright'));
		
		if (this.options.retentionPeriod && this.options.interval && this.options.logger) {
			console.log(colourize(`[AbimongoGC] Retention period set to ${this.options.retentionPeriod} days. \n Interval set to ${this.options.interval} \n Logger configured.`, 'blueBright'));
		} else {
			console.log(colourize('[AbimongoGC] No ( retention period, Interval or logger ) set, GC is using default settings.', 'blackBright'));
		}

		if (!this.enabled) {
			console.log(colourize('[AbimongoGC] Garbage Collector is disabled via options.', 'yellow'));
			return;
		}

		console.log(colourize('[AbimongoGC] Initialization complete.', 'blueBright'));
		this.start();
		console.log(colourize('[AbimongoGC] Garbage Collector is running.', 'green'));
	}

	register(collection: Collection<any>, schema: AbimongoSchema<Document>) {
		this.collections.push({ collection, schema });
	}

	start() {
		if (!this.intervalRef) return;
		console.log(colourize(`[AbimongoGC]: 🔁 Started GC loop every ${this.intervalMs} ms`, 'blueBright'));
		this.intervalRef = setInterval(() => this.runOnce(), this.intervalMs);
	}

	stop() {
		if (this.intervalRef) clearInterval(this.intervalRef);
		this.intervalRef = null;
		console.log(colourize('[AbimongoGC]: ⏹️ Stopped', 'blueBright'));
	}

	async runOnce() {
		const dbs = await AbimongoClient.getAllTenantDBs();
		for (const db of dbs) {
			const collections = await db.listCollections().toArray();
			for (const { name } of collections) {
				const model = AbimongoClient.getRegisteredModel(db.databaseName, name);
				if (!model?.schema) continue;

				const gcConfig = model.schema.getGCConfig?.();
				if (!gcConfig) continue;

				await this.cleanup(model.db.collection(name), gcConfig);
			}
		}
	}

	private async cleanup<T extends Document>(
		collection: Collection<T>,
		config: GCConfig
	) {
		const now = new Date();
		console.log(colourize(`[GC]: Starting cleanup for "${collection.collectionName}" with config:`, 'blueBright'), config);
		if (!config.ttlField || !config.expiresIn) {
			console.warn(colourize(`[GC]: No TTL field or expiration time set for "${collection.collectionName}"`, 'yellow'));
			return;
		}

		for (const { collection, schema } of this.collections) {
			const gcConfig = schema.getGCConfig();
			if (!gcConfig) continue;

			const { ttlField, expiresIn, softDelete } = gcConfig;
			const expirationDate = new Date(now.getTime() - this.parseInterval(expiresIn));

			const filter: Filter<T> = {
				[ttlField]: { $lte: expirationDate },
				...(softDelete ? { deletedAt: { $exists: false } } : {}),
			} as Filter<T>;

			if (softDelete) {
				await collection.updateMany(filter, { $set: { deletedAt: now } });
				console.debug(colourize(`[GC]: Soft-deleted documents older than ${expiresIn} from "${collection.collectionName}"`, 'blueBright'));
			} else {
				await collection.deleteMany(filter);
				console.debug(colourize(`[GC]: Deleted documents older than ${expiresIn} from "${collection.collectionName}"`, 'blueBright'));
			}
			console.debug(colourize(`[GC]: Cleanup completed for "${collection.collectionName}" with filter:`, 'blueBright'), filter);
			console.debug(colourize(`[GC]: Processed ${filter[ttlField].$lte} documents older than ${expiresIn}`, 'blueBright'));
		}
	};

	private parseInterval(duration: string): number {
		const match = duration.match(/^(\d+)([smhd])$/);
		if (!match) throw new Error(`Invalid interval format: ${duration}`);
		const [_, num, unit] = match;
		const value = parseInt(num, 10);
		switch (unit) {
			case 's': return value * 1000;
			case 'm': return value * 60 * 1000;
			case 'h': return value * 60 * 60 * 1000;
			case 'd': return value * 24 * 60 * 60 * 1000;
			default: throw new Error(`Unknown time unit: ${unit}`);
		}
	}
}
