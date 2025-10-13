import { AbimongoConfig } from "../../types";
import { AbimongoBootstrap } from "./AbimongoBootstrap";

/**
 * Factory class to create an instance of AbimongoBootstrap.
 * This class encapsulates the logic for initializing the Abimongo application stack,
 * including MongoDB, Redis, and GraphQL setup.
 * It can be used to create a fully configured Abimongo instance
 * with optional configuration parameters.
 * @example
 * const abimongo = await AbimongoBootstrapFactory.create({
 *  mongoUri: 'mongodb://localhost:27017/mydb',
 * graphql: {
 *   enabled: true,
 *  schemaPath: './schema.graphql',
 *  resolversPath: './resolvers',
 *  context: () => ({ user: null }),
 * features: {
 *  useRedisCache: true,
 * redisUri: 'redis://localhost:6379',
 * },
 * });
 */
export class AbimongoBootstrapFactory {
  static async create(config?: AbimongoConfig): Promise<AbimongoBootstrap> {
    const bootstrap = new AbimongoBootstrap();
    await bootstrap.initialize(config as string | undefined);
    return bootstrap;
  }
}
