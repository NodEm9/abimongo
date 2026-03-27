import { loadAbimongoConfig } from '../../config/index.js';
import { setupLogger, logger, Logger } from '@abimongo/logger';
import {
  AbimongoClient,
  createAbimongoClientModule,
  AbimongoModel,
  AbimongoSchema,
  Schema
} from '../index.js';
import { AbimongoGraphQL, initializeGraphQL } from '../../graphql/index.js';
import { redis } from '../../redis-manager/redisClient.js';
import {
  cacheWithRedis,
  configureAbimongoContext,
  Model,
  setLogger
} from '../../utils/index.js';
import { invalidateTenantCache } from '../../utils/invalidateTenantCache.js';
import { initMultiTenancy, InitMultiTenancyOptions } from '../../tanancy/index.js';
import { AbimongoGC, scheduleGarbageCollector } from '../../gc/index.js';
import { colorize } from '../../utils/color-palatte.js';
import { AbimongoAdapter } from '@abimongo/adapter-types';
import type { AbimongoConfig, BootstrapClient, Document } from '../../types/index.js';
import { Collection } from 'mongodb';


const isNode = typeof process !== 'undefined' && process.versions?.node;


type OnConnectHook = () => Promise<void> | void;


export interface RegisterMultiTenancyOptions {
  adapter?: AbimongoAdapter;
  tenants?: Record<string, string>;
  headerKey?: string;
  initOptions?: InitMultiTenancyOptions;
}

/**
 * AbimongoBootstrap is the main entry point for initializing
 * and managing the Abimongo application stack when you opt for the CLI.
 * It handles MongoDB, Redis, and GraphQL setup,
 * along with custom hooks for post-connection logic.
 * @example
 * 
 * ```bash
 * npx abimongo-core my-project 
 * cd my-project
 * ```
 * 
 * This will create a new Abimongo project in the 'my-project' directory.
 * You can then customize the configuration file and start using Abimongo in your application.
 * 
 * ---
 * 
 * Add flags as needed:
 * 
 * ```bash
 * npx abimongo-core my-project --withRedis --withGraphQL --multiTenant
 * cd my-project
 * ```
 * This will create a new Abimongo project with Redis caching, GraphQL support, and multi-tenancy enabled.
 * enabling them in the configuration file.
 * 
 * ---
 * 
 * You can also use AbimongoBootstrap programmatically in your application:
 * ```ts
 * @example
 * import { AbimongoBootstrapFactory } from '@abimongo/core';
 *  async function start() {
 *   const abimongo = await AbimongoBootstrapFactory.create();
 *   const db = abimongo.getMongoClient();
 *   await db.connect();
 *   const graphql = await abimongo.getGraphQL();
 *   // You can now use the GraphQL instance to generate schema or start a server
 *   // or perform other GraphQL related operations
 *  graphql.generateSchema();
 *  abimongo.getRedisClient();
 *  }
 * start();
 * ```
 *
 * @example
 * // With custom configuration file
 * import { AbimongoBootstrapFactory } from '@abimongo/core';
 * export async function start() {
 *  const abimongo = await AbimongoBootstrapFactory.create('path/to/custom-abimongo.config.json');
 * const db = abimongo.getMongoClient();
 * await db.connect();
 *  const graphql = await abimongo.getGraphQL();
 *  // You can now use the GraphQL instance to generate schema or start a server
 * // or perform other GraphQL related operations
 * graphql.generateSchema();
 * abimongo.getRedisClient();
 * }
 * 
 * abimongo.registerMultiTenancy(app, {
 *  'tenant1': 'mongodb://localhost:27017/tenant1db',
 *  'tenant2': 'mongodb://localhost:27017/tenant2db',
 * }, {
 * headerKey: 'x-tenant-id',
 * initOptions: { /* custom options * / } // This where you can lazily initialize tenants if needed
 * });
 * };
  * @param {string} [configFilePathOrObject] - Optional path to a custom configuration file or a config object.
 * If not provided, it defaults to 'abimongo.config.json'.
 * @returns {Promise<void>} - A promise that resolves when the initialization is complete.
 * 
 * // Now you can use abimongo.getMongoClient(), abimongo.getRedisClient(), etc.
 */
