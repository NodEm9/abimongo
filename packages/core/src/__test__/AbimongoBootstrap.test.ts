/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AbimongoModel, AbimongoBootstrap, AbimongoSchema, initAbimongo } from '../lib-core/index.js';
import { redis } from '../redis-manager/index.js';


import { AbimongoGC } from '../gc/AbimongoGC.js';
import * as configLoader from '../config/loadAbimongoConfig.js';
import * as graphqlModule from '../graphql/initializeGraphQL.js';
import * as tenancyModule from '../tanancy/index.js';
import * as loggerModule from '@abimongo/logger';
import type { Collection } from 'mongodb';
import { scheduleGarbageCollector } from '../gc/index.js';


// jest.mock('../config/loadAbimongoConfig', () => ({
//   loadAbimongoConfig: jest.fn().mockResolvedValue({
//     projectName: 'test-app',
//     mongoClient: {
//       connect: jest.fn().mockResolvedValue(undefined),
//       close: jest.fn().mockResolvedValue(undefined),
//       client: jest.fn().mockResolvedValue({
//         collectionName: jest.fn(),
//         dbName: jest.fn()
//       }),
//       collection: jest.fn()
//     },
//     provider: {
//       connect: jest.fn().mockResolvedValue(undefined),
//       close: jest.fn().mockResolvedValue(undefined),
//       client: jest.fn().mockResolvedValue({
//         collectionName: jest.fn(),
//         dbName: jest.fn()
//       }),
//       collection: jest.fn()
//     },
//     connection: {
//       uri: 'mongodb://localhost:27017/abimongo_test',
//       options: { dbName: 'abimongo_test' },
//     },
//     // mongoUri: 'mongodb://localhost:27017/abimongo_test',
//     features: {
//       useRedisCache: true,
//       redisUri: 'redis://localhost:6379'
//     },
//     logger: { enabled: false },
//   }),
// }));

// jest.mock('express', () => ({
//   Application: jest.fn(),
//   Router: jest.fn(),
//   json: jest.fn(),
//   urlencoded: jest.fn(),
//   static: jest.fn(),
//   response: {
//     send: jest.fn(),
//     status: jest.fn().mockReturnThis()
//   }
// }));

// jest.mock('../redis-manager/redisClient', () => ({
//   redis: {
//     get: jest.fn().mockResolvedValue({
//       isOpen: false,
//       connect: jest.fn().mockRejectedValue(new Error('ECONNREFUSED')),
//       disconnect: jest.fn(),
//       publish: jest.fn(),
//     }),
//     isOpen: false,
//     disconnect: jest.fn(),
//   },
//   get: jest.fn().mockResolvedValue({
//     isOpen: false,
//     connect: jest.fn().mockRejectedValue(new Error('ECONNREFUSED')),
//     disconnect: jest.fn(),
//     publish: jest.fn(),
//   }),
// }));


// describe('AbimongoBootstrap', () => {
//   let mockRedis = redis
//   let bootstrap: AbimongoBootstrap;

//   beforeEach(() => {
//     bootstrap = new AbimongoBootstrap();
//     // client = new AbimongoClient('mongodb://localhost:27017/abimongo_test');
//   });

//   it('initializes MongoDB only', async () => {
//     const app = await initAbimongo.create();
//     expect(app.getMongoClient()).toBeDefined();
//     expect(app.getGraphQL()).toBeUndefined();
//   });

//   it('initializes with Redis cache if enabled', async () => {
//     const mockCollection = {};
//     const mockDb = {
//       collection: jest.fn().mockReturnValue(mockCollection),
//     };

//     const mockClient = {
//       connect: jest.fn().mockResolvedValue(undefined),
//       close: jest.fn().mockResolvedValue(undefined),
//       db: jest.fn().mockResolvedValue(mockDb),
//       collection: jest.fn().mockResolvedValue(mockCollection),
//       startSession: jest.fn(),
//     };

//     bootstrap['provider'] = mockClient as any;
//     const app = await initAbimongo.create();

//     // const mockRedis =  jest.fn().mockResolvedValue('redisClient') as any;
//     // (require('../redis-manager/redisClient') as any).redis = mockRedis;

