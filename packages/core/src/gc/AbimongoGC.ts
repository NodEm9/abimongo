import { AbimongoClient, AbimongoSchema } from '../lib-core';
import { Collection, Filter } from 'mongodb';
import { GCConfig, Document } from '../types';
import { colorize } from '../utils';
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
			console.info(colorize('[AbimongoGC] Garbage Collector is disabled.', 'blue'));
			return;
		}
		if (options.retentionPeriod) {
			this.intervalMs = options.retentionPeriod * 24 * 60 * 60 * 1000; // convert days to milliseconds
			this.enabled = true;
		}
		if (options.logResults) {
			console.log(colorize('[AbimongoGC]: Logging results of GC operations.', 'blue'));
			this.options.logResults = true;
			this.enabled = true;
		}
		this.initialize();
		if (options.cron) {
			console.log(colorize(`[AbimongoGC]: Cron schedule set to: ${options.cron}`, 'blue'));
			// You can implement cron scheduling here if needed
			// For example, using node-cron or any other cron library
			cron.schedule(options.cron, () => this.runOnce());
			this.enabled = true;
		} else if (options.interval) {
			console.log(colorize(`[AbimongoGC]: Interval set to: ${options.interval}`, 'blue'));
			this.intervalMs = this.parseInterval(options.interval);
			this.enabled = true;
			this.start();
		} else {
			console.log(colorize('[AbimongoGC]: No cron schedule provided, using interval-based cleanup.', 'red'));
		}
	};

	private initialize() {
		console.log(colorize('[AbimongoGC] Initializing Garbage Collector...', 'blue'));
		
		if (this.options.retentionPeriod && this.options.interval && this.options.logger) {
			console.log(colorize(`[AbimongoGC] Retention period set to ${this.options.retentionPeriod} days. \n Interval set to ${this.options.interval} \n Logger configured.`, 'blue'));
		} else {
			console.log(colorize('[AbimongoGC] No ( retention period, Interval or logger ) set, GC is using default settings.', 'red'));
		}

		if (!this.enabled) {
			console.log(colorize('[AbimongoGC] Garbage Collector is disabled via options.', 'red'));
			return;
		}

		console.log(colorize('[AbimongoGC] Initialization complete.', 'blue'));
		this.start();
		console.log(colorize('[AbimongoGC] Garbage Collector is running.', 'blue'));
	}

	async register(collection: Collection<any>, schema: AbimongoSchema<Document>) {
		this.collections.push({ collection, schema });
	}

	start() {
		if (!this.intervalRef) return;
		console.log(colorize(`[AbimongoGC]: 🔁 Started GC loop every ${this.intervalMs} ms`, 'blue'));
		this.intervalRef = setInterval(() => this.runOnce(), this.intervalMs);
	}

	stop() {
		if (this.intervalRef) clearInterval(this.intervalRef);
		this.intervalRef = null;
		console.log(colorize('[AbimongoGC]: ⏹️ Stopped', 'blue'));
	}

	async runOnce() {
		const dbs = await AbimongoClient.getAllTenantDBs();
		for (const db of dbs) {
			const dbName = (await db.db()).databaseName;
			console.log(colorize(`[GC]: Running cleanup for tenant DB: ${dbName}`, 'blue'));
			const collections = await (await db.db()).listCollections().toArray();
			for (const { name } of collections) {
				const model = AbimongoClient.getRegisteredModel(
					dbName,
					name,
					{} as any, // Pass an empty schema since we only need GC config
				);
				if (!model?.schema) continue;

				const gcConfig = model.schema.getGCConfig?.();
				if (!gcConfig) continue;

				await this.cleanup((await model.db.db()).collection(name), gcConfig);
			}
		}
	}

	private async cleanup<T extends Document>(
		collection: Collection<T>,
		config: GCConfig
	) {
		const now = new Date();
		console.log(colorize(`[GC]: Starting cleanup for "${collection.collectionName}" with config:`, 'blue'), config);
		if (!config.ttlField || !config.expiresIn) {
			console.warn(colorize(`[GC]: No TTL field or expiration time set for "${collection.collectionName}"`, 'yellow'));
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
				console.debug(colorize(`[GC]: Soft-deleted documents older than ${expiresIn} from "${collection.collectionName}"`, 'cyan'));
			} else {
				await collection.deleteMany(filter);
				console.debug(colorize(`[GC]: Deleted documents older than ${expiresIn} from "${collection.collectionName}"`, 'blue'));
			}
			console.debug(colorize(`[GC]: Cleanup completed for "${collection.collectionName}" with filter:`, 'blue'), filter);
			console.debug(colorize(`[GC]: Processed ${filter[ttlField].$lte} documents older than ${expiresIn}`, 'blue'));
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
