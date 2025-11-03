#!/usr/bin/env node
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

function walk(dir, cb) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, cb);
    else cb(full);
  }
}

function sanitizeFile(file) {
  if (!file.endsWith('.md')) return;
  const content = fs.readFileSync(file, 'utf8');
  let out = content;

  // Remove outer code-fence wrappers like ````markdown ... ````
  // Trim leading whitespace/newlines
  out = out.replace(/^\s*``+markdown\s*/i, '');
  out = out.replace(/\s*``+\s*$/i, '');

  // Some generators wrap entire file in triple backticks; remove single outer fences
  out = out.replace(/^\s*```(md|markdown)?\s*/i, '');
  out = out.replace(/\s*```\s*$/i, '');

  if (out !== content) {
    fs.writeFileSync(file, out, 'utf8');
    console.log('Sanitized', file);
  }
}

const docsApiDir = path.join(__dirname, '../docs/website/docs');
if (!fs.existsSync(docsApiDir)) {
  console.error('Docs directory not found:', docsApiDir);
  process.exit(0);
}

walk(docsApiDir, (file) => {
  try {
    sanitizeFile(file);
  } catch (err) {
    console.error('Error sanitizing', file, err.message);
  }
});

console.log('Sanitization complete.');
