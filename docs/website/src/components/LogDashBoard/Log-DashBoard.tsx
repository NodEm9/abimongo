import React, { ReactNode, useEffect, useState } from 'react';
import styles from './dashboard.module.css';
import MetricCard from './MetricCard';
import { useMetrics } from './useMetrics';  
import type { Metric } from './types';

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
            metrics.map((m: Metric) => <MetricCard key={m.id} metric={m} loading={false} />)
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