export class AbimongoBootstrap {
  private config!: AbimongoConfig;
  private provider!: BootstrapClient;
  private model!: AbimongoModel<Document>;
  private schema!: AbimongoSchema<Document>;
  private graphql?: AbimongoGraphQL;
  private gc?: AbimongoGC;

  public logCfgProperty!: ReturnType<typeof setupLogger> | typeof logger;
  public logger = Logger.instance || logger;

  private adapter?: AbimongoAdapter;
  private onConnectHooks: OnConnectHook[] = [];

  constructor(adapter?: AbimongoAdapter) {
    this.adapter = adapter;
  }

  /**
   * Register a hook to be called after the connection is established.
   */
  public onConnect(hook: OnConnectHook): void {
    this.onConnectHooks.push(hook);
  }

  /**
   * Initializes the Abimongo application stack.
   */
  async initialize(configFilePathOrObject?: string | AbimongoConfig): Promise<void> {
    this.config =
      configFilePathOrObject && typeof configFilePathOrObject === 'object'
        ? (configFilePathOrObject as AbimongoConfig)
        : await loadAbimongoConfig(configFilePathOrObject as string | undefined);

    this.initializeLogger();
    await this.initializeRedis();
    await this.initializeMongoProvider();
    this.initializeSchema();
    await this.initializeModel();
    await this.initializeMultiTenancy();
    await this.initializeGraphQL();
    await this.runOnConnectHooks();
    await this.initializeGarbageCollector();
  }

  private initializeLogger(): void {
    if (!this.config.logger?.enabled) return;

    const loggerConfig = this.config.logger ?? { enabled: false };
    const configuredLogger = loggerConfig.enabled
      ? setLogger(this.config.logger as any)
      : logger;

    this.logCfgProperty = configuredLogger;
    console.log('📝 Logger initialized');
  }

  private async initializeRedis(): Promise<void> {
    if (!this.config.features?.useRedisCache || !this.config.features.redisUri) {
      return;
    }

    await redis.get(this.config.features.redisUri);
    console.log(colorize('Redis connected', 'blue'));
  }

  private async initializeMongoProvider(): Promise<void> {
    const resolvedDbName =
      this.config.connection?.options?.dbName ||
      this.config.projectName ||
      undefined;

    this.provider =
      this.config.mongoClient ??
      this.config.provider ??
      createAbimongoClientModule({
        uri: this.config.connection?.uri!,
        options: {
          dbName: resolvedDbName,
          ...this.config.connection?.options,
        },
      });

    await this.provider.connect();

    configureAbimongoContext(this.provider);

    console.log(colorize('MongoDB connected via AbimongoClientModule', 'blue'));
  }

  private initializeSchema(): void {
    this.schema = new Schema(
      typeof this.config.schema === 'object' ? this.config.schema : {}
    );

    if (this.config.schema) {
      this.schema.registerSchema(this.config.schema);
      console.log(colorize('Schema registered', 'blue'));
    } else {
      console.log(colorize('No schema provided, using default schema', 'yellow'));
    }
  }

  private async initializeModel(): Promise<void> {
    const collectionName = this.config.model?.collectionName || 'default';

    this.model = Model<Document>({
      collectionName,
      schema: this.schema,
      provider: this.provider,
      ctx: this.config.model?.ctx,
      collection: this.config.model?.collection,
      gcConfig: this.config.model?.gcConfig,
    });

    if (this.config.model) {
      await this.model.registerModel({
        ...this.config.model,
        collectionName,
        schema: this.schema,
        provider: this.provider,
      });

      console.log(
        colorize(`Model registered: ${this.config.model.collectionName}`, 'blue')
      );
    }
  }

