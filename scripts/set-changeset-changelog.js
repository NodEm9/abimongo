#!/usr/bin/env node
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const cfgPath = path.join(process.cwd(), '.changeset', 'config.json');
let cfg = {};
if (fs.existsSync(cfgPath)) {
  cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
}

if (process.env.GH_TOKEN) {
  // prefer GitHub changelog when token is available
  cfg.changelog = '@changesets/changelog-github';
  // ensure repo is set if possible
  if (!cfg.repo && process.env.GITHUB_REPOSITORY) {
    cfg.changelog = [ '@changesets/changelog-github', { repo: process.env.GITHUB_REPOSITORY } ];
  }
  fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2), 'utf8');
  console.log('Wrote changeset config to use GitHub changelog adapter');
} else {
  console.log('GH_TOKEN not present; leaving changeset config as-is (git adapter)');
}
