import { AsyncLocalStorage } from 'node:async_hooks';
import type { ClientSession } from 'mongodb';

export interface AbimongoContextState {
  tenantId?: string;
  requestId?: string;
  dbName?: string;
  collectionName?: string;
  session?: ClientSession;
  loggerMeta?: Record<string, any>;
}

class AbimongoContextManager {
	private readonly storage = new AsyncLocalStorage<AbimongoContextState>();

	run<T>(context: AbimongoContextState, callback: () => T): T {
		return this.storage.run(context, callback);
	}

	get(): AbimongoContextState | undefined {
		return this.storage.getStore();
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
}

export const AbimongoContext = new AbimongoContextManager();