  private async initializeMultiTenancy(): Promise<void> {
    if (!this.config.multiTenant?.enabled) return;

    const tenants = this.config.multiTenant.tenants || {};
    const initOptions = this.config.multiTenant.initOptions || {};

    await initMultiTenancy(tenants, initOptions);

    if (!this.adapter?.install) {
      console.warn(
        'Multi-tenancy is enabled, but no adapter with installTenancy() was provided. Skipping runtime middleware wiring.'
      );
    } else {
      await this.adapter.install({}, {
        tenancy: {
          header: this.config.multiTenant.headerKey || 'x-tenant-id',
          ...this.config.multiTenant.initOptions,
          resolver: async (req) => {
            const headerKey = this.config?.multiTenant?.headerKey || 'x-tenant-id';
            const tenantId = req.headers?.[headerKey] || (typeof req.get === 'function' ? req.get(headerKey) : undefined);
            if (tenantId) return tenantId as string;
          }
        },

      });
    }

    console.log(colorize('Multi-tenancy initialized', 'blue'));
  }

  private async initializeGraphQL(): Promise<void> {
    if (!this.config.graphql?.enabled) return;

    this.graphql = new AbimongoGraphQL();

    await initializeGraphQL(
      this.config.features?.typeDefs || '',
      this.config.features?.resolvers || {}
    );

    console.log(colorize('GraphQL schema generated', 'blue'));
    console.log(colorize('GraphQL initialized', 'blue'));
  }

  private async runOnConnectHooks(): Promise<void> {
    for (const hook of this.onConnectHooks) {
      await hook();
    }
  }

  private async initializeGarbageCollector(): Promise<void> {
    if (!this.config.advanced?.garbageCollector?.enabled) return;

    const cronExpr = this.config.advanced.gcCron || '0 * * * *';

    if (isNode) {
      scheduleGarbageCollector(cronExpr);
    }

    this.gc = new AbimongoGC({
      enabled: this.config.advanced.garbageCollector.enabled ?? true,
      retentionPeriod: 30,
      cron: this.config.advanced.gcCron || '0 0 * * *',
      logResults: this.config.advanced.garbageCollector.logResults ?? true,
    });

    console.log('✅ Garbage Collector initialized');

    const gcCollection = await this.resolveGCCollection();
    this.gc.register(gcCollection, this.schema);

    console.log('✅ Garbage Collector files registered');
    console.log('Garbage Collector files generated.');
  }

  private async resolveGCCollection(): Promise<Collection<Document>> {
    if (!this.model) {
      throw new Error('Model is not initialized. Cannot register GC collection.');
    }

    const collectionName = this.config.model?.collectionName || 'default';
    const db = await this.provider.db(this.config.model?.ctx);

    if (!db || typeof db.collection !== 'function') {
      throw new Error('Provider db() did not return a valid Db instance for GC registration.');
    }

    return db.collection<Document>(collectionName);
  }


  async registerMultiTenancy<TApp>(
    app: TApp,
    options: RegisterMultiTenancyOptions = {}
  ): Promise<void> {
    if (!this.config.multiTenant?.enabled) {
      throw new Error('Multi-tenancy is not enabled in the configuration');
    }

    const resolvedTenants = this.config.multiTenant.tenants ?? options.tenants;
    if (!resolvedTenants || Object.keys(resolvedTenants).length === 0) {
      throw new Error('Tenants map is required for multi-tenancy');
    }

    const resolvedAdapter = options.adapter ?? this.adapter;
    if (!resolvedAdapter?.install) {
      throw new Error(
        'No tenancy adapter provided. Install @abimongo/adapter-express, @abimongo/adapter-fastify, etc.'
      );
    }

    const headerKey =
      this.config.multiTenant.headerKey ??
      options.headerKey ??
      'x-tenant-id';

    const initOptions =
      this.config.multiTenant.initOptions ??
      options.initOptions ??
      {};

    await initMultiTenancy(resolvedTenants, initOptions);

    await resolvedAdapter.install(app, {
      tenancy: {
        header: headerKey,
        ...initOptions,
        resolver: async (req) => {
          const tenantId = req.headers?.[headerKey] || (typeof req.get === 'function' ? req.get(headerKey) : undefined);
          if (tenantId) return tenantId as string;
          return await resolvedTenants[tenantId as string] ? tenantId as string : undefined;
        }
      },
    });

    console.log(
      `Multi-tenancy initialized via ${resolvedAdapter.name ?? 'adapter'} (header: ${headerKey})`
    );
  }

