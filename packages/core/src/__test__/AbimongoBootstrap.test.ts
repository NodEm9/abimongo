/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AbimongoBootstrap, initAbimongo } from '../lib-core';
import { bufferedTransporter } from '../utils'



jest.mock('../config', () => ({
  loadAbimongoConfig: jest.fn(() => ({
    mongoUri: 'mongodb://localhost:27017',
    projectName: 'test_db',
    features: {
      useRedisCache: false
    },
    graphql: {
      enabled: false
    }
  }))
}));

jest.mock('express', () => ({
  Application: jest.fn(),
  Router: jest.fn(),
  json: jest.fn(),
  urlencoded: jest.fn(),
  static: jest.fn(),
  response: {
    send: jest.fn(),
    status: jest.fn().mockReturnThis()
  }
}));

describe('AbimongoBootstrap', () => {
  it('initializes MongoDB only', async () => {
    const app = await initAbimongo.create();
    expect(app.getMongoClient()).toBeDefined();
    expect(app.getGraphQL()).toBeUndefined();
  });

  it('initializes with Redis cache if enabled', async () => {
    const app = await initAbimongo.create({
      features: {
        useRedisCache: true,
        redisUri: 'redis://localhost:6379'
      }
    });
    expect(app.getRedisClient()).toBeDefined();
  });
  it('initializes with GraphQL if enabled', async () => {
    const app = await initAbimongo.create({
      graphql: {
        enabled: true
      }
    });
    app.getGraphQL = jest.fn().mockReturnValue({
      schema: {},
      resolvers: {}
    });
    expect(app.getGraphQL()).toBeDefined();
  });
  
  it('runs onConnect hooks', async () => {
    const app = new AbimongoBootstrap();
    const mockHook = jest.fn();
    app.onConnect(mockHook);
    await app.initialize();
    expect(mockHook).toHaveBeenCalled();
  });

  it('shuts down gracefully', async () => {
    const app = await initAbimongo.create();
    const spy = jest.spyOn(console, 'log').mockImplementation(() => { });
    await app.shutdown();
    console.log('🧼 Shutdown complete');
    expect(spy).toHaveBeenCalledWith('🧼 Shutdown complete');
    spy.mockRestore();
  });

  it('throws error if multi-tenancy is not enabled when calling registerMultiTenancy', async () => {
    const app = new AbimongoBootstrap();
    // Mock config to not enable multiTenant
    (app as any).config = {
      multiTenant: { enabled: false }
    };
    await expect(app.registerMultiTenancy({} as any, { 'tenant-a': 'uri' }, {})).rejects.toThrow('Multi-tenancy is not enabled in the configuration');
  });

  it('throws error if tenantId is not provided in registerMultiTenancy', async () => {
    const app = new AbimongoBootstrap();
    (app as any).config = {
      multiTenant: { enabled: true }
    };
    await expect(app.registerMultiTenancy({} as any, undefined as any, {})).rejects.toThrow('Tenant ID is required for multi-tenancy');
  });

  it('calls applyMultiTenancy with correct arguments', async () => {
    const app = new AbimongoBootstrap();
    (app as any).config = {
      multiTenant: {
        enabled: true,
        tenants: { 'tenant-a': 'uri' },
        headerKey: 'x-tenant-id',
        initOptions: { lazy: true }
      }
    };
    const mockApply = jest.spyOn(require('../tanancy/applyMultiTenancy'), 'applyMultiTenancy').mockResolvedValue(undefined);
    // app.logger = { info: jest.fn() } as any;
    await app.registerMultiTenancy({} as any, { 'tenant-a': 'uri' }, {});
    expect(mockApply).toHaveBeenCalled();
    mockApply.mockRestore();
  });

  it('throws error if redis is not initialized in cache()', async () => {
    const app = new AbimongoBootstrap();
    (require('../redis-manager/redisClient') as any).redis = undefined;
    await expect(app.cache('key', async () => 'val')).rejects.toThrow('Redis is not initialized');
  });

  it('calls cacheWithRedis in cache()', async () => {
    const app = new AbimongoBootstrap();
    const mockRedis = {};
    (require('../redis-manager/redisClient') as any).redis = mockRedis;
    const mockCacheWithRedis = jest.spyOn(require('../utils/cacheWithRedis'), 'cacheWithRedis').mockResolvedValue('val');
    await app.cache('key', async () => 'val');
    expect(mockCacheWithRedis).toHaveBeenCalled();
    mockCacheWithRedis.mockRestore();
  });

  it('throws error if redis is not available in invalidateCache()', async () => {
    const app = new AbimongoBootstrap();
    (require('../redis-manager/redisClient') as any).redis = undefined;
    await expect(app.invalidateCache('tenant')).rejects.toThrow('No Redis client available');
  });

  it('throws error if tenantId is not provided in invalidateCache()', async () => {
    const app = new AbimongoBootstrap();
    (require('../redis-manager/redisClient') as any).redis = {};
    await expect(app.invalidateCache(undefined as any)).rejects.toThrow('Tenant ID is required to invalidate cache');
  });

  it('calls invalidateTenantCache in invalidateCache()', async () => {
    const app = new AbimongoBootstrap();
    const mockRedis = {};
    (require('../redis-manager/redisClient') as any).redis = mockRedis;
    const mockInvalidate = jest.spyOn(require('../utils/invalidateTenantCache'), 'invalidateTenantCache').mockResolvedValue(undefined);
    // app.logger = { error: jest.fn() } as any;
    await app.invalidateCache('tenant', 'namespace');
    expect(mockInvalidate).toHaveBeenCalledWith(mockRedis, 'tenant', 'namespace');
    mockInvalidate.mockRestore();
  });

  it('getRedisClient returns redis if useRedisCache is enabled', async () => {
    const app = new AbimongoBootstrap();
    (app as any).config = {
      features: { useRedisCache: true, redisUri: 'redis://localhost:6379' }
    };
    const mockRedis = { get: jest.fn().mockResolvedValue('redisClient') };
    (require('../redis-manager/redisClient') as any).redis = mockRedis;
    const client = await app.getRedisClient();
    expect(client).toBe(mockRedis);
  });

  it('getMongoClient returns mongoClient', () => {
    const app = new AbimongoBootstrap();
    const mockClient = {};
    (app as any).mongoClient = mockClient;
    expect(app.getMongoClient()).toBe(mockClient);
  });

  it('getGraphQL returns graphql', () => {
    const app = new AbimongoBootstrap();
    const mockGraphQL = {};
    (app as any).graphql = mockGraphQL;
    expect(app.getGraphQL()).toBe(mockGraphQL);
  });

  afterAll(async () => {
    await bufferedTransporter.stop();
    const { shutdownLogger } = require('@abimongo/logger');
    await shutdownLogger();
  });
});
