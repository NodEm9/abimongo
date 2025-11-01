import { useEffect, useState, useCallback, useRef } from 'react';
import type { Metric } from './types';

type UseMetricsOpts = { url?: string; pollMs?: number | false };

export function useMetrics(opts?: UseMetricsOpts) {
	const url = opts?.url ?? '/api/metrics';
	const pollMs = opts?.pollMs ?? 15000;

	const [data, setData] = useState<Metric[] | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const mounted = useRef(true);

	const fetchOnce = useCallback(async () => {
		setLoading(true);
		try {
			const res = await fetch(url);
			if (!res.ok) throw new Error(`Fetch ${url} failed: ${res.status}`);
			const json = await res.json();
			if (!mounted.current) return;
			setData(json as Metric[]);
			setError(null);
		} catch (e) {
			if (!mounted.current) return;
			setError(e as Error);
		} finally {
			if (!mounted.current) return;
			setLoading(false);
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
