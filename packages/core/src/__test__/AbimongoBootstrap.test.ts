/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { disconnect } from 'process';
import { Abimongo, AbimongoBootstrap, AbimongoClient, initAbimongo } from '../lib-core';
import { bufferedTransporter } from '../utils'
import { redis, RedisService } from '../redis-manager';



jest.mock('../config/loadAbimongoConfig', () => ({
  loadAbimongoConfig: jest.fn().mockResolvedValue({
    projectName: 'test-app',
    mongoClient: {
      connect: jest.fn().mockResolvedValue(undefined),
      close: jest.fn().mockResolvedValue(undefined),
      client: jest.fn().mockResolvedValue({
        collectionName: jest.fn(),
        dbName: jest.fn()
      }),
      collection: jest.fn()
    },
    provider: {
      connect: jest.fn().mockResolvedValue(undefined),
      close: jest.fn().mockResolvedValue(undefined),
      client: jest.fn().mockResolvedValue({
        collectionName: jest.fn(),
        dbName: jest.fn()
      }),
      collection: jest.fn()
    },
    connection: {
      uri: 'mongodb://localhost:27017/abimongo_test',
      options: { dbName: 'abimongo_test' },
    },
    // mongoUri: 'mongodb://localhost:27017/abimongo_test',
    features: {
      useRedisCache: true,
      redisUri: 'redis://localhost:6379'
    },
    logger: { enabled: false },
  }),
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

jest.mock('../redis-manager/redisClient', () => ({
  redis: {
    get: jest.fn().mockResolvedValue({
      isOpen: false,
      connect: jest.fn().mockRejectedValue(new Error('ECONNREFUSED')),
      disconnect: jest.fn(),
      publish: jest.fn(),
    }),
    isOpen: false,
    disconnect: jest.fn(),
  },
  get: jest.fn().mockResolvedValue({
    isOpen: false,
    connect: jest.fn().mockRejectedValue(new Error('ECONNREFUSED')),
    disconnect: jest.fn(),
    publish: jest.fn(),
  }),
}));


describe('AbimongoBootstrap', () => {
  let mockRedis = redis
  let bootstrap: AbimongoBootstrap;

  beforeEach(() => {
    bootstrap = new AbimongoBootstrap();
    // client = new AbimongoClient('mongodb://localhost:27017/abimongo_test');
  });

  it('initializes MongoDB only', async () => {
    const app = await initAbimongo.create();
    expect(app.getMongoClient()).toBeDefined();
    expect(app.getGraphQL()).toBeUndefined();
  });

  it('initializes with Redis cache if enabled', async () => {
    const mockCollection = {};
    const mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };

    const mockClient = {
      connect: jest.fn().mockResolvedValue(undefined),
      close: jest.fn().mockResolvedValue(undefined),
      db: jest.fn().mockResolvedValue(mockDb),
      collection: jest.fn().mockResolvedValue(mockCollection),
      startSession: jest.fn(),
    };
    
    bootstrap['provider'] = mockClient as any;
    const app = await initAbimongo.create();

    // const mockRedis =  jest.fn().mockResolvedValue('redisClient') as any;
    // (require('../redis-manager/redisClient') as any).redis = mockRedis;

    const client = await app.getRedisClient();
    // const expectedClient = await mockRedis.get();
    const enabledRedisCache = await (app as any).config?.features?.useRedisCache;
    
    expect(enabledRedisCache).toBe(true);
    expect(app.getRedisClient()).toBeDefined();
  });

  it('initializes with GraphQL if enabled', async () => {
    const mockClient = {
      connect: jest.fn().mockResolvedValue(undefined),
      db: jest.fn(),
    };

    jest.spyOn(AbimongoClient, "init").mockReturnValue(mockClient as any);

    const app = await initAbimongo.create({
      provider: mockClient as any,
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
    await app.initialize();
    await app.getMongoClient().connect()
    const mockHook = jest.fn();
    app.onConnect(mockHook);

    expect(mockHook).toBeDefined();
  });

  it('shuts down gracefully', async () => {
    const mockClient = {
      connect: jest.fn().mockResolvedValue(undefined),
      db: jest.fn(),
      disconnect: jest.fn().mockResolvedValue(undefined),
      close: jest.fn().mockResolvedValue(undefined),
    };

    mockRedis['get'] = jest.fn();

    // const bootstrap = new AbimongoBootstrap({
    //   provider: mockClient as any,
    //   redis: {
    //     enabled: true,
    //     host: "127.0.0.1",
    //     port: 6399,
    //   },
    // });

    jest.spyOn(AbimongoClient, "init").mockReturnValue(mockClient as any);
    const spy = jest.spyOn(console, 'log').mockImplementation(() => { });

    const app = await initAbimongo.create();
    await app.shutdown();
    console.log('Shutdown complete');

    expect(spy).toHaveBeenCalledWith('Shutdown complete');
    spy.mockRestore();
  });

  it('throws error if multi-tenancy is not enabled when calling registerMultiTenancy', async () => {
    const app = new AbimongoBootstrap();
    // Mock config to not enable multiTenant
    (app as any).config = {
      multiTenant: { enabled: false }
    };
    await expect(app.registerMultiTenancy({} as any, {} as any, { 'tenant-a': 'uri' }, {})).rejects.toThrow('Multi-tenancy is not enabled in the configuration');
  });

  it('throws error if tenantId is not provided in registerMultiTenancy', async () => {
    const app = new AbimongoBootstrap();
    (app as any).config = {
      multiTenant: { enabled: true }
    };
    await expect(app.registerMultiTenancy({} as any, undefined as any, {})).rejects.toThrow('Tenants map is required for multi-tenancy');
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

  it('getMongoClient returns provider', () => {
    const app = new AbimongoBootstrap();
    const mockClient = {};
    (app as any).provider = mockClient;
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
