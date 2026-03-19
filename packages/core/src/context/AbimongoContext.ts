import { AsyncLocalStorage } from 'node:async_hooks';
import type { ClientSession, MongoClient } from 'mongodb';
import { AbimongoContextState, AbimongoLoggerLike, AbimongoQueryObserver } from '../types';
import { runManualTransaction } from './helpers/runManualTransaction';



export interface AbimongoTransactionResolver {
	resolveClient: (
		tenantId?: string,
		dbName?: string
	) => Promise<MongoClient | undefined> | MongoClient | undefined;
}

// class AbimongoContextManager {
//   private readonly storage = new AsyncLocalStorage<AbimongoContextState>();
//   private transactionResolver?: AbimongoTransactionResolver;

//   run<T>(context: AbimongoContextState, callback: () => T): T {
//     const parent = this.storage.getStore() ?? {};
//     const merged = { ...parent, ...context };
//     return this.storage.run(merged, callback);
//   }

//   get(): AbimongoContextState {
//     return this.storage.getStore() ?? {};
//   }

//   set(patch: Partial<AbimongoContextState>): void {
//     const current = this.storage.getStore();
//     if (!current) return;

//     Object.assign(current, patch);
//   }

//   clear(): void {
//     const current = this.storage.getStore();
//     if (!current) return;

//     for (const key of Object.keys(current) as (keyof AbimongoContextState)[]) {
//       delete current[key];
//     }
//   }

//   configureTransactionResolver(resolver: AbimongoTransactionResolver): void {
//     this.transactionResolver = resolver;
//   }

//   getTenantId(): string | undefined {
//     return this.get().tenantId;
//   }

//   getRequestId(): string | undefined {
//     return this.get().requestId;
//   }

//   getDbName(): string | undefined {
//     return this.get().dbName;
//   }

//   getCollectionName(): string | undefined {
//     return this.get().collectionName;
//   }

//   getSession(): ClientSession | undefined {
//     return this.get().session;
//   }

//   getLogger(): AbimongoLoggerLike | undefined {
//     return this.get().logger;
//   }

//   getLoggerMeta(): Record<string, any> | undefined {
//     return this.get().loggerMeta;
//   }

//   isDebug(): boolean {
//     const ctx = this.get();
//     return Boolean(
//       ctx.debug ||
//       process.env.ABIMONGO_DEBUG === 'true' ||
//       process.env.ABIMONGO_DEBUG === '1'
//     );
//   }

//   async withTransaction<T>(
//     callback: (session: ClientSession) => Promise<T>
//   ): Promise<T> {
//     const current = this.get();

//     if (current.session) {
//       return callback(current.session);
//     }

//     if (!this.transactionResolver) {
//       throw new Error(
//         'AbimongoContext transaction resolver is not configured.'
//       );
//     }

//     const client = await this.transactionResolver.resolveClient(
//       current.tenantId,
//       current.dbName
//     );

//     if (!client) {
//       throw new Error(
//         `No MongoClient available for${
//           current.tenantId ? ` tenant "${current.tenantId}"` : ' current context'
//         }.`
//       );
//     }

//     const session = client.startSession();

//     try {
//       let result!: T;

//       await session.withTransaction(async () => {
//         result = await this.run({ session }, () => callback(session));
//       });

//       return result;
//     } finally {
//       await session.endSession();
//     }
//   }
// }

// export const AbimongoContext = new AbimongoContextManager();

class AbimongoContextManager {
	private readonly storage = new AsyncLocalStorage<AbimongoContextState>();
	private transactionResolver?: AbimongoTransactionResolver;

	run<T>(context: AbimongoContextState, callback: () => T): T {
		const parent = this.storage.getStore() ?? {};
		const merged = { ...parent, ...context };
		return this.storage.run(merged, callback);
	}

	get(): AbimongoContextState {
		return this.storage.getStore() ?? {};
	}

	set(patch: Partial<AbimongoContextState>): void {
		const current = this.storage.getStore();
		if (!current) return;
		Object.assign(current, patch);
	}

	clear(): void {
		const current = this.storage.getStore();
		if (!current) return;

		for (const key of Object.keys(current) as (keyof AbimongoContextState)[]) {
			delete current[key];
		}
	}

	configureTransactionResolver(resolver: AbimongoTransactionResolver): void {
		this.transactionResolver = resolver;
	}

	getTenantId(): string | undefined {
		return this.get().tenantId;
	}

	getRequestId(): string | undefined {
		return this.get().requestId;
	}

	getDbName(): string | undefined {
		return this.get().dbName;
	}

	getCollectionName(): string | undefined {
		return this.get().collectionName;
	}

