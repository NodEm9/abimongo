import { initAbimongo } from '@abimongo/core';

function colorByLevel(level: string, text: string) {
  const codes: Record<string,string> = { info: '\u001b[32m', warn: '\u001b[33m', error: '\u001b[31m' }; 
  const reset = '\u001b[0m';
  return (codes[level] || "") + text + reset;
}

async function start() {
  const app = await initAbimongo.create();
  const db = app.getMongoClient();
  await db?.connect();
  console.log(colorByLevel('info', '✅ MongoDB connected'));

  // Optional: start GC runner if available
  try {
    const gc = app.getGCRunner?.();
    if (gc && typeof gc.start === "function") await gc.start();
    console.log(colorByLevel('info', '♻️  Garbage Collector started.')); 
  } catch (e) { /* ignore optional feature failures */ }

  // Optional: initialize GraphQL if configured
  try {
    const graphql = await app.getGraphQL?.();
    if (graphql && graphql.generateSchema) console.log(colorByLevel("info", "GraphQL ready (schema generation available)."));
  } catch (e) { /* noop */ }
}

start().catch(err => {
  console.error(colorByLevel("error", String(err)));
  process.exit(1);
});