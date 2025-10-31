import fs from 'fs-extra';
import path from 'path';
import { AbimongoConfig } from '../../types';
import { execSync } from 'child_process';
import { colourize } from '../../utils';
import { MAIN_TS_CONTENT } from '../core/main';
import { findPackageJSON } from 'module';


export async function generateAppStructure(projectRoot: string, options: AbimongoConfig) {
  const srcDir = path.join(projectRoot, 'src');
  const coreDir = path.join(srcDir, 'core');
  const utilsDir = path.join(srcDir, 'utils');
  const graphqlDir = path.join(srcDir, 'graphql');
  const typesDir = path.join(srcDir, 'types');
  const modelsDir = path.join(srcDir, 'models');

  // Create directories
  await fs.ensureDir(srcDir);
  await fs.ensureDir(coreDir);
  await fs.ensureDir(utilsDir);
  await fs.ensureDir(typesDir);
  await fs.ensureDir(modelsDir);

  const abimongoBootstrapFileContent = MAIN_TS_CONTENT;

  if (options.graphql?.enabled) {
    await fs.ensureDir(graphqlDir);
  }

  // Create placeholder files
  await fs.writeFile(path.join(coreDir, 'initAbimongo.ts'), abimongoBootstrapFileContent);
  await fs.writeFile(path.join(utilsDir, 'helper.ts'), '// helper functions implementation');
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
    fs.writeFileSync(path.join(graphqlDir, 'graphQL.ts'),
      `import { bootstrap } from '../core/AbimongoBootstrap';
// You can use AbimongoGraphQL to setup your GraphQL server
// but here everthing is already made available in the bootstrap file.
// For more information, visit: https://github.com/NodEm9/abimongo/core/features/AbimongoGraphQL , https://github.com/NodEm9/abimongo/core/abimongo-bootstrap/AbimongoBootstrap
import { run } from '../core/initAbimongo';

export const app =  (await (run())); // or new AbimongoGraphQL({useRedis: false});
const graphql = app.getGraphQL();
     graphql?.generateSchema();
/**
 *  Other GraphQL logic can go here.
 * For example, setting up middleware, context, etc.
 * This is just a placeholder file. Incase you like to separate your GraphQL setup.
 * Otherwise, everything is already available in the bootstrap file.
 * Also, this is to illustrate how you can use bootstrap accross your app. Import
 * bootstrap from core/AbimongoBootstrap and use it to access your app components.
 */
    `);
  };


  // Create package.json
  const packageJson = {
    "name": options.projectName,
    "description": "My Abimongo project",
    "private": true,
    "version": "1.0.0",
    "main": "src/main.ts",
    "type": "commonjs",
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
    },
    "devDependencies": {
      "typescript": "^5.9.3",
      "ts-node": "^10.9.2",
    },
  };

  fs.writeFileSync(
    path.join(projectRoot, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          // Environment and Module Settings
          "target": 'ES2021',
          "lib": [],
          "moduleDetection": "auto",
          "module": 'commonjs',
          "moduleResolution": 'node',
          "rootDir": './src',
          "outDir": './dist',

          // Source Map/Outputs Settings
          "sourceMap": true,
          "declaration": true,
          "declarationMap": true,
          "esModuleInterop": true,

          // Typechecking Options (strictness)
          "noUncheckedIndexedAccess": true,
          "exactOptionalPropertyTypes": true,
          "forceConsistentCasingInFileNames": true,
          "noImplicitReturns": true,
          "noImplicitAny": true,

          // Recommended Options Settings
          "resolveJsonModule": true,
          "jsx": "react-jsx",
          "strict": true,
          "skipLibCheck": true
        },
        "include": ['src/**/*'],
        "exclude": ['node_modules', 'dist']
      },
      null,
      2
    )
  );

  
  await fs.writeJson(path.join(projectRoot, 'package.json'), packageJson, { spaces: 2 });

  // execSync(`${getPackageManagerCommand(pkgManagerProps)} @abimongo/core @abimongo/logger mongodb, { cwd: projectRoot, stdio: 'inherit' });
  execSync(`npm install express mongodb`, { cwd: projectRoot, stdio: 'inherit' });
  console.log(colourize(`[Installing dependencies]: Installing dependencies...`, 'blueBright'));

execSync(`npm install -D typescript ts-node @types/node`, { cwd: projectRoot, stdio: 'inherit' });
  console.log(colourize(`[Installing dev dependencies]: Installing dev dependencies...`, 'blueBright'));

  // Create .gitignore
  const gitignoreContent = `node_modules
dist
lib
.store
.env
`;
  await fs.writeFile(path.join(".", '.gitignore'), gitignoreContent);
}

