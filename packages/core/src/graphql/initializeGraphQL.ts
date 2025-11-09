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
  // Defensive runtime check: ensure the generated schema was constructed
  // with the same GraphQL implementation that the consumer app will use.
  // If these differ (even if versions match) Node's module system may have
  // loaded multiple physical copies of `graphql` leading to the familiar
  // "GraphQLSchema from another module or realm" runtime error when
  // using Apollo or other GraphQL servers.
  try {
    // require here to avoid bundling or static analysis differences
    // and to inspect the consumer's resolved graphql at runtime.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const consumerGraphql = require('graphql');
    if (schema && schema.constructor !== consumerGraphql.GraphQLSchema) {
      const resolved = (function tryResolve() {
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          return require.resolve('graphql');
        } catch (e) {
          return 'unknown';
        }
      })();

      throw new Error([
        '[Abimongo] Detected multiple copies/realms of `graphql` at runtime.',
        `GraphQL resolved from: ${resolved}`,
        'This causes the GraphQLSchema constructor to differ between modules and produces the',
        'error: "GraphQLSchema from another module or realm" when starting Apollo or similar servers.',
        'Common fixes:',
        '  * Ensure your application (consumer) has `graphql@16.11.0` installed as a dependency.',
        '  * Add an `overrides` (pnpm) or `resolutions` (yarn) entry in your project to pin `graphql` to 16.11.0.',
        '  * Do NOT install `graphql` inside the abimongo package workspace when developing locally — install it in the consuming app (parent folder).',
        '  * If you are using a local workspace or file: install, prefer running the app from a parent folder where the consumer app has `graphql` installed so module resolution is canonical.',
        'If you need help, run: node -e "console.log(require.resolve(\'graphql\'))" in your app to see which copy is being used.'
      ].join('\n'));
    }
  } catch (err: any) {
    // If require('graphql') fails for some reason, don't hide the original schema — just warn.
    // We still return the schema so downstream callers can decide, but surface the warning.
    // eslint-disable-next-line no-console
    console.warn('[Abimongo] Could not validate graphql constructor compatibility:', err && err.message ? err.message : err);
  }

  return schema;
}
