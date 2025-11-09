#!/usr/bin/env node
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const METRICS_PATH = path.resolve(__dirname, '..', 'static', 'api', 'metrics.json');

async function fetchDownloads(pkg, range) {
  const safe = encodeURIComponent(pkg);
  const url = `https://api.npmjs.org/downloads/point/${range}/${safe}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  const j = await res.json();
  return (j && typeof j.downloads === 'number') ? j.downloads : 0;
}

function readMetrics() {
  try {
    const raw = fs.readFileSync(METRICS_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read metrics file:', err.message);
    process.exit(1);
  }
}

function writeMetrics(metrics) {
  try {
    fs.writeFileSync(METRICS_PATH, JSON.stringify(metrics, null, 2), 'utf8');
    console.log('Wrote metrics to', METRICS_PATH);
  } catch (err) {
    console.error('Failed to write metrics file:', err.message);
    process.exit(1);
  }
}

(async function main() {
  console.log('[update-metrics] Fetching npm download counts...');
  const metrics = readMetrics();

  // Discover package ids from existing metrics entries that start with "npm:"
  const pkgSet = new Set();
  for (const m of metrics) {
    if (m.id && m.id.startsWith('npm:')) {
      // id example: npm:@abimongo/core:week
      const parts = m.id.split(':');
      if (parts.length >= 3) {
        const pkg = parts[1];
        pkgSet.add(pkg);
      }
    }
  }
  const pkgs = Array.from(pkgSet);
  if (pkgs.length === 0) {
    console.warn('[update-metrics] No npm package entries found in metrics.json');
    process.exit(0);
  }

  const ranges = { week: 'last-week', month: 'last-month', year: 'last-year' };
  const results = {};
  for (const pkg of pkgs) {
    results[pkg] = {};
    for (const [key, range] of Object.entries(ranges)) {
      try {
        const val = await fetchDownloads(pkg, range);
        results[pkg][key] = val;
        console.log(`[update-metrics] ${pkg} ${key} -> ${val}`);
      } catch (err) {
        console.warn(`[update-metrics] Failed to fetch ${pkg} ${key}:`, err.message || err);
        results[pkg][key] = 0;
      }
    }
  }

  // Update metrics array in-place
  let requestsTotal = 0;
  for (const m of metrics) {
    if (m.id && m.id.startsWith('npm:')) {
      const parts = m.id.split(':');
      const pkg = parts[1];
      const period = parts[2]; // week, month, year
      if (results[pkg] && typeof results[pkg][period] === 'number') {
        m.value = results[pkg][period];
      }
    }
  }

  // Sum weekly downloads as requests_total
  for (const pkg of pkgs) {
    requestsTotal += (results[pkg].week || 0);
  }

  // Update snapshot timestamp formatted without milliseconds
  const now = new Date();
  const isoNoMs = now.toISOString().replace(/\.\d{3}Z$/, 'Z');

  // Replace or add snapshot_ts entry
  let found = false;
  for (const m of metrics) {
    if (m.id === 'snapshot_ts') {
      m.value = isoNoMs;
      found = true;
      break;
    }
  }
  if (!found) {
    metrics.unshift({ id: 'snapshot_ts', label: 'Snapshot Timestamp', value: isoNoMs });
  }

  // Update requests_total entry
  let rtFound = false;
  for (const m of metrics) {
    if (m.id === 'requests_total') {
      m.value = requestsTotal;
      rtFound = true;
      break;
    }
  }
  if (!rtFound) {
    metrics.unshift({ id: 'requests_total', label: 'Total Requests (weekly downloads)', value: requestsTotal, unit: 'downloads' });
  }

  writeMetrics(metrics);
  console.log('[update-metrics] Done.');
})().catch((err) => { console.error(err); process.exit(1); });
