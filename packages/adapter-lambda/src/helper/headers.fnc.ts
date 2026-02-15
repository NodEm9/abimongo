export function normalizeHeaders(
	headers: Record<string, string | undefined> | undefined | null
): Record<string, string | string[] | undefined> {
	const out: Record<string, string | string[] | undefined> = {};
	if (!headers) return out;

	for (const [k, v] of Object.entries(headers)) {
		// normalize keys to lower-case because your resolveTenant reads lower-case keys
		out[k.toLowerCase()] = v;
	}
	return out;
}

export function readHeader(
	headers: Record<string, string | string[] | undefined>,
	name: string
): string | undefined {
	const v = headers?.[name.toLowerCase()];
	if (!v) return undefined;
	return Array.isArray(v) ? v[0] : v;
}

export function parseCookieHeader(cookieHeader?: string): Record<string, string> | undefined {
	if (!cookieHeader) return undefined;
	const out: Record<string, string> = {};
	const parts = cookieHeader.split(";");

	for (const part of parts) {
		const [rawK, ...rest] = part.trim().split("=");
		if (!rawK) continue;
		const k = rawK.trim();
		const v = rest.join("=").trim();
		if (!k) continue;
		out[k] = decodeURIComponent(v ?? "");
	}
	return Object.keys(out).length ? out : undefined;
}

export function parseCookieArray(cookies: string[]): Record<string, string> | undefined {
	// Each cookie string may be "k=v" (APIGW v2)
	const out: Record<string, string> = {};
	for (const c of cookies) {
		const idx = c.indexOf("=");
		if (idx === -1) continue;
		const k = c.slice(0, idx).trim();
		const v = c.slice(idx + 1).trim();
		if (!k) continue;
		out[k] = decodeURIComponent(v);
	}
	return Object.keys(out).length ? out : undefined;
}

export function toQueryString(qs: Record<string, string | undefined | null>): string | undefined {
	const entries = Object.entries(qs).filter(([, v]) => v != null);
	if (!entries.length) return undefined;
	const params = entries
		.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
		.join("&");
	return params;
}

export function buildUrl(baseUrl: string | undefined, path: string | undefined, query: string | undefined) {
	const p = path ?? "/";
	const q = query ? (query.startsWith("?") ? query : `?${query}`) : "";
	if (!baseUrl) return `${p}${q}`;
	const trimmed = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
	const p2 = p.startsWith("/") ? p : `/${p}`;
	return `${trimmed}${p2}${q}`;
}

export function mapQueryToParams(
	queryStringParameters: Record<string, string | undefined | null>,
	mapping: Record<string, string>
): Record<string, string> {
	const params: Record<string, string> = {};
	for (const [paramName, queryKey] of Object.entries(mapping)) {
		const v = queryStringParameters?.[queryKey];
		if (typeof v === "string" && v.length) params[paramName] = v;
	}
	return params;
}