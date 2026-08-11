import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type {
  AbimongoAdapter,
  AdapterContextOptions,
  AbimongoRequestLike
} from '@abimongo/adapter-types';
import { runWithAdapterContext } from '@abimongo/adapter-runtime';

function toAbimongoRequestLike(req: FastifyRequest): AbimongoRequestLike {
  return {
    headers: req.headers as Record<string, string | string[] | undefined>,
    url: req.url,
    method: req.method,
    params: (req.params ?? {}) as Record<string, string>,
    get(name: string) {
      const value = req.headers?.[name.toLowerCase()];
      return Array.isArray(value) ? value[0] : value;
    }
  };
}

export function createFastifyAdapter(): AbimongoAdapter<FastifyInstance> {
  return {
    name: 'fastify',

    install(app: FastifyInstance, options: AdapterContextOptions = {}) {
      app.addHook('preHandler', async (request: FastifyRequest, _reply: FastifyReply) => {
        const adaptedRequest = toAbimongoRequestLike(request);

        await runWithAdapterContext(
          adaptedRequest,
          async () => {
            // Establish context for downstream lifecycle
          },
          options
        );
      });
    }
  };
}