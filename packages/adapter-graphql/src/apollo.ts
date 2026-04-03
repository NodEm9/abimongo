import type { GraphqlAdapterOptions } from './types.js';
import { toGraphqlAbimongoRequestLike } from './graphql-request.js';
import { runWithGraphqlContext } from './graphql-context.js';

export function createApolloContextFactory<TContext extends Record<string, any> = Record<string, any>>(
  options: GraphqlAdapterOptions = {},
  extend?: (input: { req?: any; request?: any }) => Promise<TContext> | TContext
) {
  return async (input: { req?: any; request?: any }) => {
    const rawRequest = input.req ?? input.request;

    const adaptedRequest = toGraphqlAbimongoRequestLike({
      headers: rawRequest?.headers,
      url: rawRequest?.url,
      method: rawRequest?.method,
      cookies: rawRequest?.cookies
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