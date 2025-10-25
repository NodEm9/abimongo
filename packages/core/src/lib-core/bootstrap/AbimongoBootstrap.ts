import { loadAbimongoConfig } from '../../config';
import { AbimongoConfig, Document } from '../../types';
// import { setupLogger, logger } from '@abimongo/logger';
import { AbimongoClient } from '../AbimongoClient';
import { AbimongoGraphQL, initializeGraphQL } from '../../graphql';
import chalk from 'chalk';
import { redis } from '../../redis-manager/redisClient';
import { cacheWithRedis, createModel } from '../../utils';
import { invalidateTenantCache } from '../../utils/invalidateTenantCache';
import { applyMultiTenancy, InitMultiTenancyOptions } from '../../tanancy';
import { Application } from 'express';
import { AbimongoModel } from '../AbimongoModelFactory';
import { AbimongoSchema, Schema } from '../AbimongoSchema';
import { AbimongoGC } from '../../gc';
import { scheduleGarbageCollector } from '../../gc/gcCron.node';


const isNode = typeof process !== 'undefined' && process.versions?.node;


type OnConnectHook = () => Promise<void> | void;

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
 * @method initialize
 * @param {string} [configFilePath] - Optional path to a custom configuration file.
 * If not provided, it defaults to 'abimongo.config.json'.
 * @returns {Promise<void>} - A promise that resolves when the initialization is complete.
 * 
 * // Now you can use abimongo.getMongoClient(), abimongo.getRedisClient(), etc.
 */
export class AbimongoBootstrap {
  private config!: AbimongoConfig;
  private mongoClient!: AbimongoClient;
  private model!: AbimongoModel<Document>;
  private schema!: AbimongoSchema<Document>
  private graphql!: AbimongoGraphQL;
  // public logger!: ReturnType<typeof setupLogger> | typeof logger;
  private app?: Application = undefined;
  private gc!: AbimongoGC;

  private onConnectHooks: OnConnectHook[] = [];

  constructor() { }

  /**
   * Register a hook to be called after the connection is established.
   * This can be used for custom initialization logic that depends on the database being ready.
   * @param hook - A function that will be called after the connection is established.
   */
  public onConnect(hook: OnConnectHook): void {
    this.onConnectHooks.push(hook);
  }

  /**
   * Initializes the Abimongo application stack.
   * This method sets up MongoDB, Redis, and GraphQL connections,
   * and executes any registered onConnect hooks.
   * @param configFilePath - Optional path to a custom configuration file.
   * If not provided, it defaults to 'abimongo.config.json'.
   */
  public async initialize(configFilePath?: string): Promise<void> {
    this.config = await loadAbimongoConfig(configFilePath);
    // if (this.config.logger?.enabled) {
    //   const loggerConfig = this.config.logger ?? { enabled: false }
    //   const loggerConfg = loggerConfig.enabled ? setLogger(this.config.logger) : logger;
    //   this.logger = loggerConfg;
    //   console.info('📝 Logger initialized');
    // }
    // Redis setup (if enabled)
    if (this.config.features?.useRedisCache && this.config.features.redisUri) {
      await redis.get(this.config.features.redisUri);
      console.info(chalk.green('✅ Redis connected'));
    }

    // Mongo setup (always required)
    this.mongoClient = new AbimongoClient(
      this.config.mongoUri || this.config.multiTenant?.tenants?.[''],
      {
        dbName: this.config.projectName || undefined,
      });
    await this.mongoClient.connect();
    console.info(chalk.green('✅ MongoDB connected via AbimongoClient'));

    // Register schema if provided
    this.schema = new Schema(typeof this.config.schema === 'object'
      ? this.config.schema : {});
    if (this.config.schema) {
      this.schema.registerSchema(this.config.schema);
      console.info(chalk.green('✅ Schema registered'));
    } else {
      console.info(chalk.yellow('⚠️ No schema provided, using default schema'));
    }

    // Register models if provided
    this.model = new AbimongoModel<Document>({
      collectionName: `${this.mongoClient.getCollection('default')}`,
      schema: this.schema,
      tenantId: this.config.multiTenant?.enabled
        ? this.config.multiTenant.tenants?.[''] || undefined
        : undefined,
      client: this.mongoClient.client,
    });

    this.model = createModel({
      name: this.config.model?.collectionName || 'default',
      schema: this.schema,
      tenantId: this.config.multiTenant?.enabled
        ? this.config.multiTenant.tenants?.[''] || undefined
        : undefined,
      client: this.mongoClient.client,
    })

    if (this.config.model) {
      // for (const modelConfig of [this.config.model]) {
      this.model.registerModel(this.config.model);
      console.info(chalk.green(`✅ Model registered: ${this.config.model.collectionName}`));
      // }
    }

    if (this.config.multiTenant?.enabled) {
      await this.registerMultiTenancy(
        this.app as Application,
        this.config.multiTenant.tenants || {},
        {
          headerKey: this.config.multiTenant.headerKey || 'x-tenant-id',
          initOptions: this.config.multiTenant.initOptions || {},
        }
      ).catch((error) => {
        console.error(chalk.red('❌ Error initializing multi-tenancy:', error));
      });
    }

    // GraphQL setup (if enabled)
    if (this.config.graphql?.enabled) {
      this.graphql = new AbimongoGraphQL();
      await initializeGraphQL(
        this.config.features?.typeDefs || '',
        this.config.features?.resolvers || {},
      );
      console.info(chalk.green('✅ GraphQL schema generated'));
      console.info(chalk.green('✅ GraphQL initialized'));
    }

    for (const hook of this.onConnectHooks) {
      await hook();
    }

    if (this.config.advanced?.garbageCollector?.enabled) {
      const cronExpr = this.config.advanced?.gcCron || '0 * * * *'; // hourly default
      if (isNode) {
        // load node-only modules dynamically
        // const { scheduleGarbageCollector } = await import('../../gc/').ts;
        scheduleGarbageCollector(cronExpr);
      }

      // if (typeof window === 'undefined') {
      //   const { scheduleGarbageCollector } = require('../../gc');
      //   scheduleGarbageCollector(cronExpr);
      //   console.info(`[ABIMONGO] 🚮 Garbage Collector scheduled with "${cronExpr}"`);
      // }

      const { gcCron } = this.config.advanced;
      if (!gcCron) {
        throw new Error('Garbage Collector is not enabled in the configuration');
      }

      // Initialize Garbage Collector
      this.gc = new AbimongoGC({
        enabled: this.config.advanced?.garbageCollector?.enabled || true,
        retentionPeriod: 30, // Default to 30 days
        cron: this.config.advanced?.gcCron || '0 0 * * *', // Default to daily at midnight
        logResults: this.config.advanced?.garbageCollector?.logResults || true,
      });

      // await gc.initialize();
      console.info('✅ Garbage Collector initialized');

      // Register GC files
      this.gc.register(
        this.mongoClient.getCollection<Document>(this.config.model?.collectionName || 'default'),
        this.schema
      );
      console.info('✅ Garbage Collector files registered');
      console.log('🧹 Garbage Collector files generated.');
    }
  };

