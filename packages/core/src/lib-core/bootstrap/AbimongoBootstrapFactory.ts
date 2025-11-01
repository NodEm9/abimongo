import { AbimongoConfig } from "../../types";
import { AbimongoBootstrap } from "./AbimongoBootstrap";

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
class AbimongoBootstrapFactory {
  static async create(config?: AbimongoConfig): Promise<AbimongoBootstrap> {
    const bootstrap = new AbimongoBootstrap();
    await bootstrap.initialize(config as string | undefined);
    return bootstrap;
  }
}

export { AbimongoBootstrapFactory as initAbimongo };
