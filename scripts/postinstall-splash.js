#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

// This script is intentionally simple and opt-in. It prints the curated
// `abimongo-brand/extras/cli_splash.txt` file when the environment variable
// ABIMONGO_SHOW_SPLASH is truthy (1/true/yes). This keeps the postinstall
// behavior non-intrusive for consumers.

function isFalsy(v) {
  if (typeof v === 'undefined' || v === null) return false;
  return ['0', 'false', 'no'].includes(String(v).toLowerCase());
}

// If ABIMONGO_SHOW_SPLASH is explicitly set to a falsy value, skip showing the splash.
if (isFalsy(process.env.ABIMONGO_SHOW_SPLASH)) process.exit(0);

const splashPath = path.resolve(__dirname, '..', 'abimongo-brand', 'extras', 'cli_splash.txt');
const GITHUB_RAW = 'https://raw.githubusercontent.com/NodEm9/abimongo/main/abimongo-brand/extras/cli_splash.txt';

async function tryPrintLocalOrRemote() {
  try {
    if (fs.existsSync(splashPath)) {
      const txt = fs.readFileSync(splashPath, 'utf8');
      console.log(txt);
      return;
    }

    // fallback: try to fetch from GitHub raw if network available
    if (typeof fetch === 'function') {
      try {
        const res = await fetch(GITHUB_RAW);
        if (res.ok) {
          const text = await res.text();
          if (text && text.length > 10) {
            console.log(text);
            return;
          }
        }
      } catch (e) {
        // ignore network errors
      }
    }
  } catch (err) {
    // ignore any errors during postinstall
  }
}

// Run it (fire-and-forget is fine during postinstall)
tryPrintLocalOrRemote().catch(() => {});
