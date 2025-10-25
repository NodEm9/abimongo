import path from "path";
import chalk from "chalk";



(async () => {
try {
  const buildPath = path.resolve(__dirname, '../abimongo_core.node.js'); 

 async function resolvePath(p) {

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
      console.error(chalk.red('❌ Missing exports in abimongo_core build:'));
      for (const name of missing) {
        console.error(`- ${name}`);
      }
      process.exit(1);
    }

    console.log(chalk.green('✅ All required exports are present in abimongo_core.'));
    return path.isAbsolute(p) ? p : path.join(__dirname, p);
  }
  resolvePath(buildPath);
} catch (err) {
  console.error(chalk.red('❌ Failed to load abimongo_core build output:'), err);
  process.exit(1);
}
})()
