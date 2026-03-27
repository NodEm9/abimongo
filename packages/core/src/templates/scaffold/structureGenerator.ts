import fs from 'fs-extra';
import path from 'path';
import { AbimongoConfig } from '../../types/index.js';
import { execSync } from 'child_process';
import { colorize } from '../../utils/color-palatte.js';
import { MAIN_TS_CONTENT } from '../core/main.js';


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
    fs.writeFileSync(path.join(graphqlDir, 'graphQL.ts'), `
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

  // Note: we intentionally do not read or overwrite GraphQL starter files from
  // an external template. The generator writes a sensible default `graphQL.ts`
  // above and should not be replaced by a raw template file which may import
  // internal bootstrap code directly. Removing the overwrite ensures the
  // generated starter remains consistent and prevents accidental runtime
  // cross-module issues caused by copying raw bootstrap code into projects.

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
      "graphql": "16.11.0",
      "redis": "4.7.1",
      "@apollo/server": "5.1.0",
      "express": "^4.21.2",
    },
    // Force a single graphql version for downstream dependencies (pnpm/yarn)
    "overrides": {
      "graphql": "16.11.0"
    },
    "devDependencies": {
      "typescript": "^5.9.3",
      "ts-node": "^10.9.2",
      "@types/node": "^22.15.30",
      "@types/express": "^5.0.1",
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
  // By default we do NOT run npm/yarn installs during scaffolding because
  // running a package manager here may block (network, registry) and will
  // make `npx abimongo` slower or fail in offline/test environments.
  // If consumers want automatic install, pass `advanced.autoInstall = true`
  // in the options (not enabled by default).
  if (options.advanced && (options.advanced as any).autoInstall) {
    try {
      execSync(`pnpm install @abimongo/core @abimongo/logger`, { cwd: projectRoot, stdio: 'inherit' });
      console.log(colorize(`[Installing dependencies]: Installed runtime dependencies.`, 'green'));
    } catch (err) {
      console.log(colorize(`⚠️  Dependency installation failed or was interrupted. Skipping install.`, 'yellow'), err);
    }
  } else {
    console.log(colorize(`[Skipping install]: To auto-install dependencies during scaffold set advanced.autoInstall=true in options.`, 'blue'));
    console.log(colorize(`[Next steps]: cd ${projectRoot} && npm install`, 'blue'));
  }

  // Create .gitignore
  const gitignoreContent = `node_modules
dist
lib
.store
.env
`;
  await fs.writeFile(path.join(projectRoot, '.gitignore'), gitignoreContent);
}

