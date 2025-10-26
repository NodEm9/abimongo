//src/gc/gcCron.browser.ts
import chalk from 'chalk';

export const startGarbageCollector = () => {
  // No-op for browsers
  console.warn(chalk.yellow('[GC] Garbage collector is disabled in the browser.'));
};
