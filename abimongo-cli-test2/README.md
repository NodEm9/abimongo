# abimongo-cli-test2

This project was initialized with Abimongo CLI.

This starter uses the Abimongo bootstrap helper exported as `initAbimongo` from `@abimongo/core`.

Example (src/main.ts):

import { initAbimongo } from '@abimongo/core';

async function start() {
  const app = await initAbimongo.create(); // reads ./abimongo.config.json by default
  const db = app.getMongoClient();
  await db?.connect();
  console.log('✅ MongoDB connected');
  // Start optional features based on config (gc, graphql, etc.)
}

start().catch(console.error);

Next steps:

1. cd abimongo-cli-test2
2. Install dependencies (pnpm install or npm install)
3. Start your app: `node ./dist/src/main.js` (or compile your TypeScript)

The abimongo config file is at ./abimongo.config.json