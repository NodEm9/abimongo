#!/usr/bin/env node
/* eslint-disable no-restricted-syntax, @typescript-eslint/no-var-requires */
/* Small runner that launches the metrics server, dev-proxy and then docusaurus start.
  Run from repo root: node docs/website/dev/run-dev.js
*/
const { spawn } = require('child_process');
const path = require('path');

function start(name, cmd, args, opts = {}) {
  console.log(`Starting ${name}: ${cmd} ${args.join(' ')}`);
  const p = spawn(cmd, args, Object.assign({ stdio: 'inherit', shell: process.platform === 'win32' }, opts));
  p.on('exit', (code, signal) => {
    console.log(`${name} exited with`, code, signal);
  });
  p.on('error', (err) => console.error(`${name} error:`, err));
  return p;
}

const repoRoot = path.resolve(__dirname, '..', '..');

// start metrics server
start('metrics-server', 'node', ['docs/website/dev/metrics-server.js'], { cwd: repoRoot });

// start dev-proxy (optional)
start('dev-proxy', 'node', ['docs/website/dev/dev-proxy.js'], { cwd: repoRoot });

// start docusaurus dev
start('docusaurus', 'pnpm', ['run', 'docs:dev'], { cwd: repoRoot });

// keep this parent process alive
process.stdin.resume();
