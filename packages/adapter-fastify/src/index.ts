import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  AbimongoAdapter,
  AbimongoContext,
  createTenancyContext,
  TenancyOptions
} from "@abimongo/adapter-types";

import abimongoClient from '@abimongo/core';

const { TenantContext } = abimongoClient;

/**
 * Registers a Fastify hook that resolves tenant and puts it on request.__abimongo
 * Usage:
 *   const app = fastify();
 *   await registerAbimongoFastify(app, { subdomain: true, fallback: 'public' });
 */
function registerAbimongoFastify(
  app: FastifyInstance,
  opts?: TenancyOptions
) {
  app.addHook("onRequest", async (req: FastifyRequest, _reply: FastifyReply) => {
    try {
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
      const validTid = opts?.validate?.(ctx.tenantId);
      if (validTid instanceof Promise) {
        if (!(await validTid)) {
          throw new Error(`Invalid tenant ID: ${ctx.tenantId}`);
        }
      } else if (validTid === false) {
        throw new Error(`Invalid tenant ID: ${ctx.tenantId}`);
      }

      TenantContext.run(ctx.tenantId, () => { });
    } catch (error) {
     _reply.status(400).send({
        error: "TENANT_RESOLUTION_FAILED",
        message: (error as Error).message
      });

    }
  });
}

export function createFastifyAdapter(app: FastifyInstance): AbimongoAdapter<typeof app> {
  return {
    name: "fastify",
    installTenancy: () => {
      app.register(registerAbimongoFastify);
    }
  };
}
