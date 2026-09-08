import  { Application, RequestHandler } from 'express';
import {
	initMultiTenancy,
	InitMultiTenancyOptions,
	TenantContext,
} from '@abimongo/core';

import {
	AbimongoContext,
	createTenancyContext,
	type TenancyOptions
} from "@abimongo/adapter-types";


/**
 * Applies multi-tenancy middleware to a MongoDB connection.
 *
 * This should be used at the beginning of your app to inject the tenant ID into
 * the context of all Abimongo operations. It reads the tenant identifier from
 * a request header or other identifier.
 *
 * @param {Application} app - An Express.js app instance
 * @param {Record<string, string>} tenants - A record of tenant IDs mapped to their MongoDB URIs
 * @param {Object} [options] - Optional configuration for multi-tenancy
 * @param {string} [options.headerKey='x-tenant-id'] - The HTTP header key used to identify the tenant ID
 * @param {InitMultiTenancyOptions} [options.initOptions] - Options for initializing multi-tenancy
 * @param options - Configuration options (e.g., header name, fallback)
 * @returns {Promise<void>} The modified Express app with middleware applied
 * @throws {Error} If the tenant ID is missing in the request and no default tenant ID is configured
 *
 * @example
 * ```ts
 * import express from 'express';
 * import { applyMultiTenancy } from 'abimongo_core';
 *
 * const app = express();
 *
 * await applyMultiTenancy(app, tenants, {
		headerKey: 'x-tenant-id',
		initOptions: {
			lazy: true,  // Lazy initialization of tenants
			config: {
				enabled: true,
				logLevel: 'info', // Set the log level
				useColor: true, // Enable colored logs
				transports: [
					{
						write: (message: string) => {
							console.log(message); // Log to console
						},
					},
					consoleTransport(true)
				], // Use console transport for logging
				json: false, // Disable JSON format for logs,
				formatOptions: {
					// Customize the log format if needed
					timestamp: true, // Include timestamp in logs
					colors: true, // Enable colors in logs
				},
				hooks: {
					onTenantRegistered: (tenantId) => {
						logger.info(`Tenant registered: ${tenantId}`);
					},
					onTenantError: (tenantId, error) => {
						logger.error(`Error registering tenant ${tenantId}:`, error);
					},
				}
				// Place valid AbimongoLoggerSettings properties here if needed
			}
		},
	})
 * ```
 * * @remarks This function is designed to be used in an Express.js application to handle multi-tenancy by setting the tenant context based on a request header. It initializes the tenants and applies middleware to set the tenant ID for each request, allowing for tenant-specific operations in Abimongo.
 * @see {@link initMultiTenancy} for initializing tenants with their MongoDB URIs.
	*
 */

// export const applyMultiTenancy = async (
// 	app: Application,
// 	tenants: Record<string, string>,
// 	options?: {
// 		headerKey?: string;
// 		initOptions?: InitMultiTenancyOptions;
// 	}
// ): Promise<void> => {
// 	const headerKey = options?.headerKey || 'x-tenant-id';

// 	// Initialize tenants
// 	await initMultiTenancy(tenants, options?.initOptions);

// 	// Set tenant context from header
// 	app.use(
// 		(req: any, _res: any, next: any) => {
// 			// Read DEFAULT_TENANT_ID at request-time so tests that set process.env dynamically work as expected
// 			const DEFAULT_TENANT_ID = process.env.DEFAULT_TENANT_ID;
// 			const tenantId = (req.headers[headerKey.toLowerCase()] as string) || DEFAULT_TENANT_ID;

// 			if (!tenantId) {
// 				return next(new Error('Missing tenant ID. Please include header "x-tenant-id" with a valid tenant ID.'));
// 			}

// 			TenantContext.run(tenantId, () => next());
// 			createTenancyContext(req, { header: headerKey }).catch(next);
// 		}
// 	);
// };




export async function installTenancyExpress(
	app: Application,
	tenants: Record<string, string>,
	opts: {
		tenancy?: TenancyOptions;
		initOptions?: InitMultiTenancyOptions;
	} = {}
) {
	await initMultiTenancy(tenants, opts.initOptions);

	const tenantMiddleware: RequestHandler = async (req, res, next) => {
		try {
			const ctx: AbimongoContext = await createTenancyContext(
				{
					headers: req.headers as any,
					url: req.url,
					method: req.method,
					params: req.params as any,
					cookies: (req as any).cookies,
					get: (name: string) => req.get(name) ?? undefined,
				},
				opts.tenancy
			);
		 	TenantContext.run(ctx.tenantId, () => next());

		 }
		catch (e) {
			return next(e);
		}
	};
	app.use(tenantMiddleware as any);
}

