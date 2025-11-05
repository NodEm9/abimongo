import React, { ReactNode, useEffect, useState, useMemo } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './dashboard.module.css';
import MetricCard from './MetricCard';
import { useMetrics } from './useMetrics';
import type { Metric } from './types';
// npm stats are provided by the dev metrics server at /api/npm-downloads

export default function LogDashboard(): ReactNode {
  const [logs, setLogs] = useState<{ tenant: string; message: string }[]>([]);

  // keep existing live websocket logs behavior
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:9001');
    ws.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data);
        setLogs((prev) => [...prev.slice(-100), parsed]);
        console.log(`Received log: ${parsed.message}`, { tenant: parsed.tenant });
      } catch {
        // ignore malformed
      }
    };
    return () => ws.close();
  }, []);

  // metrics area
  const { data: metrics, loading, error } = useMetrics({ pollMs: 15000 });
  const [npmMetrics, setNpmMetrics] = useState<Metric[] | null>(null);
  const base = useBaseUrl('/');

  // fetch npm download stats from the dev metrics server and refresh periodically
  // If the `/api/npm-downloads` endpoint is not available (production static site),
  // fall back to synthesizing npm metrics from the snapshot `metrics` (if present).
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        // In local dev, call the metrics server directly to avoid relying on a Docusaurus dev proxy.
        const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
        const apiBase = isLocal ? 'http://localhost:9003' : '';

        let j: any = null;
        if (isLocal) {
          const r = await fetch(`${apiBase}/api/npm-downloads`);
          if (!r.ok) throw new Error(String(r.status));
          j = await r.json();
        } else {
          // In production (static site), prefer the committed static file npm-downloads.json
          const r = await fetch(`${base}api/npm-downloads.json`);
          if (r.ok) {
            j = await r.json();
          } else {
            throw new Error('npm-downloads.json not available');
          }
        }
        // j: [{ package, week, month, year }]
        const normalized: Metric[] = [];
        for (const item of j) {
          if (item.error) {
            normalized.push({ id: `npm:${item.package}:error`, label: `${item.package} — npm stats`, value: item.error });
            continue;
          }
          normalized.push({ id: `npm:${item.package}:week`, label: `${item.package} — last week`, value: item.week, unit: 'downloads' });
          normalized.push({ id: `npm:${item.package}:month`, label: `${item.package} — last month`, value: item.month, unit: 'downloads' });
          normalized.push({ id: `npm:${item.package}:year`, label: `${item.package} — last year`, value: item.year, unit: 'downloads' });
        }
        if (mounted) setNpmMetrics(normalized);
      } catch (e) {
        // Attempt to synthesize npm metrics from the snapshot `metrics` provided by useMetrics
        try {
          const synthesized: Record<string, { week?: any; month?: any; year?: any }> = {};
          if (metrics && metrics.length > 0) {
            for (const m of metrics) {
              // expecting ids like "npm:@abimongo/core:week"
              const parts = typeof m.id === 'string' ? m.id.split(':') : [];
              if (parts.length === 3 && parts[0] === 'npm') {
                const pkg = parts[1];
                const range = parts[2];
                synthesized[pkg] = synthesized[pkg] || {};
                synthesized[pkg][range] = m.value;
              }
            }
          }
          const normalized: Metric[] = [];
          for (const [pkg, obj] of Object.entries(synthesized)) {
            if (obj.week !== undefined) normalized.push({ id: `npm:${pkg}:week`, label: `${pkg} — last week`, value: obj.week, unit: 'downloads' });
            if (obj.month !== undefined) normalized.push({ id: `npm:${pkg}:month`, label: `${pkg} — last month`, value: obj.month, unit: 'downloads' });
            if (obj.year !== undefined) normalized.push({ id: `npm:${pkg}:year`, label: `${pkg} — last year`, value: obj.year, unit: 'downloads' });
          }
          if (normalized.length > 0) {
            if (mounted) setNpmMetrics(normalized);
            return;
          }
        } catch {
          // fall through to set error below
        }

        if (mounted) setNpmMetrics([{ id: 'npm:error', label: 'npm stats', value: (e as any)?.message ?? 'error' } as any]);
      }
    }
    // initial load
    load();
    // periodic refresh
    const timer = window.setInterval(load, 60_000);
    return () => { mounted = false; window.clearInterval(timer); };
  }, [metrics]);

  const combinedMetrics = useMemo(() => {
    if (!metrics) return npmMetrics ?? [];
    const seen = new Set<string>(metrics.map((m) => String(m.id)));
    const additions = (npmMetrics ?? []).filter((m) => !seen.has(String(m.id)));
    return [...metrics, ...additions] as Metric[];
  }, [metrics, npmMetrics]);

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.heroText}>📺 Abimongo Log Stream</h2>

      <section aria-label="Abimongo metrics">
        <h3 className={styles.content}>📊 Usage Metrics</h3>
        <div className={styles.metricsGrid}>
          {loading && (
            // show a few skeleton cards
            [1, 2, 3].map((i) => <div key={i} className={styles.metricCard}>Loading…</div>)
          )}

          {error && <div role="alert" className={styles.errorBox}>Metrics failed to load: {String(error?.message ?? error)}</div>}

          {metrics && metrics.length > 0 ? (
            // combined metrics (core + npm snapshot/fallback)
            combinedMetrics.map((m: Metric) => <MetricCard key={m.id} metric={m} loading={false} />)
          ) : (
            !loading && !error && <div className={styles.emptyState}>No metrics available</div>
          )}
        </div>
      </section>

      <section aria-label="Live logs" className={styles.logsSection}>
        <div className={styles.logsHeader}><strong>Live Logs</strong> <span className={styles.logsSub}>Realtime stream from Abimongo server</span></div>
        <div className={styles.logsBox} role="log">
          {logs.length === 0 && <div className={styles.emptyState}>No live logs yet</div>}
          {logs.map((log, i) => (
            <div key={i} className={styles.logRow}>
              <span className={styles.logTenant}>[{log.tenant}]</span>
              <span className={styles.logMessage}>{log.message}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
