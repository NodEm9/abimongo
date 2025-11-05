#!/usr/bin/env node
/* eslint-disable */
const http = require('http');
const fs = require('fs');
const path = require('path');

const STATIC_PATH = path.resolve(__dirname, '..', 'static', 'api', 'metrics.json');
let metrics = [];

// Verbose startup logging for easier debugging
console.log('[metrics-server] Starting metrics-server.js');
console.log('[metrics-server] PID:', process.pid);
console.log('[metrics-server] CWD:', process.cwd());

process.on('unhandledRejection', (reason, p) => {
  console.error('[metrics-server] UNHANDLED REJECTION at Promise', p, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[metrics-server] UNCAUGHT EXCEPTION', err && err.stack ? err.stack : err);
  // give logs a moment then exit
  setTimeout(() => process.exit(1), 100);
});

process.on('SIGTERM', () => {
  console.log('[metrics-server] Received SIGTERM, initiating graceful shutdown...');
  gracefulShutdown('SIGTERM');
});

// Graceful shutdown: persist metrics, close DB client (if any), close HTTP server, then exit
async function gracefulShutdown(signal) {
  try {
    console.log('[metrics-server] gracefulShutdown triggered by', signal);
    // persist in-memory metrics
    try { persist(); } catch (e) { console.warn('[metrics-server] persist() failed during shutdown:', e && e.message ? e.message : e); }

    // close DB client if present
    if (dbClient && typeof dbClient.close === 'function') {
      try { await dbClient.close(); console.log('[metrics-server] DB client closed'); } catch (e) { console.warn('[metrics-server] Failed to close DB client:', e && e.message ? e.message : e); }
    }

    // close HTTP server
    if (server && typeof server.close === 'function') {
      console.log('[metrics-server] Closing HTTP server...');
      await new Promise((resolve) => server.close(() => resolve()));
      console.log('[metrics-server] HTTP server closed');
    }

    console.log('[metrics-server] Shutdown complete. Exiting.');
    process.exit(0);
  } catch (err) {
    console.error('[metrics-server] Error during gracefulShutdown:', err && err.stack ? err.stack : err);
    process.exit(1);
  }
}

// SIGINT should trigger graceful shutdown as well
process.on('SIGINT', () => {
  console.log('[metrics-server] Received SIGINT, initiating graceful shutdown...');
  gracefulShutdown('SIGINT');
});

// Keep the process alive so it behaves like a long-running dev service.
process.stdin.resume();
console.log('[metrics-server] stdin.resume() called; server will stay running until terminated');

function load() {
  try {
    const raw = fs.readFileSync(STATIC_PATH, 'utf8');
    metrics = JSON.parse(raw);
    console.log(`[metrics-server] Loaded ${metrics.length} metrics from ${STATIC_PATH}`);
  } catch (err) {
    console.warn('[metrics-server] Could not load static metrics file, starting with empty array');
    metrics = [];
  }
}

function persist() {
  try {
    fs.mkdirSync(path.dirname(STATIC_PATH), { recursive: true });
    fs.writeFileSync(STATIC_PATH, JSON.stringify(metrics, null, 2), 'utf8');
    console.log('[metrics-server] Persisted metrics to', STATIC_PATH);
  } catch (err) {
    console.error('[metrics-server] Failed to persist metrics:', err.message);
  }
}

let useDb = false;
let dbClient = null;
let metricsCollection = null;

// Small simulator for demo metrics when METRICS_SIMULATE=1
function generateSimulatedMetrics() {
  // Use time-based pseudo-random walk for believable values
  const t = Math.floor(Date.now() / 1000);
  const baseLatency = 200; // ms
  const jitter = (Math.sin(t / 60) + 1) * 50; // slow oscillation
  const p95 = Math.max(20, Math.round(baseLatency + jitter + (Math.sin(t / 13) * 30)));
  const errorRate = Math.max(0, (0.2 + Math.abs(Math.sin(t / 37)) * 1.2)).toFixed(2) + '%';
  return [
    { id: 'latency_p95', label: 'P95 Latency', value: p95, unit: 'ms', delta: Math.round((Math.sin(t / 17) * 10)) },
    { id: 'error_rate', label: 'Error Rate', value: errorRate, delta: Number((Math.sin(t / 23) * 0.1).toFixed(2)) },
  ];
}

async function tryInitDb() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  console.log('[metrics-server] tryInitDb - checking for MONGO_URI');
  if (!uri) return;
  try {
    console.log('[metrics-server] MONGO_URI found, attempting DB initialization');
    // Prefer a built @abimongo/core. If it's missing, try to build it automatically
    const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
    async function tryRequireAbimongo() {
      try {
        const pkg = require('@abimongo/core');
        return pkg;
      } catch (err) {
        return null;
      }
    }

    let AbimongoPkg = await tryRequireAbimongo();
    if (!AbimongoPkg) {
      console.log('[metrics-server] @abimongo/core not found. Attempting automatic build (pnpm --filter @abimongo/core run build)');
      const { spawnSync } = require('child_process');
      const res = spawnSync('pnpm', ['--filter', '@abimongo/core', 'run', 'build'], {
        cwd: REPO_ROOT,
        stdio: 'inherit',
        shell: process.platform === 'win32',
      });
      if (res.error || res.status !== 0) {
        console.error('[metrics-server] Automatic build failed. Please build @abimongo/core manually: `pnpm --filter @abimongo/core run build`');
        throw new Error('Failed to build @abimongo/core');
      }
      // clear require cache and try again
      AbimongoPkg = await tryRequireAbimongo();
    }

    if (AbimongoPkg && AbimongoPkg.Abimongo) {
      const Abimongo = AbimongoPkg.Abimongo;
      // connect returns an AbimongoClient instance
      console.log('[metrics-server] Attempting Abimongo.connect()', uri);
      const clientWrapper = await Abimongo.connect(uri, { dbName: 'abimongo_metrics' });
      // Ensure client is connected
      await clientWrapper.connect();
      dbClient = clientWrapper.client;
      metricsCollection = clientWrapper.getCollection('metrics');
      useDb = true;
      console.log('[metrics-server] Using @abimongo/core for metrics persistence. collection ready:', !!metricsCollection);
      return;
    }

    // Fallback: try native mongodb driver only if Abimongo usage is explicitly disabled via env
    if (process.env.FORCE_FILE_BACKED === '1') {
      console.log('[metrics-server] FORCING file-backed mode by environment. Not using MongoDB.');
      useDb = false;
      return;
    }

    // If we reach here, abimongo build wasn't available and we don't want to fallback silently.
    throw new Error('@abimongo/core is required for DB-backed metrics. Build it with `pnpm --filter @abimongo/core run build`');
  } catch (err) {
    console.warn('[metrics-server] Failed to initialize DB mode, continuing in file-backed mode:', err?.message || err);
    useDb = false;
  }
}

