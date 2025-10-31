import * as cron from 'node-cron';
import { runGarbageCollectorOnAllModels } from './gcManager';
import { AbimongoModelRegistry } from '../utils';
import { colourize } from '../utils';


/**
 * Schedules the garbage collector to run at specified intervals using cron.
 * @param {string} cronExpr - The cron schedule string (default: '0 0 * * *' - daily at midnight).
 */
export function scheduleGarbageCollector(cronExpr = '0 * * * *') {
  cron.schedule(cronExpr, async () => {
    console.log(colourize(`[GC] Running garbage collector at ${new Date().toISOString()}`, 'blueBright'));
    const models = AbimongoModelRegistry.getAllModels();
    
    for (const model of models) {
      try {
        console.log(colourize(`[GC] 🔁 Running GC on all registered models...`, 'blueBright'));
        await runGarbageCollectorOnAllModels();
      } catch (e) {
        console.error(colourize(`[GC] Error running GC for model ${model.collectionName}`, 'red'), e);
      }
    }
  });
}
