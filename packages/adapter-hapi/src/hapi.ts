// src/hapi.ts
import type { Server, Lifecycle, Request } from "@hapi/hapi";
import {
  AbimongoContext,
  createTenancyContext,
  TenancyOptions
} from "@abimongo/adapter-types";

/**
 * Registers an onPreHandler extension to resolve tenant for each request.
 *
 * Usage:
 *   await registerAbimongoHapi(server, { header: 'x-tenant-id', fallback: 'public' });
 */
export async function registerAbimongoHapi(
  server: Server,
  opts?: TenancyOptions
) {
  server.ext("onPreHandler", async (request, h) => {
    const ctx: AbimongoContext = await createTenancyContext(hapiToAbimongoReq(request), opts);
    (request as any).abimongo = ctx;
    return h.continue;
  });
}

function hapiToAbimongoReq(request: Request) {
  const headers: Record<string, string | string[] | undefined> = {};
  for (const [key, value] of Object.entries(request.headers)) {
    headers[key.toLowerCase()] = value as any;
	}

  return {
    headers,
    url: request.url.pathname,
    method: request.method.toUpperCase(),
    params: request.params as Record<string, string>,
    cookies: request.state as Record<string, string>
  };
}
