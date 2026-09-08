// src/koa.ts
import type { Middleware } from "koa";
import {
  AbimongoContext,
  createTenancyContext,
  TenancyOptions
} from "@abimongo/adapter-types";

/**
 * Koa middleware that attaches `ctx.state.abimongo = { tenantId }`
 *
 * Usage:
 *   app.use(abimongoKoa({ header: 'x-tenant-id', fallback: 'public' }));
 */
export function abimongoKoa(opts?: TenancyOptions): Middleware {
  return async (ctx, next) => {
    const headers: Record<string, string | string[] | undefined> = {};
    for (const [key, value] of Object.entries(ctx.request.headers)) {
      headers[key.toLowerCase()] = value as any;
    }

    const tenancyCtx: AbimongoContext = await createTenancyContext(
      {
        headers,
        url: ctx.request.url,
        method: ctx.request.method,
        params: ctx.params as Record<string, string>,
        cookies: ctx.cookies ? Object.fromEntries(
          // simple cookie mapping; customize as needed
          (ctx.cookies as any).get
            ? [] // if you don’t want to parse all cookies here
            : []
        ) : undefined
      },
      opts
    );

    ctx.state.abimongo = tenancyCtx;
    await next();
  };
}
