import type { GraphqlAdapterOptions } from './types.js';
import { toGraphqlAbimongoRequestLike } from './graphql-request.js';
import { runWithGraphqlContext } from './graphql-context.js';

export function createYogaContextFactory<TContext extends Record<string, any> = Record<string, any>>(
  options: GraphqlAdapterOptions = {},
  extend?: (input: { request: Request }) => Promise<TContext> | TContext
) {
  return async (input: { request: Request }) => {
    const adaptedRequest = toGraphqlAbimongoRequestLike({
      headers: input.request.headers,
      url: input.request.url,
      method: input.request.method
    });

    const extraContext = extend ? await extend(input) : ({} as TContext);

    await runWithGraphqlContext(
      adaptedRequest,
      async () => undefined,
      options
    );

    return {
      ...extraContext
    };
  };
}