  public async registerMultiTenancy(
    application: Application,
    tenants: Record<string, string>,
    options: {
      headerKey?: string;
      initOptions?: InitMultiTenancyOptions;
    }): Promise<void> {

    if (!this.config.multiTenant?.enabled) {
      throw new Error('Multi-tenancy is not enabled in the configuration');
    }
    if (!tenants) {
      throw new Error('Tenant ID is required for multi-tenancy');
    }
    await applyMultiTenancy(
      application,
      tenants = this.config.multiTenant?.tenants || tenants,
      options = {
        headerKey: this.config.multiTenant?.headerKey || 'x-tenant-id',
        initOptions: this.config.multiTenant?.initOptions || {},
      }
    )
    console.log(chalk.green(`✅ Multi-tenancy initialized for tenant: ${tenants}`));
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
    if (!redis) throw new Error('Redis is not initialized');
    return await cacheWithRedis<T>(redis, key, fetcher, options);
  }

  public async invalidateCache(tenantId: string, namespace?: string) {
    if (!redis) throw new Error('No Redis client available');
    if (!tenantId) throw new Error('Tenant ID is required to invalidate cache');
    console.log('Invalidating cache for tenant:', tenantId, 'namespace:', namespace);
    await invalidateTenantCache(redis, tenantId, namespace);
  }

  /**
   * Returns the Redis client if Redis is enabled in the configuration.
   * @returns {Promise<typeof redis>} A promise that resolves to the Redis client.
   */
  public getRedisClient(): Promise<typeof redis> {
    if (this.config.features?.useRedisCache && this.config.features.redisUri) {
      Promise.resolve(redis.get(this.config.features.redisUri))
    }
    return Promise.resolve(redis);

  }

  public getMongoClient(): AbimongoClient | undefined {
    return this.mongoClient;
  }

  // public getLogger(): ReturnType<typeof setupLogger> | typeof logger {
  //   return this.logger;
  // };

  public getModel(): AbimongoModel<Document> | undefined {
    return this.model;
  }
  public getSchema(): AbimongoSchema<Document> | undefined {
    return this.schema;
  }

  public getGraphQL(): AbimongoGraphQL | undefined {
    return this.graphql;
  }

  public getGCRunner(): AbimongoGC | undefined {
    return this.gc;
  }

  public async shutdown(): Promise<void> {
    if (redis.isOpen) {
      await redis.disconnect();
      console.info('🧹 Redis connection closed');
    }

    if (this.mongoClient) {
      await this.mongoClient.disconnect();
      console.info('🧹 MongoDB connection closed');
    }

    // Add GraphQL shutdown if needed (e.g., Apollo Server)}
    console.info('🧼 Shutdown complete');
  }
};

