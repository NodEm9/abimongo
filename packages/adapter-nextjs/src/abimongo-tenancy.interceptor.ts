import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor
} from "@nestjs/common";
import { Observable } from "rxjs";
import {
  AbimongoContext,
  createTenancyContext,
  TenancyOptions
} from "@abimongo/adapter-types";
import { ABIMONGO_TENANCY_OPTIONS } from "./constants";

// Optional import – only used when @nestjs/graphql is installed
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class AbimongoTenancyInterceptor implements NestInterceptor {
  constructor(
    @Inject(ABIMONGO_TENANCY_OPTIONS)
    private readonly opts: TenancyOptions
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const type = context.getType<"http" | "rpc" | "graphql">();

    if (type === "http") {
      const req = context.switchToHttp().getRequest();
      await this.attachToRequest(req);
    } else if (type === "graphql") {
      // graphql-http or apollo via @nestjs/graphql
      const gqlCtx = GqlExecutionContext.create(context);
      const ctx = gqlCtx.getContext<any>();

      // Nest often attaches req on ctx.req
      const req = ctx.req ?? ctx.request ?? ctx;

      await this.attachToRequest(req);
      // Also expose directly on GraphQL context
      ctx.abimongo = (req as any).__abimongo;
    }

    return next.handle();
  }

  private async attachToRequest(req: any) {
    const headers =
      (req.headers as Record<string, string | string[] | undefined>) ?? {};
    const url = req.url ?? req.originalUrl;
    const method = req.method;
    const params = (req.params ?? {}) as Record<string, string>;
    const cookies = req.cookies ?? {};

    const ctx: AbimongoContext = await createTenancyContext(
      { headers, url, method, params, cookies },
      this.opts
    );

    (req as any).__abimongo = ctx;
  }
}
