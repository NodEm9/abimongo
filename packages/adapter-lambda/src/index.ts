import type {
	AbimongoRequestLike,
	AbimongoContext,
	TenancyOptions
} from "@abimongo/adapter-types";
// ^ adjust import path to wherever you export these in core (or copy the types locally)
// If you don't export them from core yet, do it — adapters should depend on the shared contract types.

import { createTenancyContext } from "@abimongo/adapter-types";

import {
	normalizeHeaders,
	readHeader,
	parseCookieHeader,
	parseCookieArray,
	toQueryString,
	buildUrl,
	mapQueryToParams
} from "./helper/headers.fnc";


export type LambdaEvent = any;
export type LambdaContext = any;

export interface LambdaAdapterInput {
	event: LambdaEvent;
	context?: LambdaContext;
}

export interface LambdaAdapterOptions {
	tenancy?: TenancyOptions;

	/**
	 * If you want to derive cookies from a specific header other than "cookie"
	 * (rare, but ALB can differ).
	 */
	cookieHeaderName?: string;

	/**
	 * If you want to map a query parameter into req.params (router-style),
	 * you can provide a mapping: { tenantId: "tenantId" } etc.
	 *
	 * By default, we do NOT map query params into params (params are "route params").
	 */
	mapQueryToParams?: Record<string, string>;

	/**
	 * Build a URL if your event doesn't provide enough info.
	 * If omitted, we attempt best-effort.
	 */
	baseUrl?: string; 
}

export interface AbimongoLambdaAdapter {
	name: "@abimongo/adapter-lambda";
	kind: "lambda";
	toRequest(input: LambdaAdapterInput): AbimongoRequestLike;
	createContext(input: LambdaAdapterInput): Promise<AbimongoContext>;
	resolveTenantId(input: LambdaAdapterInput): Promise<string>;
}

/**
 * Main adapter factory.
 * Converts Lambda event -> AbimongoRequestLike and delegates tenant logic to core.
 */
export function createLambdaAdapter(options: LambdaAdapterOptions = {}): AbimongoLambdaAdapter {
	const tenancy = options.tenancy ?? {};
	const cookieHeaderName = (options.cookieHeaderName ?? "cookie").toLowerCase();

	function toRequest({ event }: LambdaAdapterInput): AbimongoRequestLike {
		const headers = normalizeHeaders(event?.headers);

		// Cookies
		const cookies =
			// APIGW v2 often has `cookies: string[]`
			Array.isArray(event?.cookies) ? parseCookieArray(event.cookies)
				// otherwise parse standard Cookie header
				: parseCookieHeader(readHeader(headers, cookieHeaderName));

		// Method + URL best-effort
		const method =
			event?.requestContext?.http?.method ??
			event?.httpMethod ??
			event?.requestContext?.httpMethod;

		const rawPath =
			event?.rawPath ??
			event?.path ??
			event?.requestContext?.http?.path ??
			event?.requestContext?.path;

		const rawQuery =
			// v2 has rawQueryString
			(typeof event?.rawQueryString === "string" ? event.rawQueryString : undefined) ??
			// v1 has queryStringParameters
			(event?.queryStringParameters ? toQueryString(event.queryStringParameters) : undefined);

		const url = buildUrl(options.baseUrl, rawPath, rawQuery);

		// Params (router params) - Lambda doesn't have route params unless you set them
		// We can optionally map query params into params if you want a "param" tenancy strategy.
		const params: Record<string, string> | undefined =
			options.mapQueryToParams && event?.queryStringParameters
				? mapQueryToParams(event.queryStringParameters, options.mapQueryToParams)
				: undefined;

		const req: AbimongoRequestLike = {
			headers,
			method,
			url,
			params,
			cookies,
			get(name: string) {
				return readHeader(headers, name);
			},
		};

		return req;
	}

	async function createContext(input: LambdaAdapterInput): Promise<AbimongoContext> {
		const req = toRequest(input);
		const ctx: AbimongoContext = await createTenancyContext(
			{
			headers: req.headers as Record<string, string | string[] | undefined>,
			url: req.url,
			method: req.method,
			params: (req.params ?? {}) as Record<string, string>,
			cookies: req.cookies
		}, tenancy	
		);
		return ctx;
	}

	async function resolveTenantId(input: LambdaAdapterInput): Promise<string> {
		const ctx = await createContext(input);
		return ctx.tenantId;
	}

	return {
		name: "@abimongo/adapter-lambda",
		kind: "lambda",
		toRequest,
		createContext,
		resolveTenantId,
	};
}

