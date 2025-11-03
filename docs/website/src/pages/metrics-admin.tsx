import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';

// Use `any` here so the page compiles under the site's TS setup without extra JSX lib config.
type Metric = any;

export default function MetricsAdmin() {
  const [metrics, setMetrics] = useState<Metric[] | null>(null);
  const [text, setText] = useState('');
  const [resp, setResp] = useState<string>('Ready');
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const r = await fetch('/api/metrics');
      if (!r.ok) throw new Error(String(r.status));
      const j = await r.json();
      setMetrics(j);
      setText(JSON.stringify(j, null, 2));
      setResp(`Loaded ${Array.isArray(j) ? j.length : Object.keys(j).length} metrics`);
    } catch (e: any) {
      setMetrics(null);
      setText('[]');
      setResp('Error: ' + (e?.message || String(e)));
    } finally { setLoading(false); }
  }

  useEffect(() => { refresh(); }, []);

  async function saveAll() {
    try {
      const parsed = JSON.parse(text);
      const r = await fetch('/api/metrics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed) });
      const j = await r.json();
      setResp(JSON.stringify(j));
      await refresh();
    } catch (e: any) { setResp('Error: ' + (e?.message || String(e))); }
  }

  async function postSingle(raw: string) {
    try {
      const parsed = JSON.parse(raw);
      const r = await fetch('/api/metrics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed) });
      const j = await r.json();
      setResp(JSON.stringify(j));
      await refresh();
    } catch (e: any) { setResp('Error: ' + (e?.message || String(e))); }
  }

  return (
    <Layout title="Metrics Admin">
      <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
        <h1>Metrics Admin</h1>
        <p>View and edit metrics for the docs dashboard. Works with the local metrics dev server.</p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <button onClick={refresh} disabled={loading}>Refresh</button>
          <button onClick={saveAll}>Save All</button>
          <button onClick={() => { setText(JSON.stringify([{ id: 'requests_total', label: 'Total Requests', value: 123456, unit: 'req', delta: 12 }], null, 2)); }}>Load Sample</button>
        </div>

        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={14} style={{ width: '100%', fontFamily: 'monospace', fontSize: 13, padding: 12 }} />

        <h2>Quick POST single metric</h2>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input id="singleMetric" defaultValue='{"id":"active","label":"Active","value":10}' style={{ flex: 1 }} />
          <button onClick={() => postSingle((document.getElementById('singleMetric') as HTMLInputElement).value)}>POST</button>
        </div>

        <h2>Response</h2>
        <pre style={{ background: 'rgba(0,0,0,0.04)', padding: 12, borderRadius: 6 }}>{resp}</pre>
      </div>
    </Layout>
  );
}