//     const client = await app.getRedisClient();
//     // const expectedClient = await mockRedis.get();
//     const enabledRedisCache = await (app as any).config?.features?.useRedisCache;

//     expect(enabledRedisCache).toBe(true);
//     expect(app.getRedisClient()).toBeDefined();
//   });

//   it('initializes with GraphQL if enabled', async () => {
//     const mockClient = {
//       connect: jest.fn().mockResolvedValue(undefined),
//       db: jest.fn(),
//     };

//     jest.spyOn(AbimongoClient, "init").mockReturnValue(mockClient as any);

//     const app = await initAbimongo.create({
//       provider: mockClient as any,
//       graphql: {
//         enabled: true
//       }
//     });
//     app.getGraphQL = jest.fn().mockReturnValue({
//       schema: {},
//       resolvers: {}
//     });
//     expect(app.getGraphQL()).toBeDefined();
//   });

//   it('runs onConnect hooks', async () => {
//     const app = new AbimongoBootstrap();
//     await app.initialize();
//     await app.getMongoClient().connect()
//     const mockHook = jest.fn();
//     app.onConnect(mockHook);

//     expect(mockHook).toBeDefined();
//   });

//   it('shuts down gracefully', async () => {
//     const mockClient = {
//       connect: jest.fn().mockResolvedValue(undefined),
//       db: jest.fn(),
//       disconnect: jest.fn().mockResolvedValue(undefined),
//       close: jest.fn().mockResolvedValue(undefined),
//     };

//     mockRedis['get'] = jest.fn();

//     // const bootstrap = new AbimongoBootstrap({
//     //   provider: mockClient as any,
//     //   redis: {
//     //     enabled: true,
//     //     host: "127.0.0.1",
//     //     port: 6399,
//     //   },
//     // });

//     jest.spyOn(AbimongoClient, "init").mockReturnValue(mockClient as any);
//     const spy = jest.spyOn(console, 'log').mockImplementation(() => { });

//     const app = await initAbimongo.create();
//     await app.shutdown();
//     console.log('Shutdown complete');

//     expect(spy).toHaveBeenCalledWith('Shutdown complete');
//     spy.mockRestore();
//   });

//   it('throws error if multi-tenancy is not enabled when calling registerMultiTenancy', async () => {
//     const app = new AbimongoBootstrap();
//     // Mock config to not enable multiTenant
//     (app as any).config = {
//       multiTenant: { enabled: false }
//     };
//     await expect(app.registerMultiTenancy({} as any, {} as any, { 'tenant-a': 'uri' }, {})).rejects.toThrow('Multi-tenancy is not enabled in the configuration');
//   });

//   it('throws error if tenantId is not provided in registerMultiTenancy', async () => {
//     const app = new AbimongoBootstrap();
//     (app as any).config = {
//       multiTenant: { enabled: true }
//     };
//     await expect(app.registerMultiTenancy({} as any, undefined as any, {})).rejects.toThrow('Tenants map is required for multi-tenancy');
//   });

//   it('throws error if redis is not initialized in cache()', async () => {
//     const app = new AbimongoBootstrap();
//     (require('../redis-manager/redisClient') as any).redis = undefined;
//     await expect(app.cache('key', async () => 'val')).rejects.toThrow('Redis is not initialized');
//   });

//   it('calls cacheWithRedis in cache()', async () => {
//     const app = new AbimongoBootstrap();
//     const mockRedis = {};
//     (require('../redis-manager/redisClient') as any).redis = mockRedis;
//     const mockCacheWithRedis = jest.spyOn(require('../utils/cacheWithRedis'), 'cacheWithRedis').mockResolvedValue('val');
//     await app.cache('key', async () => 'val');
//     expect(mockCacheWithRedis).toHaveBeenCalled();
//     mockCacheWithRedis.mockRestore();
//   });

//   it('throws error if redis is not available in invalidateCache()', async () => {
//     const app = new AbimongoBootstrap();
//     (require('../redis-manager/redisClient') as any).redis = undefined;
//     await expect(app.invalidateCache('tenant')).rejects.toThrow('No Redis client available');
//   });

