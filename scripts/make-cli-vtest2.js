const fs = require('fs');
const path = require('path');

(async function () {
	try {
		const target = path.resolve(process.cwd(), 'cli-vtest2');
		if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });

		const config = {
			projectName: 'cli-vtest2',
			mongoUri: 'mongodb://127.0.0.1:27017/abimongo-test',
			logger: { enabled: false },
			graphql: { enabled: false },
			features: { useRedisCache: false },
			advanced: { garbageCollector: { enabled: false, logResults: true }, gcCron: '0 0 * * *' }
		};

		fs.writeFileSync(path.join(target, 'abimongo.config.json'), JSON.stringify(config, null, 2), 'utf8');

		const pkg = {
			name: 'cli-vtest2',
			version: '1.0.0',
			private: true,
			scripts: { start: 'node index.js' },
			dependencies: { '@abimongo/core': 'workspace:^1.0.0' }
		};
		fs.writeFileSync(path.join(target, 'package.json'), JSON.stringify(pkg, null, 2), 'utf8');

		console.log('Created cli-vtest2 with abimongo.config.json and package.json at', target);
	} catch (e) {
		console.error(e);
		process.exit(1);
	}
})();
