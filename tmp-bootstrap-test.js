/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
(async function () {
	try {
		const { AbimongoBootstrap } = require('./packages/core/dist/abimongo-core.js');
		const path = require('path');
		const cfg = path.resolve(process.cwd(), 'cli-vtest2', 'abimongo.config.json');
		console.log('Using config:', cfg);
		const app = new AbimongoBootstrap();
		await app.initialize(cfg);
		console.log('Initialized OK');
	} catch (e) {
		console.error('BOOTSTRAP ERROR:');
		console.error(e && e.stack ? e.stack : e);
		process.exit(1);
	}
})();
