//src/gc/gcCron.browser.ts
import { colorByLevel } from "@abimongo/logger";

export const startGarbageCollector = () => {
  // No-op for browsers
  console.warn(colorByLevel('warn', '[GC] Garbage collector is disabled in the browser.'));
};
