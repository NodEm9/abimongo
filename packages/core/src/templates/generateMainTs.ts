import { ProjectOptions, AbimongoConfig } from '../types/AbimongoConfig'

// ${options.logger?.enabled ? "import { logger } from '@abimongo/core';" : ''}

export function generateMainTS(options: AbimongoConfig): string {
  return `import { AbimongoBootstrapFactory } from '@abimongo/core';
${options.graphql?.enabled ? "import { AbimongoGraphQL } from '@abimongo/core';" : ''}
<<<<<<< HEAD:packages/core/src/templates/generateMainTs.ts

=======
${options.logger?.enabled ? "import { logger } from '@abimongo/core';" : ''}
>>>>>>> eaae3d6 (Fix bootstraping class webpack runtiime error and update tsconfig by setting types to node, also add new jest setupTest config file to ensure test are not causing errors due to type=node set in tsconfig):core/src/templates/generateMainTs.ts
import { bootstrap } from './core/AbimongoBootstrap';
/**
 *  You can use this built-in logger or create your own
 *  If you want to use the built-in logger, make sure to enable it in your project options.
 *  If want to control the logger, you can create your own logger and by installing the abimongo-logger package.
 *  You can also use the logger from the abimongo_core package which is a built-in logger from the abimongo-logger package.
 * */


async function main() {

<<<<<<< HEAD:packages/core/src/templates/generateMainTs.ts
const run = await bootstrap();
  run.onConnect(() => {
=======
await bootstrap();
  bootstrap.onConnect(() => {
>>>>>>> eaae3d6 (Fix bootstraping class webpack runtiime error and update tsconfig by setting types to node, also add new jest setupTest config file to ensure test are not causing errors due to type=node set in tsconfig):core/src/templates/generateMainTs.ts
    console.log('✨ App is fully bootstrapped!');
  });

  return run;
}

main().catch((err) => {
  console.error('❌ Failed to start app:', err);
  process.exit(1);
});
`;
}

