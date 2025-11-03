//src/gc/gcCron.browser.ts
import { colorize } from "../utils/color-palatte";

export const startGarbageCollector = () => {
  // No-op for browsers
  console.warn(colorize('[GC] Garbage collector is disabled in the browser.', 'red'));
};
