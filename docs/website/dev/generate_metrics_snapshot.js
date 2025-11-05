#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
/*
	Simple snapshot generator for metrics.json
	- fetches npm downloads for configured packages
	- writes a simple metrics.json that contains a requests_total and a snapshot_ts
	- intended to be run from CI (GitHub Actions)
*/

const https = require('https');
const fs = require('fs');
const path = require('path');

const PKGS = ['@abimongo/core', '@abimongo/cli', '@abimongo/logger', '@abimongo/create'];
const OUT = path.resolve(__dirname, '..', 'static', 'api', 'metrics.json');

function fetchNpmPoint(pkg, range) {
	const safe = encodeURIComponent(pkg);
	const url = `https://api.npmjs.org/downloads/point/${range}/${safe}`;
	return new Promise((resolve, reject) => {
		https.get(url, (res) => {
			let data = '';
			res.on('data', (c) => data += c);
			res.on('end', () => {
				try {
					const j = JSON.parse(data);
					resolve((j && typeof j.downloads === 'number') ? j.downloads : 0);
				} catch (e) { resolve(0); }
			});
		}).on('error', (err) => reject(err));
	});
}

async function run() {
	const results = [];
	let totalWeek = 0;
	for (const p of PKGS) {
		try {
			const week = await fetchNpmPoint(p, 'last-week');
			results.push({ package: p, week });
			totalWeek += Number(week || 0);
		} catch (e) {
			results.push({ package: p, week: 0, error: String(e && e.message ? e.message : e) });
		}
	}
	const metrics = [];
	metrics.push({ id: 'requests_total', label: 'Total Requests (weekly downloads)', value: totalWeek, unit: 'downloads' });
	metrics.push({ id: 'snapshot_ts', label: 'Snapshot Timestamp', value: new Date().toISOString() });
	// Optionally include per-package data as metrics
	for (const r of results) {
		metrics.push({ id: `npm:${r.package}:week`, label: `${r.package} - last week`, value: r.week });
	}

	fs.mkdirSync(path.dirname(OUT), { recursive: true });
	fs.writeFileSync(OUT, JSON.stringify(metrics, null, 2), 'utf8');
	console.log('Wrote snapshot to', OUT);
}

run().catch((err) => { console.error(err); process.exit(1); });