// try to init DB but don't fail startup if it doesn't work
function _pruneSigintListenersKeep(keep) {
  try {
    const current = process.listeners('SIGINT').slice();
    for (const l of current) {
      if (l !== keep) {
        try {
          console.log('[metrics-server] Removing external SIGINT listener (post-init):', l.name || '<anonymous>');
          process.removeListener('SIGINT', l);
        } catch (e) {
          console.warn('[metrics-server] Failed to remove post-init listener:', e && e.message ? e.message : e);
        }
      }
    }
  } catch (e) {
    console.warn('[metrics-server] Error while pruning SIGINT listeners (post-init):', e && e.message ? e.message : e);
  }
}

tryInitDb().catch(() => { });

load();

const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  // Basic CORS handling so the dev metrics server can be called directly from the browser
  // (Docusaurus runs on another origin during dev). This is intentionally permissive for local dev.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (method === 'OPTIONS') {
    // Preflight
    res.writeHead(204);
    res.end();
    return;
  }
  // accept both /api/metrics and /api/metrics.json
  if (method === 'GET' && (url === '/api/metrics' || url === '/api/metrics.json')) {
    try {
      if (useDb && metricsCollection) {
        const docs = await metricsCollection.find({}).toArray();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(docs));
        return;
      }
    } catch (err) {
      console.warn('[metrics-server] DB read error:', err?.message || err);
    }
    // If simulation is enabled, append simulated metrics to the stored metrics (do not persist simulated data)
    const simulate = process.env.METRICS_SIMULATE === '1' || process.env.METRICS_SIMULATE === 'true';
    const out = Array.isArray(metrics) ? metrics.slice() : [];
    if (simulate) {
      try {
        const sim = generateSimulatedMetrics();
        // only append simulated metrics if not already present in the stored metrics by id
        for (const s of sim) {
          if (!out.find((m) => m.id === s.id)) out.push(s);
        }
      } catch (e) { console.warn('[metrics-server] simulation error', e && e.message ? e.message : e); }
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(out));
    return;
  }

  if (method === 'POST' && url === '/api/metrics') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', async () => {
      try {
        const obj = JSON.parse(body);
        if (useDb && metricsCollection) {
          if (Array.isArray(obj)) {
            // replace entire collection
            await metricsCollection.deleteMany({});
            if (obj.length) await metricsCollection.insertMany(obj);
            metrics = obj;
          } else if (obj && typeof obj === 'object') {
            if (obj.id) {
              await metricsCollection.updateOne({ id: obj.id }, { $set: obj }, { upsert: true });
              const found = await metricsCollection.find({}).toArray();
              metrics = found;
            }
          }
          persist();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true }));
          return;
        }

        // file-backed
        if (Array.isArray(obj)) {
          metrics = obj;
        } else if (obj && typeof obj === 'object') {
          if (obj.id) {
            const idx = metrics.findIndex((m) => m.id === obj.id);
            if (idx >= 0) metrics[idx] = obj;
            else metrics.push(obj);
          }
        }
        persist();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      }
    });
    return;
  }

  // health
  if (method === 'GET' && url === '/__metrics_health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, metrics: metrics.length }));
    return;
  }

  // server-side npm downloads aggregation endpoint
  if (method === 'GET' && url && url.startsWith('/api/npm-downloads')) {
    try {
      // optional query: ?packages=comma,separated
      const u = new URL(req.url, `http://localhost:${process.env.METRICS_PORT || 9003}`);
      const qp = u.searchParams.get('packages');
      const pkgs = qp ? qp.split(',').map(decodeURIComponent).filter(Boolean) : ['@abimongo/core', '@abimongo/cli', '@abimongo/logger', '@abimongo/create'];
      const out = [];
      await Promise.all(pkgs.map(async (p) => {
        try {
          const [week, month, year] = await Promise.all([
            fetchNpmPoint(p, 'last-week'),
            fetchNpmPoint(p, 'last-month'),
            fetchNpmPoint(p, 'last-year'),
          ]);
          out.push({ package: p, week, month, year });
        } catch (e) {
          out.push({ package: p, error: String(e && e.message ? e.message : e) });
        }
      }));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(out));
      return;
    } catch (err) {
      // fall back to normal handler behavior
      console.warn('[metrics-server] npm-downloads handler error:', err && err.message ? err.message : err);
    }
  }

  // serve a tiny admin UI file if present (convenience for local dev)
  if (method === 'GET' && (url === '/admin.html' || url === '/metrics-admin' || url === '/metrics-admin/')) {
    try {
      const adminPath = path.resolve(__dirname, 'admin.html');
      if (fs.existsSync(adminPath)) {
        const html = fs.readFileSync(adminPath, 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
        return;
      }
    } catch (err) {
      console.warn('[metrics-server] Failed to serve admin UI:', err?.message || err);
    }
  }

  // Not found
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

// Add server-side npm downloads aggregation endpoint
async function fetchNpmPoint(pkg, range) {
  const safe = encodeURIComponent(pkg);
  const url = `https://api.npmjs.org/downloads/point/${range}/${safe}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`npm API ${res.status}`);
  const j = await res.json();
  return (j && typeof j.downloads === 'number') ? j.downloads : 0;
}

// (npm-downloads handler moved into the main request handler above)

const PORT = process.env.METRICS_PORT || 9003;
server.listen(PORT, () => console.log(`[metrics-server] Running on http://localhost:${PORT}`));