  public async cache<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: {
      ttlSeconds?: number;
      prefix?: string;
      tenantId?: string;
      namespace?: string;
    } = {}
  ): Promise<T> {
    if (!redis) {
      throw new Error('Redis is not initialized');
    }

    return cacheWithRedis<T>(redis, key, fetcher, options);
  }

  public async invalidateCache(tenantId: string, namespace?: string): Promise<void> {
    if (!redis) {
      throw new Error('No Redis client available');
    }

    if (!tenantId) {
      throw new Error('Tenant ID is required to invalidate cache');
    }

    console.log('Invalidating cache for tenant:', tenantId, 'namespace:', namespace);
    await invalidateTenantCache(redis, tenantId, namespace);
  }

  /**
   * Returns the Redis client if Redis is enabled in the configuration.
   */
  public async getRedisClient(): Promise<typeof redis> {
    if (this.config.features?.useRedisCache && this.config.features.redisUri) {
      await redis.get(this.config.features.redisUri);
    }

    return redis;
  }

  public getMongoClient(): AbimongoClient | BootstrapClient {
    return this.provider;
  }

  public getModel(): AbimongoModel<Document> {
    return this.model;
  }

  public getSchema(): AbimongoSchema<Document> {
    return this.schema;
  }

  public getGraphQL(): AbimongoGraphQL | undefined {
    if (!this.graphql) {
      throw new Error('GraphQL is not initialized.');
    }
    return this.graphql;
  }

  public getGCRunner(): AbimongoGC | undefined {
    if (!this.gc) {
      throw new Error('Garbage Collector is not initialized.');
    }
    return this.gc;
  }

  public async shutdown(): Promise<void> {
    if (redis.isOpen) {
      await redis.disconnect();
      console.log('🧹 Redis connection closed');
    }

    if (this.provider) {
      await this.provider.close();
      console.log('MongoDB connection closed');
    }

    console.log('Shutdown complete');
  }
}


// export class AbimongoBootstrap {
//   private config!: AbimongoConfig;
//   private provider!: BootstrapClient;
//   private model!: AbimongoModel<Document>;
//   private schema!: AbimongoSchema<Document>
//   private graphql!: AbimongoGraphQL;
//   public logCfgProperty!: ReturnType<typeof setupLogger> | typeof logger;
//   public logger = Logger.instance || typeof logger;
//   private adapter?: AbimongoAdapter;
//   private gc!: AbimongoGC;

//   private onConnectHooks: OnConnectHook[] = [];

//   constructor(adapter?: AbimongoAdapter) {
//     this.adapter = adapter;
//   }

//   /**
//    * Register a hook to be called after the connection is established.
//    * This can be used for custom initialization logic that depends on the database being ready.
//    * @param hook - A function that will be called after the connection is established.
//    */
//   public onConnect(hook: OnConnectHook): void {
//     this.onConnectHooks.push(hook);
//   }