	getSession(): ClientSession | undefined {
		return this.get().session;
	}

	getLogger(): AbimongoLoggerLike | undefined {
		return this.get().logger;
	}

	getLoggerMeta(): Record<string, any> | undefined {
		return this.get().loggerMeta;
	}

	getObserver(): AbimongoQueryObserver | undefined {
		return this.get().observer;
	}

	isDebug(): boolean {
		const ctx = this.get();
		return Boolean(
			ctx.debug ||
			process.env.ABIMONGO_DEBUG === 'true' ||
			process.env.ABIMONGO_DEBUG === '1'
		);
	}

	// async withTransaction<T>(
	// 	callback: (session: ClientSession) => Promise<T>
	// ): Promise<T> {
	// 	const current = this.get();

	// 	if (current.session) {
	// 		return callback(current.session);
	// 	}

	// 	if (!this.transactionResolver) {
	// 		throw new Error('AbimongoContext transaction resolver is not configured.');
	// 	}

	// 	const client = await this.transactionResolver.resolveClient(
	// 		current.tenantId,
	// 		current.dbName
	// 	);

	// 	if (!client) {
	// 		throw new Error(
	// 			`No MongoClient available for${current.tenantId ? ` tenant "${current.tenantId}"` : ' current context'
	// 			}.`
	// 		);
	// 	}

	// 	const session = client.startSession();

	// 	try {
	// 		let result!: T;

	// 		await session.withTransaction(async () => {
	// 			result = await this.run({ session }, () => callback(session));
	// 		});

	// 		return result;
	// 	} finally {
	// 		await session.endSession();
	// 	}
	// }

	async withTransaction<T>(
		callback: (session: ClientSession) => Promise<T>
	): Promise<T> {
		const current = this.get();

		if (current.session) {
			return callback(current.session);
		}

		if (!this.transactionResolver) {
			throw new Error('AbimongoContext transaction resolver is not configured.');
		}

		const client = await this.transactionResolver.resolveClient(
			current.tenantId,
			current.dbName
		);

		if (!client) {
			throw new Error(
				`No MongoClient available for${current.tenantId ? ` tenant "${current.tenantId}"` : ' current context'
				}.`
			);
		}

		const session = client.startSession();

		if (typeof session.withTransaction === 'function') {
			try {
				let result!: T;

				await session.withTransaction(async () => {
					result = await this.run({ session }, () => callback(session));
					return result;
				});

				return result;
			} finally {
				await session.endSession();
			}
		}

		return this.run({ session }, () =>
			runManualTransaction(session, callback)
		);
	}

	// async withTransaction<T>(
	// 	callback: (session: ClientSession) => Promise<T>
	// ): Promise<T> {
	// 	const current = this.get();

	// 	if (current.session) {
	// 		return callback(current.session);
	// 	}

	// 	if (!this.transactionResolver) {
	// 		throw new Error('AbimongoContext transaction resolver is not configured.');
	// 	}

	// 	const client = await this.transactionResolver.resolveClient(
	// 		current.tenantId,
	// 		current.dbName
	// 	);

	// 	if (!client) {
	// 		throw new Error(
	// 			`No MongoClient available for${current.tenantId ? ` tenant "${current.tenantId}"` : ' current context'
	// 			}.`
	// 		);
	// 	}

	// 	const session = client.startSession();

	// 	try {
	// 		// Modern Mongo session API
	// 		if (typeof (session as any).withTransaction === 'function') {
	// 			let result!: T;

	// 			await (session as any).withTransaction(async () => {
	// 				result = await this.run({ session }, () => callback(session));
	// 			});

	// 			return result;
	// 		}

	// 		// Legacy/manual transaction API fallback
	// 		if (typeof (session as any).startTransaction === 'function') {
	// 			(session as any).startTransaction();

	// 			try {
	// 				const result = await this.run({ session }, () => callback(session));

	// 				if (typeof (session as any).commitTransaction === 'function') {
	// 					await (session as any).commitTransaction();
	// 				}

	// 				return result;
	// 			} catch (error) {
	// 				if (typeof (session as any).abortTransaction === 'function') {
	// 					await (session as any).abortTransaction();
	// 				}
	// 				throw error;
	// 			}
	// 		}

	// 		// If neither style exists, still run callback with session
	// 		return await this.run({ session }, () => callback(session));
	// 	} finally {
	// 		if (typeof (session as any).endSession === 'function') {
	// 			await (session as any).endSession();
	// 		}
	// 	}
	// }

	hasTransactionResolver(): boolean {
		return Boolean(this.transactionResolver);
	}

}

export const AbimongoContext = new AbimongoContextManager();