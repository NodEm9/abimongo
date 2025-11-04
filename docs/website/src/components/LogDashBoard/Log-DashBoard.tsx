import React, { ReactNode, useEffect, useState } from 'react';
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

  // fetch npm download stats from the dev metrics server and refresh periodically
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        // In local dev, call the metrics server directly to avoid relying on a Docusaurus dev proxy which
        // may not be configured in this repo. In production/staging the relative path will be used so the
        // deployed site can proxy or call a hosted metrics API.
        const apiBase = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
          ? 'http://localhost:9003'
          : '';
        const r = await fetch(`${apiBase}/api/npm-downloads`);
        if (!r.ok) throw new Error(String(r.status));
        const j = await r.json();
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
        if (mounted) setNpmMetrics([{ id: 'npm:error', label: 'npm stats', value: (e as any)?.message ?? 'error' } as any]);
      }
    }
    load();
    const id = window.setInterval(load, 60_000);
    return () => { mounted = false; window.clearInterval(id); };
  }, []);

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
            // combine core metrics with npm download metrics
            ([...metrics, ...(npmMetrics ?? [])] as Metric[]).map((m: Metric) => <MetricCard key={m.id} metric={m} loading={false} />)
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
