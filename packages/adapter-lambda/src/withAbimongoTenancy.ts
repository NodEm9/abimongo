import type { LambdaAdapterInput } from "./index";
import type { AbimongoContext } from "@abimongo/adapter-types";
import { createLambdaAdapter, type LambdaAdapterOptions } from "./index";

export function withAbimongoTenancy<TRes = any>(
  handler: (args: { event: any; context: any; abimongo: AbimongoContext }) => Promise<TRes> | TRes,
  options: LambdaAdapterOptions = {}
) {
  const adapter = createLambdaAdapter(options);

  return async (event: any, context: any) => {
    const abimongo = await adapter.createContext({ event, context } as LambdaAdapterInput);
    return handler({ event, context, abimongo });
  };
}

import { createTenancyContext, type TenancyOptions } from "@abimongo/adapter-types";
import { TenantContext } from "@abimongo/core";

export function withTenancyLambda<TEvent extends { headers?: any }, TResult>(
  handler: (event: TEvent) => Promise<TResult>,
  opts?: TenancyOptions
) {
  return async (event: TEvent): Promise<TResult> => {
    const ctx = await createTenancyContext(
      {
        headers: event.headers ?? {},
        method: (event as any).requestContext?.http?.method,
        url: (event as any).rawPath,
      },
      opts
    );

    return await new Promise<TResult>((resolve, reject) => {
      TenantContext.run(ctx.tenantId, async () => {
        try {
          resolve(await handler(event));
        } catch (e) {
          reject(e);
        }
      });
    });
  };
}
