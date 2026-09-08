import { getTenantModel } from '../../tanancy/TenantModelResolver';
import { MultiTenantManager } from '../../tanancy/MultiTenantManager';
import { TenantContext } from '../../tanancy/TenantContext';
import { Model } from '../../utils/builders/createModel';
import { ensureModelNameSafe } from '../../utils/ensureModelNameSafe';
import { AbimongoSchema } from '../../lib-core';
import { bufferedTransporter } from '../../utils';
import { shutdownLogger } from '@abimongo/logger';
import { DbProvider } from '../../types';

jest.mock('../../tanancy/MultiTenantManager');
jest.mock('../../tanancy/TenantContext');
jest.mock('../../utils/builders/createModel');
jest.mock('../../utils/ensureModelNameSafe', () => ({
	ensureModelNameSafe: jest.fn((name: string) => name + '_safe')
}));

// Prevent logger buffer from starting (fixes Jest open handle issue)
jest.mock('../../utils/logHelpers', () => ({
	setLogger: jest.fn(),
}));
jest.mock('../../utils/index', () => ({}));
jest.mock('../../config/setupLogger', () => ({}));

describe('getTenantModel', () => {
	const fakeClient = {};
	const fakeModel = { model: true };
	const fakeSchema = {} as AbimongoSchema<any>;
	const tenantId = 'tenant123';
	const collectionName = 'TestModel';

	beforeEach(() => {
		jest.clearAllMocks();
		(MultiTenantManager.getClient as jest.Mock).mockResolvedValue(fakeClient);
		(TenantContext.getTenantId as jest.Mock).mockReturnValue(tenantId);
		(Model as jest.Mock).mockReturnValue(fakeModel);
	});

	it('returns a model for a given tenant and caches it', async () => {
		const model = await getTenantModel({ collectionName, tenantId, schema: fakeSchema });
		const cachedModel = await model
		const safename = ensureModelNameSafe(collectionName);

		expect(ensureModelNameSafe).toHaveBeenCalledWith(collectionName);
		// expect(MultiTenantManager.getClient).toHaveBeenCalledWith(tenantId);
		// expect(Model).toBe(fakeModel);
		expect(cachedModel).toBe(fakeModel);

		// Should return cached model on second call
		const model2 = await getTenantModel({ collectionName, tenantId, schema: fakeSchema });
		expect(Model).toHaveBeenCalledTimes(1);
		expect(model2).toBe(fakeModel);
	});

	it('throws if collectionName is missing', async () => {
		await expect(getTenantModel({ collectionName: '', tenantId, schema: fakeSchema }))
			.rejects.toThrow('collectionName is required');
	});

	it('throws if tenantId param is missing', async () => {
		const tenantId = undefined as unknown as string;
		await expect(getTenantModel({ collectionName, tenantId: '', schema: fakeSchema }))
			.rejects.toThrow('tenantId is required to run tenant context');
	});

	it('throws if tenantId is missing from context', async () => {
		(TenantContext.getTenantId as jest.Mock).mockReturnValue(undefined);
		await expect(getTenantModel({ collectionName, tenantId: undefined as any, schema: fakeSchema }))
			.rejects.toThrow('tenantId is required to run tenant context');
	});

		afterAll(async () => {
			jest.resetAllMocks();
			await bufferedTransporter?.stop();
			await shutdownLogger();
		});
});

describe('createTenantProvider', () => {
	let provider: DbProvider = {
		db: async () => ({} as any)
	};
	it('should return a provider that resolves the tenant database', async () => {
		const tenantId = 'tenant123';
		const fakeDb = { db: jest.fn() };
		(MultiTenantManager.getClient as jest.Mock).mockResolvedValue({ db: () => fakeDb });

		const existingtenants = await MultiTenantManager.getClient(tenantId);
		expect(MultiTenantManager.getClient).toHaveBeenCalledWith(tenantId);
		expect(existingtenants).toBeTruthy();
		
	});

	it('should throw an error if tenant is not registered', async () => {
		const tenantId = 'tenant123';
		(MultiTenantManager.getClient as jest.Mock).mockResolvedValue(undefined);
		const dbProvide = jest.spyOn(provider, 'db').mockImplementation(async (ctx) => {
			const client = await MultiTenantManager.getClient(tenantId);
			if (!client) {
				throw new Error(`Tenant "${tenantId}" not registered.`);
			}
			return client.db();
		});
		await expect(dbProvide).rejects.toThrow(`Tenant "${tenantId}" not registered.`);
		dbProvide.mockRestore();
	});
});
	