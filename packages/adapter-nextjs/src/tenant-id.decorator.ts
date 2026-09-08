import {
  createParamDecorator,
  ExecutionContext
} from "@nestjs/common";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { GqlExecutionContext } from "@nestjs/graphql";

export const TenantId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | undefined => {
    const type = ctx.getType<"http" | "rpc" | "graphql">();

    if (type === "http") {
      const req = ctx.switchToHttp().getRequest();
      return (req as any).__abimongo?.tenantId;
    }

    if (type === "graphql") {
      const gqlCtx = GqlExecutionContext.create(ctx);
      const context = gqlCtx.getContext<any>();
      return context.abimongo?.tenantId ?? context.req?.__abimongo?.tenantId;
    }

    return undefined;
  }
);
