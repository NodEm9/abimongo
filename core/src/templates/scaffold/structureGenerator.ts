import fs from 'fs-extra';
import path from 'path';
import { AbimongoConfig, ProjectOptions } from '../../types';
import { execSync } from 'child_process';
import chalk from 'chalk';
import { MAIN_TS_CONTENT } from '../core/main';

export async function generateAppStructure(projectRoot: string, options: AbimongoConfig) {
  const srcDir = path.join(projectRoot, 'src');
  const coreDir = path.join(srcDir, 'core');
  const utilsDir = path.join(srcDir, 'utils');
  const graphqlDir = path.join(srcDir, 'graphql');
  const typesDir = path.join(srcDir, 'types');
  const templatesDir = path.join(projectRoot, 'templates');

  // Create directories
  await fs.ensureDir(srcDir);
  await fs.ensureDir(coreDir);
  await fs.ensureDir(utilsDir);
  await fs.ensureDir(typesDir);

  const abimongoBootstrapFileContent = MAIN_TS_CONTENT;

  if (options.graphql?.enabled) {
    await fs.ensureDir(graphqlDir);
  }

  // Create placeholder files
  await fs.writeFile(path.join(coreDir, 'AbimongoBootstrap.ts'), abimongoBootstrapFileContent);
  await fs.writeFile(path.join(utilsDir, 'loadAbimongoConfig.ts'), '// loadAbimongoConfig implementation');
  await fs.writeFile(path.join(typesDir, 'config.ts'), '// Config types');

  if (options.graphql?.enabled) {
    await fs.writeFile(path.join(graphqlDir, 'schema.gql'),
      `# GraphQL schema
# This is a placeholder for your GraphQL schema.
# You can define your types and queries here.

# @graphql
# This is a simple example of a GraphQL query.
# You can expand this schema with your own types and queries.
# or use built-in AbimongoGraphQL class to generate it dynamically.
# then you can pass it to your GraphQL server. 
# For more information, visit: https://graphql.org/learn/schema/
#
    
type Query {
  hello: String
}
  `
    );

    await fs.writeFile(path.join(graphqlDir, 'resolvers.ts'),
      `// GraphQL resolvers implementation

/**
 *  This is a placeholder for your GraphQL resolvers.
 * You can define your resolvers here to handle the queries and mutations defined in your schema.
 * For more information, visit: https://graphql.org/learn/execution/
 * You can use AbimongoGraphQL class to generate resolvers dynamically.
 * For more information, visit: https://abimongo.com/docs/graphql
*/


export const resolvers = {
 Query: {
  hello: () => 'Hello, world!',
 },
};
`)
  };


  // Create package.json
  const packageJson = {
    "name": options.projectName,
    "description": "My Abimongo project",
    "private": true,
    "version": "1.0.0",
    "main": "src/main.ts",
    "type": "module",
    "scripts": {
      "dev": "ts-node src/main.ts",
      "build": "tsc",
      "start": "node dist/main.js",
    },
    "author": "Your Name",
    "license": "ISC",
    "module": "commonjs",
    "dependencies": {
      "mongodb": "^6.14.2",
      "node-cron": "^4.2.0"
    },
    "devDependencies": {
      "typescript": "^5.3.3",
      "ts-node": "^10.9.1",
    },
  };

  fs.writeFileSync(
    path.join(projectRoot, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          "target": 'ES2022',
          "lib": ["DOM", "ES2022"],
          "moduleDetection": "auto",
          "module": 'commonjs',
          "rootDir": './src',
          "outDir": './dist',
          "esModuleInterop": true,
          "resolveJsonModule": true,
          "forceConsistentCasingInFileNames": true,
          "strict": true,
          "skipLibCheck": true
        },
        "include": ['src/**/*'],
        "exclude": ['node_modules', 'dist', 'templates']
      },
      null,
      2
    )
  );


  await fs.writeJson(path.join(projectRoot, 'package.json'), packageJson, { spaces: 2 });

  execSync(`npm install @abimongo/core @abimongo/logger mongodb`, { cwd: projectRoot, stdio: 'inherit' });
  console.log(chalk.blueBright(`[Installing dependencies]: Installing dependencies...`));

  execSync(`npm install -D typescript ts-node @types/node`, { cwd: projectRoot, stdio: 'inherit' });
  console.log(chalk.blueBright(`[Installing dev dependencies]: Installing dev dependencies...`));

  // Create .gitignore
  const gitignoreContent = `node_modules
dist
.env
`;
  await fs.writeFile(path.join(projectRoot, '.gitignore'), gitignoreContent);
}
