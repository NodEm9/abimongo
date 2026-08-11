import { MultiTenantManager } from '../../tanancy';
import { shutdownLogger } from '@abimongo/logger';


describe('MultiTenantManager', () => {
  afterEach(() => {
    MultiTenantManager.clearTenants();
  });

  it('should register a lazy tenant with dbName', () => {
    const tenant = MultiTenantManager.registerLazyTenant(
      'tenantA',
      'mongodb://localhost:27017/tenantA_db'
    );

    expect(tenant).toEqual({
      tenantId: 'tenantA',
      uri: 'mongodb://localhost:27017/tenantA_db',
      dbName: 'tenantA_db',
      client: undefined,
      lazy: true,
      metadata: undefined
    });
  });

  it('should register and retrieve tenant config', async () => {
   const client = await MultiTenantManager.registerTenant(
      'tenantA',
      'mongodb://localhost:27017/tenantA_db'
    );

    const tenant = MultiTenantManager.getTenant('tenantA');

    expect(tenant?.tenantId).toBe('tenantA');
    expect(tenant?.uri).toBe('mongodb://localhost:27017/tenantA_db');
    expect(tenant?.dbName).toBe('tenantA_db');
    expect(tenant?.lazy).toBe(false);
		expect(tenant?.client).toBeDefined();
		await client.close();
  });

  it('should return tenant dbName', () => {
    MultiTenantManager.registerLazyTenant(
      'tenantA',
      'mongodb://localhost:27017/tenantA_db'
    );

    expect(MultiTenantManager.getTenantDbName('tenantA')).toBe('tenantA_db');
  });

  it('should return true when tenant is registered', () => {
    MultiTenantManager.registerLazyTenant(
      'tenantA',
      'mongodb://localhost:27017/tenantA_db'
    );

    expect(MultiTenantManager.hasTenant('tenantA')).toBe(true);
  });

  it('should throw when tenantId is missing', () => {
    expect(() => MultiTenantManager.getTenant('')).toThrow('Tenant ID is required.');
  });
});


// jest.mock('mongodb', () => {
// 	// Mock MongoClient with connect and db methods
// 	return {
// 		MongoClient: jest.fn().mockImplementation((uri: string) => {
// 			return {
// 				uri,
// 				connect: jest.fn().mockResolvedValue(undefined),
// 				db: jest.fn().mockImplementation((dbName?: string) => ({
// 					dbName,
// 					collection: jest.fn(),
// 				})),
// 				close: jest.fn(),
// 			};
// 		}),
// 	};
// });

// describe('MultiTenantManager', () => {
// 	const tenantId = 'tenant1';
// 	const uri = 'mongodb://localhost:27017/tenant1db';

// 	beforeEach(() => {
// 		// Reset static maps before each test
// 		(MultiTenantManager as any).clients?.clear();
// 		(MultiTenantManager as any).lazyURIs?.clear();
// 		(MongoClient as unknown as jest.Mock).mockClear();
// 	});

// 	it('should register and retrieve a tenant client', async () => {
// 		const client = await MultiTenantManager.registerTenant(tenantId, uri);
// 		expect(client).toBeDefined();
// 		expect(MongoClient).toHaveBeenCalledWith(uri);

// 		const retrieved = await MultiTenantManager.getClient(tenantId);
// 		expect(retrieved).toBe(client);
// 	});

// 	it('should not create a new client if tenant is already registered', async () => {
// 		const client1 = await MultiTenantManager.registerTenant(tenantId, uri);
// 		const client2 = await MultiTenantManager.registerTenant(tenantId, uri);
// 		expect(client1).toBe(client2);
// 		expect(MongoClient).toHaveBeenCalledTimes(1);
// 	});

// 	it('should support lazy tenant registration and connect on first access', async () => {
// 		MultiTenantManager.registerLazyTenant(tenantId, uri);
// 		expect(MultiTenantManager.hasTenant(tenantId)).toBe(true);

// 		// No client should be created yet
// 		expect((MultiTenantManager as any).clients?.has(tenantId)).toBe(false);

// 		const client = await MultiTenantManager.getClient(tenantId);
// 		expect(client).toBeDefined();
// 		expect(MongoClient).toHaveBeenCalledWith(uri);
// 		expect((MultiTenantManager as any).clients.has(tenantId)).toBe(true);
// 		expect((MultiTenantManager as any).lazyURIs.has(tenantId)).toBe(false);
// 	});

// 	it('should return null for unknown tenant', async () => {
// 		const client = await MultiTenantManager.getClient('unknown');
// 		expect(client).toBeNull();
// 	});

// 	// it('should call logger.info when registering lazy tenant', () => {
// 	// 	const logger = { info: jest.fn() };
// 	// 	MultiTenantManager.registerLazyTenant(tenantId, uri);
// 	// 	expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(tenantId));
// 	// });

// 	it('mocked MongoClient.db should be callable (for AbimongoClient compatibility)', async () => {
// 		const client = await MultiTenantManager.registerTenant(tenantId, uri);
// 		const dbName = 'somedb';
// 		const db = client.db(dbName);
// 		// expect(db.databaseName).toBe('somedb');
// 		expect(typeof db.collection).toBe('function');
// 	});
// 	afterAll(async () => {
// 		jest.resetAllMocks();
// 		await shutdownLogger();
// 	});
// });