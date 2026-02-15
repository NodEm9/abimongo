import {
  AbimongoContext,
  createTenancyContext,
  TenancyOptions
} from "@abimongo/adapter-types";

export interface GraphQLHttpLikeRequest {
  headers?: Record<string, string | string[] | undefined>;
  url?: string;
  method?: string;
}

/**
 * Generic context wrapper for GraphQL servers.
 *
 * You pass your existing base context function (or null),
 * and it returns a new function that adds `abimongo` to the context.
 */
export function withAbimongoContext<TBaseCtx = any, TGraphQLCtx = any>(
  baseContextFn?: (ctx: TGraphQLCtx) => Promise<TBaseCtx> | TBaseCtx,
  opts?: TenancyOptions
) {
  return async (ctx: TGraphQLCtx & { req?: any; request?: any }): Promise<
    TBaseCtx & { abimongo: AbimongoContext }
  > => {
    const req = ctx.req ?? ctx.request ?? {};
    const headers =
      req.headers ??
      (req.http && req.http.headers && Object.fromEntries(req.http.headers)) ??
      {};
    const url = req.url ?? req.raw?.url ?? req.path;
    const method = req.method ?? req.raw?.method;

    const abimongoCtx = await createTenancyContext(
      {
        headers,
        url,
        method,
        params: req.params,
        cookies: req.cookies
      },
      opts
    );

    const base = baseContextFn ? await baseContextFn(ctx) : ({} as TBaseCtx);

    return {
      ...base,
      abimongo: abimongoCtx
    };
  };
}
