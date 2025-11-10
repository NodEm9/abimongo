#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// This script is intentionally simple and opt-in. It prints the curated
// `abimongo-brand/extras/cli_splash.txt` file when the environment variable
// ABIMONGO_SHOW_SPLASH is truthy (1/true/yes). This keeps the postinstall
// behavior non-intrusive for consumers.

function isTruthy(v) {
  if (!v) return false;
  return ['1', 'true', 'yes'].includes(String(v).toLowerCase());
}

if (!isTruthy(process.env.ABIMONGO_SHOW_SPLASH)) process.exit(0);

const splashPath = path.resolve(__dirname, '..', 'abimongo-brand', 'extras', 'cli_splash.txt');
try {
  if (fs.existsSync(splashPath)) {
    const txt = fs.readFileSync(splashPath, 'utf8');
    console.log(txt);
  }
} catch (e) {
  // ignore errors during postinstall
}