//   it('throws error if tenantId is not provided in invalidateCache()', async () => {
//     const app = new AbimongoBootstrap();
//     (require('../redis-manager/redisClient') as any).redis = {};
//     await expect(app.invalidateCache(undefined as any)).rejects.toThrow('Tenant ID is required to invalidate cache');
//   });

//   it('calls invalidateTenantCache in invalidateCache()', async () => {
//     const app = new AbimongoBootstrap();
//     const mockRedis = {};
//     (require('../redis-manager/redisClient') as any).redis = mockRedis;
//     const mockInvalidate = jest.spyOn(require('../utils/invalidateTenantCache'), 'invalidateTenantCache').mockResolvedValue(undefined);
//     // app.logger = { error: jest.fn() } as any;
//     await app.invalidateCache('tenant', 'namespace');
//     expect(mockInvalidate).toHaveBeenCalledWith(mockRedis, 'tenant', 'namespace');
//     mockInvalidate.mockRestore();
//   });

//   it('getRedisClient returns redis if useRedisCache is enabled', async () => {
//     const app = new AbimongoBootstrap();
//     (app as any).config = {
//       features: { useRedisCache: true, redisUri: 'redis://localhost:6379' }
//     };
//     const mockRedis = { get: jest.fn().mockResolvedValue('redisClient') };
//     (require('../redis-manager/redisClient') as any).redis = mockRedis;
//     const client = await app.getRedisClient();
//     expect(client).toBe(mockRedis);
//   });

//   it('getMongoClient returns provider', () => {
//     const app = new AbimongoBootstrap();
//     const mockClient = {};
//     (app as any).provider = mockClient;
//     expect(app.getMongoClient()).toBe(mockClient);
//   });

//   it('getGraphQL returns graphql', () => {
//     const app = new AbimongoBootstrap();
//     const mockGraphQL = {};
//     (app as any).graphql = mockGraphQL;
//     expect(app.getGraphQL()).toBe(mockGraphQL);
//   });

//   afterAll(async () => {
//     await bufferedTransporter.stop();
//     const { shutdownLogger } = require('@abimongo/logger');
//     await shutdownLogger();
//   });
// });

jest.mock('../tanancy/init/initMultiTenancy', () => ({
  initMultiTenancy: jest.fn(),
}));

jest.mock('../gc', () => ({
  ...jest.requireActual('../gc'),
  scheduleGarbageCollector: jest.fn(),
}));



