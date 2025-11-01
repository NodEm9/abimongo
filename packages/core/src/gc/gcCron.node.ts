import * as cron from 'node-cron';
import { runGarbageCollectorOnAllModels } from './gcManager';
import { AbimongoModelRegistry } from '../utils';
import { colorByLevel } from '@abimongo/logger';


/**
 * Schedules the garbage collector to run at specified intervals using cron.
 * @param {string} cronExpr - The cron schedule string (default: '0 0 * * *' - daily at midnight).
 */
export function scheduleGarbageCollector(cronExpr = '0 * * * *') {
  cron.schedule(cronExpr, async () => {
    console.log(colorByLevel('info', `[GC] Running garbage collector at ${new Date().toISOString()}`));
    const models = AbimongoModelRegistry.getAllModels();
    
    for (const model of models) {
      try {
        console.log(colorByLevel('info', `[GC] 🔁 Running GC on all registered models...`));
        await runGarbageCollectorOnAllModels();
      } catch (e) {
        console.error(colorByLevel('error', `[GC] Error running GC for model ${model.collectionName}`), e);
      }
    }
  });
}
