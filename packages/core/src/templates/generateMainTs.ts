import { AbimongoConfig } from '../types/AbimongoConfig.js'


export function generateMainTS(options: AbimongoConfig): string {
  return `import { initAbimongo } from '@abimongo/core';
${options.graphql?.enabled ? "import { AbimongoGraphQL } from '@abimongo/core';" : ''}
${options.logger?.enabled ? "import { logger } from '@abimongo/core';" : ''}

import { run } from './core/initAbimongo';

/**
 *  You can use this built-in logger or create your own
 *  If you want to use the built-in logger, make sure to enable it in your project options.
 *  If want to control the logger, you can create your own logger and by installing the abimongo-logger package.
 *  You can also use the logger from the abimongo_core package which is a built-in logger from the abimongo-logger package.
 * */


async function main() {

const runApp = await run();
  runApp.onConnect(() => {
    console.log('✨ App is fully bootstrapped!');
  });

  return runApp;
}

main().catch((err) => {
  console.error('❌ Failed to start app:', err);
  process.exit(1);
});
`;
}