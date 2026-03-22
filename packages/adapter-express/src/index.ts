import { Application } from "express";
import type {
  Request as ExpressRequest,
  Response,
  Request,
  NextFunction
} from "express-serve-static-core";
// import {
//   AbimongoContext,
//   TenancyOptions,
//   createTenancyContext,
//   AbimongoAdapter
// } from "@abimongo/adapter-types";
import { TenantContext } from "@abimongo/core";


import { runWithAbimongoContext } from '../../adapter-types/src/context-builder';
import {  AbimongoAdapter, AdapterContextOptions } from '../../adapter-types/src/types';


/**
 * Express middleware that resolves tenant and attaches it to req.__abimongo
 * Usage:
 *   app.use(abimongoExpress({ header: 'x-tenant-id', fallback: 'public' }))
 *   app.get('/users', (req, res) => res.json({ tenant: (req as any).__abimongo.tenantId }))
 */
// function abimongoExpress(opts?: TenancyOptions) {
//   return async function (req: ExpressRequest, res: Response, next: NextFunction) {
//     try {
//       const ctx: AbimongoContext = await createTenancyContext(
//         {
//           headers: req.headers as Record<string, string | string[] | undefined>,
//           url: req.url,
//           method: req.method,
//           params: req.params as Record<string, string>,
//           cookies: (req as any).cookies,
//           get: (name: string) => req.get(name)
//         },
//         opts
//       );
//       const validTid = opts?.validate?.(ctx.tenantId);
//       if (validTid instanceof Promise) {
//         if (!(await validTid)) {
//           throw new Error(`Invalid tenant ID: ${ctx.tenantId}`);
//         }
//       } else if (validTid === false) {
//         throw new Error(`Invalid tenant ID: ${ctx.tenantId}`);
//       }

//       TenantContext.run(ctx.tenantId, () => next());
//       // (req as any).__abimongo = ctx;
//       // next();
//     } catch (err) {
//       res.status(400).json({
//         error: "TENANT_RESOLUTION_FAILED",
//         message: (err as Error).message
//       });
//       next(err);
//     }
//   };
// }


// export function createExpressAdapter(app: Application): AbimongoAdapter<typeof app> {
//   return {
//     name: "express",
//     installTenancy: async () => {
//       app.use(abimongoExpress);
//     }
//   };
// }


export function createExpressAdapter(): AbimongoAdapter<Application> {
  return {
    name: 'express',

    install(app: Application, options: AdapterContextOptions = {}) {
      app.use(async (req: Request, res: Response, next: NextFunction) => {
        try {
          await runWithAbimongoContext(
            req,
            async () => {
              await new Promise<void>((resolve, reject) => {
                next();
                resolve();
              });
            },
            options
          );
        } catch (err) {
          next(err);
        }
      });
    }
  };
}