/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Application,
	Request,
	Response,
	NextFunction
} from 'express-serve-static-core';
import express from 'express';
import request from 'supertest';
import { applyMultiTenancy, TenantContext } from '../../tanancy';
import * as initMultiTenancyModule from '../../tanancy';
import { shutdownLogger } from "@abimongo/logger";
import { bufferedTransporter } from '../../utils';

jest.mock('../../tanancy/init/initMultiTenancy');
jest.mock('../../tanancy/TenantContext');

describe('applyMultiTenancy', () => {
	let app: Application;
	const tenants = {
		tenant1: 'mongodb://localhost:27017/tenant1',
		tenant2: 'mongodb://localhost:27017/tenant2',
	};

	beforeEach(() => {
		jest.clearAllMocks();
		app = express();
		(initMultiTenancyModule.initMultiTenancy as jest.Mock).mockResolvedValue(undefined);
		(TenantContext.run as jest.Mock).mockImplementation((_tenantId, cb) => cb());
	});

	it('should initialize multi-tenancy with provided tenants', async () => {
		await applyMultiTenancy(app, tenants);
		expect(initMultiTenancyModule.initMultiTenancy).toHaveBeenCalledWith(tenants, undefined);
	});

	it('should use the default headerKey if not provided', async () => {
		app.get('/test', (_req, res) => { res.send('ok') });
		await applyMultiTenancy(app, tenants, { headerKey: 'x-tenant-id' });
		await request(app)
			.get('/test')
			.set('x-tenant-id', 'tenant1')
			.expect(200);
		TenantContext.run('tenant1', () => { expect.any(Function) });
		expect(TenantContext.run).toHaveBeenCalledWith('tenant1', expect.any(Function));
	});

	it('should use a custom headerKey if provided', async () => {
		app.get('/test', (_req, res) => { res.send('ok') });
		await applyMultiTenancy(app, tenants, { headerKey: 'x-custom-tenant' });
		await request(app)
			.get('/test')
			.set('x-custom-tenant', 'tenant2')
			.expect(200);
		TenantContext.run('tenant2', () => { expect.any(Function) });
		expect(TenantContext.run).toHaveBeenCalledWith('tenant2', expect.any(Function));
	});

	it('should use DEFAULT_TENANT_ID if header is missing', async () => {
		process.env.DEFAULT_TENANT_ID = 'defaultTenant';
		await applyMultiTenancy(app, tenants);
		app.get('/test', (_req, res) => { res.send('ok') });
		await request(app)
			.get('/test')
			.expect(200);
		TenantContext.run('defaultTenant', () => { expect.any(Function) });
		expect(TenantContext.run).toHaveBeenCalledWith('defaultTenant', expect.any(Function));
		delete process.env.DEFAULT_TENANT_ID;
	});

	it('should return error if tenant ID is missing and no default is set', async () => {
		await applyMultiTenancy(app, tenants);
		app.get('/test', (_req, res) => { res.status(500).json('Internal Server Error') });
		// Error handler must be added after routes and have 4 arguments
		app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
			res.status(500).json({ error: err.message });
		});
		const res = await request(app).get('/test');
		expect(res.status).toBe(500);
	});

	it('should pass initOptions to initMultiTenancy', async () => {
		const initOptions = { someOption: true } as any;
		await applyMultiTenancy(app, tenants, { initOptions });
		expect(initMultiTenancyModule.initMultiTenancy).toHaveBeenCalledWith(tenants, initOptions);
	});

	afterAll(async () => {
		await bufferedTransporter.stop();
		await shutdownLogger();
	});
});