import type { Express, Request, RequestHandler } from 'express';
import type {
  AbimongoAdapter,
  AdapterContextOptions,
  AbimongoRequestLike
} from '@abimongo/adapter-types';
import { runWithAdapterContext } from '@abimongo/adapter-runtime';

function toAbimongoRequestLike(req: Request): AbimongoRequestLike {
  const params: Record<string, string> = {};

  for (const [key, value] of Object.entries(req.params ?? {})) {
    if (typeof value === 'string') {
      params[key] = value;
    } else if (Array.isArray(value)) {
      params[key] = value[0] ?? '';
    } else if (value != null) {
      params[key] = String(value);
    }
  }

  const cookies =
    req.cookies && typeof req.cookies === 'object'
      ? Object.fromEntries(
          Object.entries(req.cookies).map(([key, value]) => [key, String(value)])
        )
      : undefined;

  return {
    headers: req.headers as Record<string, string | string[] | undefined>,
    url: req.url,
    method: req.method,
    params,
    cookies,
    get(name: string) {
      return req.get(name) ?? undefined;
    }
  };
}

export function createExpressAdapter(): AbimongoAdapter<Express> {
  return {
    name: 'express',

    install(app: Express, options: AdapterContextOptions = {}) {
      const middleware: RequestHandler = (req, _res, next) => {
        const adaptedRequest = toAbimongoRequestLike(req);

        void runWithAdapterContext(
          adaptedRequest,
          async () => {
            next();
          },
          options
        ).catch(next);
      };

      app.use('/', middleware);
    }
  };
}