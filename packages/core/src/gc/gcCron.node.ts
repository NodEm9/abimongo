import * as cron from 'node-cron';
import { runGarbageCollectorOnAllModels } from './gcManager';
import { AbimongoModelRegistry } from '../utils';
import chalk from 'chalk';


/**
 * Schedules the garbage collector to run at specified intervals using cron.
 * @param {string} cronExpr - The cron schedule string (default: '0 0 * * *' - daily at midnight).
 */
export function scheduleGarbageCollector(cronExpr = '0 * * * *') {
  cron.schedule(cronExpr, async () => {
    console.log(chalk.blueBright(`[GC] Running garbage collector at ${new Date().toISOString()}`));
    const models = AbimongoModelRegistry.getAllModels();
    
    for (const model of models) {
      try {
        console.log(chalk.blueBright(`[GC] 🔁 Running GC on all registered models...`));
        await runGarbageCollectorOnAllModels();
      } catch (e) {
        console.error(chalk.red(`[GC] Error running GC for model ${model.collectionName}`), e);
      }
    }
  });
}
