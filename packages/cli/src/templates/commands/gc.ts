import { AbimongoClient } from '@abimongo/core';

/**
 * This function runs the global garbage collector for Abimongo.
 * It logs the start and completion of the GC process.
 */
export async function runGCCommand() {
  console.log(`Running Garbage Collector...`);
  await AbimongoClient.runGlobalGC();
  console.log(`✅ GC completed.`);
}
