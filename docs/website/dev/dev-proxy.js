#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
/* Simple dev proxy to expose docs site + metrics API on a single port.
	 - Forwards /api/* to the metrics server (METRICS_TARGET)
	 - Forwards other requests to the Docusaurus dev server (DOCS_TARGET)

	 Usage:
		 node dev-proxy.js
	 Environment variables:
		 DOCS_TARGET (default http://localhost:3001)
		 METRICS_TARGET (default http://localhost:9003)
		 PROXY_PORT (default 3000)
*/

const http = require('http');
const { URL } = require('url');

const DOCS_TARGET = process.env.DOCS_TARGET || 'http://localhost:3001';
const METRICS_TARGET = process.env.METRICS_TARGET || 'http://localhost:9003';
const PROXY_PORT = parseInt(process.env.PROXY_PORT || '3000', 10);

function forward(req, res, target) {
	try {
		const targetUrl = new URL(target + req.url);
		const opts = {
			hostname: targetUrl.hostname,
			port: targetUrl.port || (targetUrl.protocol === 'https:' ? 443 : 80),
			path: targetUrl.pathname + (targetUrl.search || ''),
			method: req.method,
			headers: req.headers,
		};
		const proxyReq = http.request(opts, (proxyRes) => {
			res.writeHead(proxyRes.statusCode, proxyRes.headers);
			proxyRes.pipe(res, { end: true });
		});
		proxyReq.on('error', (err) => {
			res.writeHead(502, { 'Content-Type': 'text/plain' });
			res.end('Bad gateway: ' + err.message);
		});
		req.pipe(proxyReq, { end: true });
	} catch (err) {
		res.writeHead(500, { 'Content-Type': 'text/plain' });
		res.end('Proxy error: ' + String(err));
	}
}

const server = http.createServer((req, res) => {
	try {
		if (req.url && req.url.startsWith('/api')) {
			forward(req, res, METRICS_TARGET);
			return;
		}
		// otherwise forward to docs
		forward(req, res, DOCS_TARGET);
	} catch (e) {
		res.writeHead(500, { 'Content-Type': 'text/plain' });
		res.end('Unhandled proxy error');
	}
});

server.listen(PROXY_PORT, () => {
	console.log(`[dev-proxy] Listening on http://localhost:${PROXY_PORT}`);
	console.log(`[dev-proxy] Docs target: ${DOCS_TARGET}`);
	console.log(`[dev-proxy] Metrics target: ${METRICS_TARGET}`);
});
