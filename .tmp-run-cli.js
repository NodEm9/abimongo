process.env.ABIMONGO_DISABLE_SIGNAL_HANDLERS = '1';
console.log('Bootstrapping debug require of core dist...');
const core = require('./packages/core/dist/abimongo-core-cli.js');
console.log('dist module keys:', Object.keys(core));
console.log('typeof default:', typeof core.default);
if (typeof core.default === 'function') {
	console.log('Invoking default export...');
	try {
		core.default();
		console.log('default invoked synchronously.');
	} catch (err) {
		console.error('Error invoking default export:', err);
	}
} else {
	console.log('No default function to call.');
}
