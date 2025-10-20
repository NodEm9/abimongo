import { ProjectOptions, AbimongoConfig } from '../types/AbimongoConfig'


export function generateMainTS(options: AbimongoConfig): string {
  return `import { AbimongoBootstrapFactory } from '@abimongo/core';
${options.graphql?.enabled ? "import { AbimongoGraphQL } from '@abimongo/core';" : ''}
${options.logger?.enabled ? "import { logger } from '@abimongo/core';" : ''}
import { bootstrap } from './core/AbimongoBootstrap';
/**
 *  You can use this built-in logger or create your own
 *  If you want to use the built-in logger, make sure to enable it in your project options.
 *  If want to control the logger, you can create your own logger and by installing the abimongo-logger package.
 *  You can also use the logger from the abimongo_core package which is a built-in logger from the abimongo-logger package.
 * */


async function main() {

await bootstrap();
  bootstrap.onConnect(() => {
    console.log('✨ App is fully bootstrapped!');
  });

  const db = await bootstrap.getMongoClient();
  await db?.connect();

  console.log('✅ MongoDB connected');

  process.on('SIGINT', async () => {
    console.log('\\nSIGINT received — shutting down...');
    await bootstrap.shutdown();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\\nSIGTERM received — shutting down...');
    await bootstrap.shutdown();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error('❌ Failed to start app:', err);
  process.exit(1);
});
`;
}

