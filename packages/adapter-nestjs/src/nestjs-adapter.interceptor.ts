import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { runWithAdapterContext } from '@abimongo/adapter-runtime';
import type {
  AbimongoRequestLike
} from '@abimongo/adapter-types';
import type { NestjsAbimongoAdapterOptions } from './nestjs-adapter.types.js';
import { ABIMONGO_ADAPTER_OPTIONS } from './nestjs-adapter.constants.js';

function toAbimongoRequestLike(req: any): AbimongoRequestLike {
  const params: Record<string, string> = {};

  for (const [key, value] of Object.entries(req?.params ?? {})) {
    if (typeof value === 'string') {
      params[key] = value;
    } else if (Array.isArray(value)) {
      params[key] = value[0] ?? '';
    } else if (value != null) {
      params[key] = String(value);
    }
  }

  const cookies =
    req?.cookies && typeof req.cookies === 'object'
      ? Object.fromEntries(
          Object.entries(req.cookies).map(([key, value]) => [key, String(value)])
        )
      : undefined;

  return {
    headers: (req?.headers ?? {}) as Record<string, string | string[] | undefined>,
    url: req?.url,
    method: req?.method,
    params,
    cookies,
    get(name: string) {
      const headerValue = req?.headers?.[name.toLowerCase()];
      return Array.isArray(headerValue) ? headerValue[0] : headerValue;
    }
  };
}

@Injectable()
export class AbimongoNestInterceptor implements NestInterceptor {
  constructor(
    @Inject(ABIMONGO_ADAPTER_OPTIONS)
    private readonly options: NestjsAbimongoAdapterOptions = {}
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const http = context.switchToHttp();
    const req = http.getRequest();

    const adaptedRequest = toAbimongoRequestLike(req);

    return runWithAdapterContext(
      adaptedRequest,
      async () => next.handle(),
      this.options
    );
  }
}