//   /**
//    * Initializes the Abimongo application stack.
//    * This method sets up MongoDB, Redis, and GraphQL connections,
//    * and executes any registered onConnect hooks.
//   * @param {string|AbimongoConfig} [configFilePathOrObject] - Optional path to a custom configuration file or a config object.
//   * If not provided, it defaults to 'abimongo.config.json'.
//    */
//   async initialize(configFilePathOrObject?: string | AbimongoConfig): Promise<void> {
//     // allow passing either a path to a config file or a config object
//     if (configFilePathOrObject && typeof configFilePathOrObject === 'object') {
//       this.config = configFilePathOrObject as AbimongoConfig;
//     } else {
//       this.config = await loadAbimongoConfig(configFilePathOrObject as string | undefined);
//     }
//     if (this.config.logger?.enabled) {
//       const loggerConfig = this.config.logger ?? { enabled: false }
//       // Cast to any to satisfy overloads where advanced
//       // //fields (like garbageCollector.logResults) may require a narrower type
//       const loggerConfg = loggerConfig.enabled ? setLogger(this.config.logger as any) : logger;
//       this.logCfgProperty = loggerConfg;
//       console.log('📝 Logger initialized');
//     }

//     // Redis setup (if enabled)
//     if (this.config.features?.useRedisCache && this.config.features.redisUri) {
//       await redis.get(this.config.features.redisUri);
//       console.log(colorize('Redis connected', 'blue'));
//     }

//     // Mongo setup (always required)
//     this.provider =
//       this.config.mongoClient ??
//       this.config.provider ??
//       createAbimongoClientModule({
//         uri: this.config.connection?.uri!,
//         options: {
//           dbName: this.config.connection?.options.dbName
//             || this.config.projectName || undefined,
//           ...this.config.connection?.options
//         },
//       });


//      await this.provider.connect()
//     console.log(colorize('MongoDB connected via AbimongoClientModule', 'blue'));

//     // Register schema if provided
//     this.schema = new Schema(typeof this.config.schema === 'object'
//       ? this.config.schema : {});
//     if (this.config.schema) {
//       this.schema.registerSchema(this.config.schema);
//       console.log(colorize('Schema registered', 'blue'));
//     } else {
//       console.log(colorize('No schema provided, using default schema', 'yellow'));
//     }

//     // Register models if provided
//     this.model = Model<Document>({
//       collectionName: this.config.model?.collectionName || 'default',
//       schema: this.schema,
//       provider: this.provider,
//     });

//     if (this.config.model) {
//       // for (const modelConfig of [this.config.model]) {
//       this.model.registerModel(this.config.model);
//       console.log(colorize(`Model registered: ${this.config.model.collectionName}`, 'blue'));
//       // }
//     }

//     // if (this.config.multiTenant?.enabled) {
//     //   if (!this.adapter?.installTenancy) {
//     //     console.warn(
//     //       `Multi-tenancy is enabled, but no adapter with applyMultiTenancy() was provided. Skipping runtime middleware wiring.`
//     //     )
//     //   } else {
//     //     await this.adapter?.installTenancy(
//     //       {},
//     //       {
//     //         tenants: this.config.multiTenant.tenants || {},
//     //         headerKey: this.config.multiTenant.headerKey || 'x-tenant-id',
//     //         initOptions: this.config.multiTenant.initOptions || {},
//     //       }
//     //     );
//     //   }
//     //   console.log(colorize('Multi-tenancy initialized', 'blue'));
//     // }

//     if (this.config.multiTenant?.enabled) {
//       const tenants = this.config.multiTenant.tenants || {};
//       const initOptions = this.config.multiTenant.initOptions || {};

//       await initMultiTenancy(tenants, initOptions);

//       if (!this.adapter?.installTenancy) {
//         console.warn(
//           `Multi-tenancy is enabled, but no adapter with installTenancy() was provided. Skipping runtime middleware wiring.`
//         );
//       } else {
//         await this.adapter.installTenancy({}, {
//           tenants,
//           headerKey: this.config.multiTenant.headerKey || "x-tenant-id",
//           initOptions,
//         });
//       }

//       console.log(colorize("Multi-tenancy initialized", "blue"));
//     }