describe('AbimongoBootstrap', () => {
  let bootstrap: AbimongoBootstrap;

  const mockCollection = {} as Collection<Document>;
  const mockDb = {
    collection: jest.fn().mockReturnValue(mockCollection),
  };

  const mockProvider = {
    connect: jest.fn().mockResolvedValue(undefined),
    close: jest.fn().mockResolvedValue(undefined),
    db: jest.fn().mockResolvedValue(mockDb),
  };

  beforeEach(() => {
    bootstrap = new AbimongoBootstrap();

    jest.spyOn(console, 'log').mockImplementation(() => { });
    jest.spyOn(console, 'warn').mockImplementation(() => { });
    jest.spyOn(tenancyModule.MultiTenantManager, 'clearTenants').mockImplementation(() => { });

    jest.clearAllMocks()
  });

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks();
    bootstrap.shutdown();
    bootstrap.getMongoClient()?.close();
  });

  it('should initialize with provided config object', async () => {
    const registerSchemaSpy = jest
      .spyOn(AbimongoSchema.prototype, 'registerSchema')
      .mockImplementation(() => { });
    const registerModelSpy = jest
      .spyOn(AbimongoModel.prototype, 'registerModel')
      .mockResolvedValue(undefined);

    const config = {
      connection: {
        uri: 'mongodb://localhost:27017/testdb',
        options: { dbName: 'testdb' },
      },
      provider: mockProvider,
      schema: { name: { type: String } },
      model: { collectionName: 'users' },
    } as any;

    await bootstrap.initialize(config);

    expect(mockProvider.connect).toHaveBeenCalled();
    expect(registerSchemaSpy).toHaveBeenCalled();
    expect(registerModelSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        collectionName: 'users',
      })
    );
  });

  it('should load config from file path when string is passed', async () => {
    const config = {
      connection: {
        uri: 'mongodb://localhost:27017/testdb',
        options: { dbName: 'testdb' },
      },
      provider: mockProvider,
      model: { collectionName: 'users' },
    } as any;

    const loadConfigSpy = jest
      .spyOn(configLoader, 'loadAbimongoConfig')
      .mockResolvedValue(config);

    const registerModelSpy = jest
      .spyOn(AbimongoModel.prototype, 'registerModel')
      .mockResolvedValue(undefined);

    await bootstrap.initialize('abimongo.config.json');

    expect(loadConfigSpy).toHaveBeenCalledWith('abimongo.config.json');
    expect(registerModelSpy).toHaveBeenCalled();
  });

  it('should initialize logger when enabled', async () => {
    const setLoggerSpy = jest
      .spyOn(loggerModule.Logger, 'initialize')
      .mockReturnValue({ info: jest.fn() } as any);

    const config = {
      logger: { enabled: true },
      connection: {
        uri: 'mongodb://localhost:27017/testdb',
        options: { dbName: 'testdb' },
      },
      provider: mockProvider,
      model: { collectionName: 'users' },
    } as any;

    jest.spyOn(AbimongoModel.prototype, 'registerModel').mockResolvedValue(undefined);

    await bootstrap.initialize(config);

    expect(setLoggerSpy).toHaveBeenCalled();
  });

  it('should initialize redis when enabled', async () => {
    const redisGetSpy = jest.spyOn(redis, 'get').mockResolvedValue('OK' as any);

    const config = {
      features: {
        useRedisCache: true,
        redisUri: 'redis://localhost:6379',
      },
      connection: {
        uri: 'mongodb://localhost:27017/testdb',
        options: { dbName: 'testdb' },
      },
      provider: mockProvider,
      model: { collectionName: 'users' },
    } as any;

    jest.spyOn(AbimongoModel.prototype, 'registerModel').mockResolvedValue(undefined);

    await bootstrap.initialize(config);

    expect(redisGetSpy).toHaveBeenCalledWith('redis://localhost:6379');
  });

  it('should initialize multi-tenancy when enabled', async () => {
    const initMultiTenancyMock =
      tenancyModule.initMultiTenancy as jest.MockedFunction<typeof tenancyModule.initMultiTenancy>;

    initMultiTenancyMock.mockResolvedValue(undefined);

    const config = {
      connection: {
        uri: 'mongodb://localhost:27017/testdb',
        options: { dbName: 'testdb' },
      },
      provider: mockProvider,
      model: { collectionName: 'users' },
      multiTenant: {
        enabled: true,
        tenants: {
          tenant1: 'mongodb://localhost:27017/tenant1db',
          tenant2: 'mongodb://localhost:27017/tenant2db',
        },
        headerKey: 'x-tenant-id',
        initOptions: { lazy: true },
      },
    } as any;

    jest.spyOn(AbimongoModel.prototype, 'registerModel').mockResolvedValue(undefined);

    await bootstrap.initialize(config);

    expect(initMultiTenancyMock).toHaveBeenCalledWith(
      {
        tenant1: 'mongodb://localhost:27017/tenant1db',
        tenant2: 'mongodb://localhost:27017/tenant2db',
      },
      { lazy: true }
    );
  });

  it('should call adapter.installTenancy when adapter is available', async () => {
    const adapter = {
      name: 'express',
      installTenancy: jest.fn().mockResolvedValue(undefined),
    } as any;

    bootstrap = new AbimongoBootstrap(adapter);

    jest.spyOn(tenancyModule, 'initMultiTenancy').mockResolvedValue(undefined);
    jest.spyOn(AbimongoModel.prototype, 'registerModel').mockResolvedValue(undefined);

    const config = {
      connection: {
        uri: 'mongodb://localhost:27017/testdb',
        options: { dbName: 'testdb' },
      },
      provider: mockProvider,
      model: { collectionName: 'users' },
      multiTenant: {
        enabled: true,
        tenants: {
          tenant1: 'mongodb://localhost:27017/tenant1db',
        },
        headerKey: 'x-tenant-id',
        initOptions: { lazy: true },
      },
    } as any;

    await bootstrap.initialize(config);

    expect(adapter.installTenancy).toHaveBeenCalledWith({}, {
      tenants: {
        tenant1: 'mongodb://localhost:27017/tenant1db',
      },
      headerKey: 'x-tenant-id',
      initOptions: { lazy: true },
    });
  });

  it('should initialize GraphQL when enabled', async () => {
    const initializeGraphQLSpy = jest
      .spyOn(graphqlModule, 'initializeGraphQL')
      .mockResolvedValue(undefined);

    jest.spyOn(AbimongoModel.prototype, 'registerModel').mockResolvedValue(undefined);

    const config = {
      connection: {
        uri: 'mongodb://localhost:27017/testdb',
        options: { dbName: 'testdb' },
      },
      provider: mockProvider,
      model: { collectionName: 'users' },
      graphql: { enabled: true },
      features: {
        typeDefs: 'type Query { hello: String }',
        resolvers: { Query: { hello: () => 'world' } },
      },
    } as any;

    await bootstrap.initialize(config);

    expect(initializeGraphQLSpy).toHaveBeenCalledWith(
      'type Query { hello: String }',
      { Query: { hello: expect.any(Function) } }
    );
  });

  it('should run all onConnect hooks', async () => {
    const hook1 = jest.fn().mockResolvedValue(undefined);
    const hook2 = jest.fn().mockResolvedValue(undefined);

    bootstrap.onConnect(hook1);
    bootstrap.onConnect(hook2);

    jest.spyOn(AbimongoModel.prototype, 'registerModel').mockResolvedValue(undefined);

    const config = {
      connection: {
        uri: 'mongodb://localhost:27017/testdb',
        options: { dbName: 'testdb' },
      },
      provider: mockProvider,
      model: { collectionName: 'users' },
    } as any;

    await bootstrap.initialize(config);

    expect(hook1).toHaveBeenCalled();
    expect(hook2).toHaveBeenCalled();
  });
  //   const scheduleGarbageCollectorMock =
  //     scheduleGarbageCollector as jest.MockedFunction<typeof scheduleGarbageCollector>;

  //   const gcRegisterSpy = jest
  //     .spyOn(AbimongoGC.prototype, 'register')
  //     .mockImplementation(async () => { });

  //   jest.spyOn(AbimongoModel.prototype, 'registerModel').mockResolvedValue(undefined);

  //   const config = {
  //     connection: {
  //       uri: 'mongodb://localhost:27017/testdb',
  //       options: { dbName: 'testdb' },
  //     },
  //     provider: mockProvider,
  //     model: { collectionName: 'users', ctx: { dbName: 'testdb' } },
  //     advanced: {
  //       gcCron: '0 * * * *',
  //       garbageCollector: {
  //         enabled: true,
  //         logResults: true,
  //       },
  //     },
  //   } as any;

  //   await bootstrap.initialize(config);
  //   scheduleGarbageCollectorMock.mockImplementation(async () => {});

  //   expect(scheduleGarbageCollectorMock).toHaveBeenCalledWith('0 * * * *');
  //   expect(gcRegisterSpy).toHaveBeenCalledWith(mockCollection, expect.any(AbimongoSchema));
  // });

  it('should initialize garbage collector when enabled', async () => {
    const scheduleGarbageCollectorMock =
      scheduleGarbageCollector as jest.MockedFunction<typeof scheduleGarbageCollector>;

    scheduleGarbageCollectorMock.mockImplementation(() => { });

    const gcRegisterSpy = jest
      .spyOn(AbimongoGC.prototype, 'register')
      .mockImplementation(async () => { });

    jest.spyOn(AbimongoModel.prototype, 'registerModel').mockResolvedValue(undefined);

    const config = {
      connection: {
        uri: 'mongodb://localhost:27017/testdb',
        options: { dbName: 'testdb' },
      },
      provider: mockProvider,
      model: { collectionName: 'users', ctx: { dbName: 'testdb' } },
      advanced: {
        gcCron: '0 * * * *',
        garbageCollector: {
          enabled: true,
          logResults: true,
        },
      },
    } as any;

    await bootstrap.initialize(config);

    expect(scheduleGarbageCollectorMock).toHaveBeenCalledWith('0 * * * *');
    expect(gcRegisterSpy).toHaveBeenCalledWith(mockCollection, expect.any(AbimongoSchema));
  });

  it('should return redis client from getRedisClient', async () => {
    const redisGetSpy = jest.spyOn(redis, 'get').mockResolvedValue('OK' as any);

    (bootstrap as any).config = {
      features: {
        useRedisCache: true,
        redisUri: 'redis://localhost:6379',
      },
    };

    const result = await bootstrap.getRedisClient();

    expect(redisGetSpy).toHaveBeenCalledWith('redis://localhost:6379');
    expect(result).toBe(redis);
  });

  it('should return mongo client provider', () => {
    (bootstrap as any).provider = mockProvider;
    expect(bootstrap.getMongoClient()).toBe(mockProvider);
    bootstrap.getMongoClient()?.close();
  });

  it('should return model', () => {
    const mockModel = {} as AbimongoModel<Document>;
    (bootstrap as any).model = mockModel;
    expect(bootstrap.getModel()).toBe(mockModel);
  });

  it('should return schema', () => {
    const mockSchema = {} as AbimongoSchema<Document>;
    (bootstrap as any).schema = mockSchema;
    expect(bootstrap.getSchema()).toBe(mockSchema);
  });

  it('should shut down redis and provider connections', async () => {
    jest.spyOn(redis, 'disconnect').mockResolvedValue(undefined as any);
    Object.defineProperty(redis, 'isOpen', {
      value: true,
      configurable: true,
    });

    (bootstrap as any).provider = mockProvider;

    await bootstrap.shutdown();

    expect(redis.disconnect).toHaveBeenCalled();
    expect(mockProvider.close).toHaveBeenCalled();
  });
});

