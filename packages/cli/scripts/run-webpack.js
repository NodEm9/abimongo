#!/usr/bin/env node
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const { spawnSync } = require('child_process');
const isWin = process.platform === 'win32';
const cmd = isWin ? 'npx.cmd' : 'npx';
const args = ['webpack', '--config', 'webpack.config.js'];

const res = spawnSync(cmd, args, { stdio: 'inherit', shell: false });
if (res.error) {
  console.error('Failed to run webpack:', res.error);
  process.exit(1);
}
process.exit(res.status);