//     // GraphQL setup (if enabled)
//     if (this.config.graphql?.enabled) {
//       this.graphql = new AbimongoGraphQL();
//       await initializeGraphQL(
//         this.config.features?.typeDefs || '',
//         this.config.features?.resolvers || {},
//       );
//       console.log(colorize('GraphQL schema generated', 'blue'));
//       console.log(colorize('GraphQL initialized', 'blue'));
//     }

//     for (const hook of this.onConnectHooks) {
//       return await hook();
//     }

//     if (this.config.advanced?.garbageCollector?.enabled) {
//       const cronExpr = this.config.advanced?.gcCron || '0 * * * *'; // hourly default
//       if (isNode) {
//         // load node-only modules dynamically
//         // const { scheduleGarbageCollector } = await import('../../gc/').ts;
//         scheduleGarbageCollector(cronExpr);
//       }

//       const { gcCron } = this.config.advanced;
//       if (!gcCron) {
//         throw new Error('Garbage Collector is not enabled in the configuration');
//       }

//       // Initialize Garbage Collector
//       this.gc = new AbimongoGC({
//         enabled: this.config.advanced?.garbageCollector?.enabled || true,
//         retentionPeriod: 30, // Default to 30 days
//         cron: this.config.advanced?.gcCron || '0 0 * * *', // Default to daily at midnight
//         logResults: this.config.advanced?.garbageCollector?.logResults || true,
//       });

//       // await gc.initialize();
//       console.log('✅ Garbage Collector initialized');

//       // Register GC files
//       this.gc.register(
//         await this.provider.collection<Document>(this.config.model?.collectionName || 'default'),
//         this.schema
//       );
//       console.log('✅ Garbage Collector files registered');
//       console.log('🧹 Garbage Collector files generated.');
//     }
//   };

//   // public async registerMultiTenancy<TApp>(
//   //   app: TApp,
//   //   adapter: typeof this.adapter,
//   //   tenants?: Record<string, string>,
//   //   options?: { headerKey?: string; initOptions?: InitMultiTenancyOptions }
//   // ): Promise<void> {
//   //   if (!this.config.multiTenant?.enabled) {
//   //     throw new Error("Multi-tenancy is not enabled in the configuration");
//   //   }

//   //   const resolvedTenants = this.config.multiTenant.tenants ?? tenants;
//   //   if (!resolvedTenants || Object.keys(resolvedTenants).length === 0) {
//   //     throw new Error("Tenants map is required for multi-tenancy");
//   //   }

//   //   const resolvedOptions = {
//   //     headerKey: this.config.multiTenant.headerKey ?? options?.headerKey ?? "x-tenant-id",
//   //     initOptions: this.config.multiTenant.initOptions ?? options?.initOptions ?? {},
//   //   };

//   //   if (!adapter?.installTenancy) {
//   //     throw new Error("No tenancy adapter provided. Install @abimongo/adapter-express, @abimongo/adapter-fastify, etc.");
//   //   }

//   //   await adapter.installTenancy(app, { tenants: resolvedTenants, ...resolvedOptions });

//   //   console.log(`Multi-tenancy initialized via ${adapter.name ?? "adapter"}, (header: ${resolvedOptions.headerKey})`);
//   // }


//   // public async registerMultiTenancy(
//   //   application: Application,
//   //   tenants: Record<string, string>,
//   //   options: {
//   //     headerKey?: string;
//   //     initOptions?: InitMultiTenancyOptions;
//   //   }): Promise<void> {

//   //   if (!this.config.multiTenant?.enabled) {
//   //     throw new Error('Multi-tenancy is not enabled in the configuration');
//   //   }
//   //   if (!tenants) {
//   //     throw new Error('Tenant ID is required for multi-tenancy');
//   //   }
//   //   await applyMultiTenancy(
//   //     application,
//   //     tenants = this.config.multiTenant?.tenants || tenants,
//   //     options = {
//   //       headerKey: this.config.multiTenant?.headerKey || 'x-tenant-id',
//   //       initOptions: this.config.multiTenant?.initOptions || {},
//   //     }
//   //   )
//   //   console.log(colorize(`Multi-tenancy initialized for tenant: ${tenants}`, 'blue'));
//   // }