describe('AbimongoBootstrap registerMultiTenancy', () => {
  let bootstrap: AbimongoBootstrap;
  let adapter: any;

  beforeEach(() => {
    adapter = {
      name: 'express',
      installTenancy: jest.fn().mockResolvedValue(undefined),
    };

    bootstrap = new AbimongoBootstrap(adapter);

    (bootstrap as any).config = {
      multiTenant: {
        enabled: true,
        tenants: {
          tenant1: 'mongodb://localhost:27017/tenant1db',
        },
        headerKey: 'x-tenant-id',
        initOptions: { lazy: true },
      },
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
    bootstrap.getMongoClient()?.close();
  });

  it('should register multi-tenancy using instance adapter', async () => {
    const initMultiTenancyMock =
      tenancyModule.initMultiTenancy as jest.MockedFunction<typeof tenancyModule.initMultiTenancy>;

    initMultiTenancyMock.mockResolvedValue(undefined);

    await bootstrap.registerMultiTenancy({} as any, {});

    expect(initMultiTenancyMock).toHaveBeenCalledWith(
      { tenant1: 'mongodb://localhost:27017/tenant1db' },
      { lazy: true }
    );

    expect(adapter.installTenancy).toHaveBeenCalledWith(
      {},
      {
        tenants: { tenant1: 'mongodb://localhost:27017/tenant1db' },
        headerKey: 'x-tenant-id',
        initOptions: { lazy: true },
      }
    );
  });

  it('should throw if multi-tenancy is disabled', async () => {
    (bootstrap as any).config = {
      multiTenant: {
        enabled: false,
      },
    };

    await expect(
      bootstrap.registerMultiTenancy({} as any, {})
    ).rejects.toThrow('Multi-tenancy is not enabled in the configuration');
  });

  it('should throw if no adapter is available', async () => {
    bootstrap = new AbimongoBootstrap();

    (bootstrap as any).config = {
      multiTenant: {
        enabled: true,
        tenants: {
          tenant1: 'mongodb://localhost:27017/tenant1db',
        },
      },
    };

    await expect(
      bootstrap.registerMultiTenancy({} as any, {})
    ).rejects.toThrow(
      'No tenancy adapter provided. Install @abimongo/adapter-express, @abimongo/adapter-fastify, etc.'
    );

    bootstrap.getMongoClient()?.close();
  });
});