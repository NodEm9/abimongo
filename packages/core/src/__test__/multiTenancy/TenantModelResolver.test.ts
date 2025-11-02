import { getTenantModel } from '../../tanancy/TenantModelResolver';
import { MultiTenantManager } from '../../tanancy/MultiTenantManager';
import { TenantContext } from '../../tanancy/TenantContext';
import { createModel } from '../../utils/builders/createModel';
import { ensureModelNameSafe } from '../../utils/ensureModelNameSafe';
import { AbimongoSchema } from '../../lib-core';
import { bufferedTransporter } from '../../utils';
import { shutdownLogger } from '@abimongo/logger';

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
	const modelName = 'TestModel';

	beforeEach(() => {
		jest.clearAllMocks();
		(MultiTenantManager.getClient as jest.Mock).mockResolvedValue(fakeClient);
		(TenantContext.getTenantId as jest.Mock).mockReturnValue(tenantId);
		(createModel as jest.Mock).mockReturnValue(fakeModel);
	});

	it('returns a model for a given tenant and caches it', async () => {
		const model = await getTenantModel({ modelName, tenantId, schema: fakeSchema });
		expect(ensureModelNameSafe).toHaveBeenCalledWith(modelName);
		expect(MultiTenantManager.getClient).toHaveBeenCalledWith(tenantId);
		expect(createModel).toHaveBeenCalledWith({ name: modelName + '_safe', schema: fakeSchema, client: fakeClient });
		expect(model).toBe(fakeModel);

		// Should return cached model on second call
		const model2 = await getTenantModel({ modelName, tenantId, schema: fakeSchema });
		expect(createModel).toHaveBeenCalledTimes(1);
		expect(model2).toBe(fakeModel);
	});

	it('throws if no tenant context is found', async () => {
		(TenantContext.getTenantId as jest.Mock).mockReturnValue(undefined);
		await expect(getTenantModel({ modelName, tenantId: '', schema: fakeSchema }))
			.rejects.toThrow('No tenant context found');
	});

	it('throws if tenant is not registered', async () => {
		(MultiTenantManager.getClient as jest.Mock).mockResolvedValue(undefined);
		await expect(getTenantModel({ modelName, tenantId, schema: fakeSchema }))
			.rejects.toThrow(`Tenant "${tenantId}" not registered`);
	});

	it('uses TenantContext.getTenantId if tenantId param is missing', async () => {
		await getTenantModel({ modelName, schema: fakeSchema, tenantId: '' as any });
		expect(TenantContext.getTenantId).toHaveBeenCalled();
	});

		afterAll(async () => {
			jest.resetAllMocks();
			await bufferedTransporter?.stop();
			await shutdownLogger();
		});
});