//   async registerMultiTenancy<TApp>(
//     app: TApp,
//     adapter: typeof this.adapter,
//     tenants?: Record<string, string>,
//     options?: { headerKey?: string; initOptions?: InitMultiTenancyOptions }
//   ): Promise<void> {
//     if (!this.config.multiTenant?.enabled) {
//       throw new Error("Multi-tenancy is not enabled in the configuration");
//     }

//     const resolvedTenants = this.config.multiTenant.tenants ?? tenants;
//     if (!resolvedTenants || Object.keys(resolvedTenants).length === 0) {
//       throw new Error("Tenants map is required for multi-tenancy");
//     }

//     const resolvedOptions = {
//       headerKey: this.config.multiTenant.headerKey ?? options?.headerKey ?? "x-tenant-id",
//       initOptions: this.config.multiTenant.initOptions ?? options?.initOptions ?? {},
//     };

//     await initMultiTenancy(resolvedTenants, resolvedOptions.initOptions);

//     if (!adapter?.installTenancy) {
//       throw new Error(
//         "No tenancy adapter provided. Install @abimongo/adapter-express, @abimongo/adapter-fastify, etc."
//       );
//     }

//     await adapter.installTenancy(app, {
//       tenants: resolvedTenants,
//       headerKey: resolvedOptions.headerKey,
//       initOptions: resolvedOptions.initOptions,
//     });

//     console.log(
//       `Multi-tenancy initialized via ${adapter.name ?? "adapter"} (header: ${resolvedOptions.headerKey})`
//     );
//   }
//   public async cache<T>(
//     key: string,
//     fetcher: () => Promise<T>,
//     options: {
//       ttlSeconds?: number;
//       prefix?: string;
//       tenantId?: string;
//       namespace?: string;
//     } = {}
//   ): Promise<T> {
//     if (!redis) throw new Error('Redis is not initialized');
//     return await cacheWithRedis<T>(redis, key, fetcher, options);
//   }

//   public async invalidateCache(tenantId: string, namespace?: string) {
//     if (!redis) throw new Error('No Redis client available');
//     if (!tenantId) throw new Error('Tenant ID is required to invalidate cache');
//     console.log('Invalidating cache for tenant:', tenantId, 'namespace:', namespace);
//     await invalidateTenantCache(redis, tenantId, namespace);
//   }

//   /**
//    * Returns the Redis client if Redis is enabled in the configuration.
//    * @returns {Promise<typeof redis>} A promise that resolves to the Redis client.
//    */
//   public getRedisClient(): Promise<typeof redis> {
//     if (this.config.features?.useRedisCache && this.config.features.redisUri) {
//       Promise.resolve(redis.get(this.config.features.redisUri))
//     }
//     return Promise.resolve(redis);

//   }

//   public getMongoClient(): AbimongoClient | BootstrapClient {
//     return this.provider;
//   }

//   // public getLogger(): ReturnType<typeof setupLogger> | typeof logger {
//   //   return this.logger;
//   // };

//   public getModel(): AbimongoModel<Document> {
//     return this.model;
//   }
//   public getSchema(): AbimongoSchema<Document> {
//     return this.schema;
//   }

//   public getGraphQL(): AbimongoGraphQL {
//     return this.graphql;
//   }

//   public getGCRunner(): AbimongoGC {
//     return this.gc;
//   }

//   public async shutdown(): Promise<void> {
//     if (redis.isOpen) {
//       await redis.disconnect();
//       console.log('🧹 Redis connection closed');
//     }

//     if (this.provider) {
//       await this.provider.close();
//       console.log('MongoDB connection closed');
//     }

//     // Add GraphQL shutdown if needed (e.g., Apollo Server)}
//     console.log('Shutdown complete');
//   }
// };