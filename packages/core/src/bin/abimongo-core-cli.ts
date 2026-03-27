#!/usr/bin/env node
import { Command } from 'commander';
import { generateProject } from '../init-cli/generate.project.js';

export default function runBootstrapCLI() {
	const program = new Command();

	program
		.name('abimongo')
		.description('CLI to generate Abimongo projects')
		.option('--with-graphql', 'Include GraphQL setup')
		.option('--with-redis', 'Include Redis caching setup')
		.option('--logger', 'Include logger setup')
		.option('--multi-tenant', 'Enable multi-tenant mode')
		.option('--uri <mongodbUri>', 'MongoDB connection URI')
		.option('--rbac', 'Enable Role-Based Access Control (RBAC)')
		.option('--with-garbage-collector', 'Enable garbage collector manager')
		.option('--install', 'Auto-install dependencies during scaffold')
		.argument('<projectName>', 'Name of the project')
		.version('1.0.0', '-v, --version', 'Output the current version of the CLI')
		.action((projectName, options) => {
			console.log('[abimongo CLI] Invoking generateProject with:', { projectName, options });
			// cast to any to avoid a tight type-check here; generateProject expects a flexible config shape
			generateProject({
				projectName,
				graphql: { enabled: options.withGraphql },
				features: { useRedisCache: options.withRedis },
				logger: options.logger,
				multiTenant: options.multiTenant,
				advanced: {
					garbageCollector: options.withGarbageCollector,
					autoInstall: Boolean(options.install),
				},
				mongoClient: options.uri, 
			});
		});

	program.parse(process.argv);
}

if (require.main === module) {
	runBootstrapCLI();
}
