import type { AbimongoAdapter } from '@abimongo/adapter-types';
import { AbimongoConfig } from "../../types/AbimongoConfig.js";
import { AbimongoBootstrap } from "./AbimongoBootstrap.js";


export interface AbimongoBootstrapFactoryOptions {
  config?: string | AbimongoConfig;
  adapter?: AbimongoAdapter; 
}

/**
 * Factory class to create an instance of AbimongoBootstrap.
 * This class encapsulates the logic for initializing the Abimongo application stack,
 * including MongoDB, Redis, and GraphQL setup.
 * It can be used to create a fully configured Abimongo instance
 * with optional configuration parameters.
 * @example
 * const abimongo = await AbimongoBootstrapFactory.create();
 * const db = abimongo.getMongoClient();
 * await db.connect();
 * const graphql = await abimongo.getGraphQL();
 * // You can now use the GraphQL instance to generate schema or start a server
 * // or perform other GraphQL related operations
 * graphql.generateSchema();
 * abimongo.getRedisClient();
 * // or with custom config
 * const abimongo = await AbimongoBootstrapFactory.create(customConfig);
 * @param {AbimongoConfig} [config] - Optional configuration object for Abimongo.
 * @returns {Promise<AbimongoBootstrap>} - A promise that resolves to an instance of AbimongoBootstrap.
 */

export class AbimongoBootstrapFactory {
  static async create(
    options: AbimongoBootstrapFactoryOptions = {}
  ): Promise<AbimongoBootstrap> {
    const bootstrap = new AbimongoBootstrap(options.adapter);
    await bootstrap.initialize(options.config);
    return bootstrap;
  }
}

export { AbimongoBootstrapFactory as initAbimongo };
