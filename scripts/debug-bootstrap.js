/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const core = require(path.resolve(__dirname, '..', 'packages', 'core', 'dist', 'abimongo-core.js'));
(async () => {
	try {
		const AbimongoBootstrap = core.AbimongoBootstrap;
		const instance = new AbimongoBootstrap();
		const cfgPath = path.resolve(process.cwd(), 'abimongo-cli-test2', 'abimongo.config.json');
		console.log('Using config path:', cfgPath);
		await instance.initialize(cfgPath);
		console.log('Initialized OK');
	} catch (err) {
		console.error('ERROR during initialize:', err && err.stack ? err.stack : err);
		process.exit(1);
	}
})();