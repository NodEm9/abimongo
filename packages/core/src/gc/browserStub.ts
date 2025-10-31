//src/gc/gcCron.browser.ts
import { colourize } from "../utils";

export const startGarbageCollector = () => {
  // No-op for browsers
  console.warn(colourize('[GC] Garbage collector is disabled in the browser.', 'yellow'));
};
