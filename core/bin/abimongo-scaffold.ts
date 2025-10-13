#!/usr/bin/env node
import { Command } from 'commander';
import { generateProject } from '../src/init-cli/generate.project';

const program = new Command();
let appName!: string;

program
  .name(appName ? 'abimongo-app' : '')
  .description('CLI to generate Abimongo projects')
  .option('--with-graphql', 'Include GraphQL setup')
  .option('--with-redis', 'Include Redis caching setup')
  .option('--logger', 'Include logger setup')
  .option('--multi-tenant', 'Enable multi-tenant mode')
  .option('--uri <mongodbUri>', 'MongoDB connection URI')
  .option('--rbac', 'Enable Role-Based Access Control (RBAC)')
  .option('--with-garbage-collector', 'Enable garbage collector manager')
  .argument('<projectName>', 'Name of the project')
  .version('1.0.0', '-v, --version', 'Output the current version of the CLI')
  .action((projectName, options) => {
    generateProject({
      projectName,
      graphql: { enabled: options.withGraphql },
      features: { useRedisCache: options.withRedis },
      logger: options.logger,
      multiTenant: options.multiTenant,
      advanced: {
        garbageCollector: options.withGarbageCollector,
      }
    });
  });

program.parse(process.argv);
