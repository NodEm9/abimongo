import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';

type Metric = { id: string; label?: string; value?: any; unit?: string; delta?: number };

export default function MetricsAdmin() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [resp, setResp] = useState<string>('Ready');
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const r = await fetch('/api/metrics');
      if (!r.ok) throw new Error(String(r.status));
      const j = await r.json();
      setMetrics(Array.isArray(j) ? j : []);
      setResp(`Loaded ${Array.isArray(j) ? j.length : 0} metrics`);
    } catch (e: any) {
      setMetrics([]);
      setResp('Error: ' + (e?.message || String(e)));
    } finally { setLoading(false); }
  }

  useEffect(() => { refresh(); }, []);

  async function saveAll() {
    try {
      const r = await fetch('/api/metrics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(metrics) });
      const j = await r.json();
      setResp(JSON.stringify(j));
      await refresh();
    } catch (e: any) { setResp('Error: ' + (e?.message || String(e))); }
  }

  async function saveOne(m: Metric) {
    try {
      const r = await fetch('/api/metrics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(m) });
      const j = await r.json();
      setResp(JSON.stringify(j));
      await refresh();
    } catch (e: any) { setResp('Error: ' + (e?.message || String(e))); }
  }

  function updateMetric(id: string, patch: Partial<Metric>) {
    setMetrics((prev) => prev.map((m) => m.id === id ? { ...m, ...patch } : m));
  }

  function deleteMetric(id: string) {
    setMetrics((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <Layout title="Metrics Admin">
      <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
        <h1>Metrics Admin</h1>
        <p style={{ color: '#6b7280' }}>View and edit metrics for the docs dashboard. Works with the local metrics dev server.</p>

        <div style={{ display: 'flex', gap: 8, margin: '16px 0 20px' }}>
          <button onClick={refresh} disabled={loading} aria-busy={loading}>Refresh</button>
          <button onClick={saveAll}>Save All</button>
          <button onClick={() => setMetrics([{ id: 'requests_total', label: 'Total Requests', value: 123456, unit: 'req', delta: 12 }])}>Load Sample</button>
        </div>

        <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 120px 100px 120px', gap: 8, padding: 12, background: '#f9fafb', fontWeight: 600 }}>
            <div>ID</div>
            <div>Label</div>
            <div>Value</div>
            <div>Unit</div>
            <div>Actions</div>
          </div>
          {metrics.map((m) => (
            <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 120px 100px 120px', gap: 8, padding: 12, alignItems: 'center' }}>
              <div style={{ fontFamily: 'monospace' }}>{m.id}</div>
              <div>
                <input value={m.label || ''} onChange={(e) => updateMetric(m.id, { label: e.target.value })} style={{ width: '98%' }} />
              </div>
              <div>
                <input value={String(m.value ?? '')} onChange={(e) => updateMetric(m.id, { value: isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value) })} style={{ width: '98%' }} />
              </div>
              <div>
                <input value={m.unit || ''} onChange={(e) => updateMetric(m.id, { unit: e.target.value })} style={{ width: '98%' }} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => saveOne(m)}>Save</button>
                <button onClick={() => { deleteMetric(m.id); setResp('Deleted ' + m.id); }}>Delete</button>
              </div>
            </div>
          ))}
          {metrics.length === 0 && <div style={{ padding: 20, color: '#6b7280' }}>No metrics found. Click Refresh or Load Sample.</div>}
        </div>

        <h2 style={{ marginTop: 20 }}>Raw Response</h2>
        <pre style={{ background: 'rgba(0,0,0,0.03)', padding: 12, borderRadius: 6, maxHeight: 240, overflow: 'auto' }}>{resp}</pre>
      </div>
    </Layout>
  );
}
