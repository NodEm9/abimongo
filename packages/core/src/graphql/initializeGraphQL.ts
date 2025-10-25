import { AbimongoGraphQL } from './index';
import { AbimongoConfig } from '../types';

/**
 * Initializes GraphQL with optional custom type definitions and resolvers.
 * Sets up Redis subscription for GraphQL messages.
 *
 * @param {string[]} customTypeDefs - Optional custom GraphQL type definitions.
 * @param {any[]} customResolvers - Optional custom GraphQL resolvers.
 * @returns {Promise<GraphQLSchema>} The generated GraphQL schema.
 */
export async function initializeGraphQL(customTypeDefs: string = "", customResolvers: any = {}): Promise<any> {
  const enableGraphQl: AbimongoConfig['graphql'] = { subscriptions: true, };

  if (!enableGraphQl?.subscriptions) {
    console.warn('[Abimongo] GraphQL subscriptions are disabled. Skipping Redis connection.');
  }

  const gql = new AbimongoGraphQL({
    useRedis: enableGraphQl?.enabled,
    schemaOutputPath: enableGraphQl.schemaOutputPath,
    enablePlayground: enableGraphQl.playground,
    enableSubscriptions: enableGraphQl.subscriptions,
  });

  // Optionally register your app’s own types and resolvers
  if (customTypeDefs.length > 0) {
    gql.customTypeDefs(customTypeDefs);
  }

  if (customResolvers.length > 0) {
    gql.customResolvers(customResolvers);
  }

  const schema = await gql.generateSchema();
  return schema;
}
