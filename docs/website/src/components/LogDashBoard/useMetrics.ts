import { useEffect, useState, useCallback, useRef } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import type { Metric } from './types';

type UseMetricsOpts = { url?: string; pollMs?: number | false };

export function useMetrics(opts?: UseMetricsOpts) {
	// Build API paths relative to the site's base URL so they work on GitHub Pages
	const base = useBaseUrl('/');
	// Primary API (real endpoint) and a static JSON fallback we ship with the site
	const primaryUrl = opts?.url ?? (process.env.NODE_ENV === 'development' ? `${base}api/metrics.json` : `${base}api/metrics`);
	const fallbackUrl = `${base}api/metrics.json`;
	const url = primaryUrl;
	const pollMs = opts?.pollMs ?? 15000;

	const [data, setData] = useState<Metric[] | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const mounted = useRef(true);

	const fetchOnce = useCallback(async () => {
		setLoading(true);
		try {
			// Try the primary endpoint first
			let res = await fetch(url);
			if (!res.ok) {
				console.warn(`Primary metrics endpoint ${url} returned ${res.status}. Trying fallback ${fallbackUrl}`);
				res = await fetch(fallbackUrl);
			}

			// If content-type isn't JSON try the fallback (static file)
			let contentType = String(res.headers.get('content-type') ?? '').toLowerCase();
			if (!contentType.includes('application/json')) {
				console.warn(`Metrics endpoint returned content-type=${contentType}. Attempting fallback ${fallbackUrl}`);
				const res2 = await fetch(fallbackUrl);
				contentType = String(res2.headers.get('content-type') ?? '').toLowerCase();
				if (!res2.ok || !contentType.includes('application/json')) {
					const txt = await res.text();
					throw new Error(`Expected JSON from ${url} or ${fallbackUrl}, got ${contentType || 'unknown'}: ${txt.slice(0, 200)}`);
				}
				// use res2
				res = res2;
			}
			const json = await res.json();
			// Normalize API responses: allow an array of metrics or an object keyed by id
			let normalized: Metric[] = [];
			if (Array.isArray(json)) {
				normalized = json as Metric[];
			} else if (json && typeof json === 'object') {
				// Convert object map -> array of Metric objects
				normalized = Object.entries(json).map(([k, v]) => {
					if (v && typeof v === 'object') {
						return {
							id: (v as any).id ?? k,
							label: (v as any).label ?? k,
							value: (v as any).value ?? (typeof v === 'number' || typeof v === 'string' ? (v as any) : ''),
							unit: (v as any).unit,
							delta: (v as any).delta,
							description: (v as any).description,
						};
					}
					return { id: k, label: k, value: String(v) } as Metric;
				});
			}
			if (mounted.current) {
				setData(normalized);
				setError(null);
			}
		} catch (e) {
			if (mounted.current) {
				setError(e as Error);
			}
		} finally {
			if (mounted.current) {
				setLoading(false);
			}
		}
	}, [url]);

	useEffect(() => {
		mounted.current = true;
		fetchOnce();
		let id: number | undefined;
		if (pollMs && typeof pollMs === 'number' && pollMs > 0) {
			id = window.setInterval(fetchOnce, pollMs);
		}
		return () => {
			mounted.current = false;
			if (id) window.clearInterval(id);
		};
	}, [fetchOnce, pollMs]);

	return { data, loading, error, refresh: fetchOnce } as const;
}
