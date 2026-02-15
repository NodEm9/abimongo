import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  AbimongoContext,
  createTenancyContext,
  TenancyOptions
} from "@abimongo/adapter-types";

import { TenantContext } from '@abimongo/core';

/**
 * Registers a Fastify hook that resolves tenant and puts it on request.__abimongo
 * Usage:
 *   const app = fastify();
 *   await registerAbimongoFastify(app, { subdomain: true, fallback: 'public' });
 */
export async function registerAbimongoFastify(
  app: FastifyInstance,
  opts?: TenancyOptions
) {
  app.addHook("onRequest", async (req: FastifyRequest, _reply: FastifyReply) => {
    const ctx: AbimongoContext = await createTenancyContext(
      {
        headers: req.headers as Record<string, string | string[] | undefined>,
        url: req.url,
        method: req.method,
        params: (req.params ?? {}) as Record<string, string>,
        cookies: (req as any).cookies
      },
      opts
    );
    (req as any).__abimongo = ctx;
    TenantContext.run(ctx.tenantId, () => {});
  });
}
