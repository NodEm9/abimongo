import * as cron from 'node-cron';
import { runGarbageCollectorOnAllModels } from './gcManager';
import { AbimongoModelRegistry } from '../utils';
import { colorize } from '../utils/color-palatte';


/**
 * Schedules the garbage collector to run at specified intervals using cron.
 * @param {string} cronExpr - The cron schedule string (default: '0 0 * * *' - daily at midnight).
 */
export function scheduleGarbageCollector(cronExpr = '0 * * * *') {
  cron.schedule(cronExpr, async () => {
    console.log(colorize(`[GC] Running garbage collector at ${new Date().toISOString()}`, 'blue'));
    const models = AbimongoModelRegistry.getAllModels();
    
    for (const model of models) {
      const modelName = model.getContext();
      if (!modelName || !modelName.ctx || !modelName.ctx.collectionName) {
        console.warn(colorize(`[GC] Skipping model without valid context or collection name`, 'yellow'));
        continue;
      }
      try {
        console.log(colorize(`[GC] 🔁 Running GC on all registered models...`, 'blue'));
        await runGarbageCollectorOnAllModels();
      } catch (e) {
        console.error(colorize(`[GC] Error running GC for model ${modelName.ctx.collectionName}`, 'red'), e);
      }
    }
  });

}
