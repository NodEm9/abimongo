import path from "path";
import { colorize } from "../../core/src/utils/color-palatte";


(async () => {
  try {
    const buildPath = path.resolve(__dirname, '../abimongo_core.node.js');

    async function resolvePath(p: string) {

      const abimongo = await import(buildPath);

      const requiredExports = [
        'AbimongoBootstrap',
        'AbimongoBootstrapFactory',
        'AbimongoSchema',
        'AbimongoModel',
        'createModel',
        'createSchema',
        'AbimongoGraphQL',
        'AbimongoClient',
        'applyMultitenancy',
        'connectRedis',
        'initializeRedis',
        'initMultiTenancy',
        'RedisService',
      ];

      const missing = requiredExports.filter(key => !(key in abimongo));

      if (missing.length > 0) {
        console.error(colorize('❌ Missing exports in @abimongo/core build:', 'red'));
        for (const name of missing) {
          console.error(`- ${name}`);
        }
        process.exit(1);
      }

      console.log(colorize('✅ All required exports are present in @abimongo/core.', 'red'));
      return path.isAbsolute(p) ? p : path.join(__dirname, p);
    }
    resolvePath(buildPath);
  } catch (err) {
    console.error(colorize('❌ Failed to load @abimongo/core build output:', 'red'), err);
    process.exit(1);
  }
})()
