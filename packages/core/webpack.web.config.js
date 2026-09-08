const path = require('path');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');


module.exports = {
	mode: 'production',
	entry: './src/browser.ts',
	target: 'web',
	output: {
		filename: 'abimongo-core-browser.js',
		path: path.resolve(__dirname, 'dist'),
		library: {
			name: 'abimongocore-browser', // global name if script loaded in <script> tag
			type: 'umd', // Universal Module Definition for compatibility with CommonJS, AMD, and browser globals
			umdNamedDefine: true, // Use named UMD definition
		},
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.js$/,
				include: /node_modules\/node-cron/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [['@babel/preset-env', { targets: { node: '16' } }]],
					}
				}
			},
		],
	},
	externals: [
		/^node_modules\/.+$/,
		nodeExternals(),
		{
			'mongodb': {
				commonjs: 'mongodb',
				commonjs2: 'mongodb',
				amd: 'mongodb',
				root: 'mongodb',
			},
			'@apollo/server': {
				commonjs: '@apollo/server',
				commonjs2: '@apollo/server',
				amd: '@apollo/server',
				root: '@apollo/server',
			},
			graphql: {
				commonjs: 'graphql',
				commonjs2: 'graphql',
				amd: 'graphql',
				root: 'graphql',
			},
			'express': {
				commonjs: 'express',
				commonjs2: 'express',
				amd: 'express',
				root: 'express',
			},
			'express-serve-static-core': {
				commonjs: 'express-serve-static-core',
				commonjs2: 'express-serve-static-core',
				amd: 'express-serve-static-core',
				root: 'express-serve-static-core',
			},
			// Prevent bundling node_modules
			buffer: 'buffer',
			fs: 'fs',
			path: 'path',
			os: 'os',
			http: 'http',
			https: 'https',
			net: 'net',
			dns: 'dns',
			"events": 'false'
		}
	],
	optimization: {
		providedExports: true,
		usedExports: false,
		"sideEffects": false,
		// "mangleExports": "size",
	},
	recordsPath: path.join(__dirname, 'records.json'),
	resolve: {
		extensions: ['.ts', '.js'],
		plugins: [new TsconfigPathsPlugin()],
		alias: {
			'@gcCron': path.resolve(__dirname, 'src/gc/gcCron.browser.ts'),
			'@measureQuery': path.resolve(__dirname, 'src/instrumentation/measureQuery.browser.ts')
		},
		fallback: {
			buffer: false,
			console: false,
			'node:crypto': false,
			crypto: false,
			child_process: false,
			fs: false,
			os: false,
			path: false,
			util: false,
			"assert": false,
			"stream": false,
			"vm": false,
			"http": false,
			"url": false,
			"tls": false,
			"zlib": false,
			"string_decoder": false,
			"async_hooks": false,
			"perf_hooks": false,
			"node:perf_hooks": false,
			"URI": false,
			"constants": false,
			"timers": false,
			"tty": false,
		},

	},
	plugins: [
		new webpack.ProvidePlugin({
			Buffer: ['buffer', 'Buffer'],
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production'),
			'process.env.BROWSER': JSON.stringify(true),
		}),
		new webpack.IgnorePlugin({
			resourceRegExp: /^node:async_hooks$/,
		}),
		new webpack.IgnorePlugin({
			resourceRegExp: /node-cron/, // avoid bundling node-cron for browser
			contextRegExp: /node_modules/,
		}),
		new webpack.IgnorePlugin({ resourceRegExp: /^redis(|\/.*)$/ }),
		new webpack.IgnorePlugin({
			resourceRegExp: /^fs$/,
			contextRegExp: /node_modules/,
		}),
		new webpack.IgnorePlugin({
			resourceRegExp: /^child_process$/,
			contextRegExp: /node_modules/,
		}),
		new webpack.IgnorePlugin({
			resourceRegExp: /^node:crypto$/,
			contextRegExp: /node_modules/,
		}),
	],
	devtool: 'source-map', // Generate source maps for debugging
	stats: {
		errorDetails: true
	},
	context: __dirname,
};


// const path = require('path');
// const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
// const webpack = require('webpack');
// const nodeExternals = require('webpack-node-externals');


// module.exports = {
// 	mode: 'production',
// 	entry: './src/browser.ts',
// 	target: 'web',
// 	output: {
// 		filename: 'abimongo-core-browser.js',
// 		path: path.resolve(__dirname, 'dist'),
// 		library: {
// 			name: 'abimongocore-browser', // global name if script loaded in <script> tag
// 			type: 'umd', // Universal Module Definition for compatibility with CommonJS, AMD, and browser globals
// 			umdNamedDefine: true, // Use named UMD definition
// 		},
// 	},
// 	module: {
// 		rules: [
// 			{
// 				test: /\.tsx?$/,
// 				use: [
// 					{
// 						loader: 'ts-loader',
// 						options: {
// 							// This is the magic flag for your situation:
// 							// It prevents ts-loader from trying to type-check files in node_modules
// 							transpileOnly: true,
// 							onlyCompileBundledFiles: true,
// 							// happyPackMode: true
// 						},
// 					},
// 				],
// 				// Use an absolute path to be 100% sure
// 				include: path.resolve(__dirname, 'src'),
// 				exclude: [/^node_modules/, /^examples\//i],
// 			},
// 			{
// 				test: /\.js$/,
// 				include: /node_modules\/node-cron/,
// 				use: {
// 					loader: 'babel-loader',
// 					options: {
// 						presets: [['@babel/preset-env', { targets: { node: 'nodenext' } }]],
// 					}
// 				}
// 			},
// 		],
// 	},
// 	externals: [
// 		/^node_modules\/.+$/,
// 		nodeExternals(),
// 		{
// 			'mongodb': {
// 				commonjs: 'mongodb',
// 				commonjs2: 'mongodb',
// 				amd: 'mongodb',
// 				root: 'mongodb',
// 			},
// 			'@apollo/server': {
// 				commonjs: '@apollo/server',
// 				commonjs2: '@apollo/server',
// 				amd: '@apollo/server',
// 				root: '@apollo/server',
// 			},
// 			graphql: {
// 				commonjs: 'graphql',
// 				commonjs2: 'graphql',
// 				amd: 'graphql',
// 				root: 'graphql',
// 			},
// 			'express': {
// 				commonjs: 'express',
// 				commonjs2: 'express',
// 				amd: 'express',
// 				root: 'express',
// 			},
// 			'express-serve-static-core': {
// 				commonjs: 'express-serve-static-core',
// 				commonjs2: 'express-serve-static-core',
// 				amd: 'express-serve-static-core',
// 				root: 'express-serve-static-core',
// 			},
// 			// Prevent bundling node_modules
// 			buffer: 'buffer',
// 			fs: 'fs',
// 			path: 'path',
// 			os: 'os',
// 			http: 'http',
// 			https: 'https',
// 			net: 'net',
// 			dns: 'dns',
// 			"events": 'false'
// 		}
// 	],
// 	optimization: {
// 		providedExports: true,
// 		usedExports: false,
// 		"sideEffects": false,
// 		// "mangleExports": "size",
// 	},
// 	recordsPath: path.join(__dirname, 'records.json'),
// 	resolve: {
// 		extensions: ['.ts', '.tsx', '.js'],
// 		extensionAlias: {
// 			'.js': ['.ts', '.js'],
// 			'.mjs': ['.mts', '.mjs'],
// 			'.cjs': ['.cts', '.cjs'],
// 		},
// 		plugins: [new TsconfigPathsPlugin()],
// 		alias: {
// 			'@gcCron': path.resolve(__dirname, 'src/gc/gcCron.browser.ts'),
// 			'@measureQuery': path.resolve(__dirname, 'src/instrumentation/measureQuery.browser.ts'),
// 			'ajv': path.resolve(__dirname, '../../node_modules/ajv/dist/ajv.bundle.js')
// 		},
// 		fallback: {
// 			buffer: false,
// 			console: false,
// 			'node:crypto': false,
// 			crypto: false,
// 			child_process: false,
// 			fs: false,
// 			os: false,
// 			path: false,
// 			util: false,
// 			"assert": false,
// 			"stream": false,
// 			"vm": false,
// 			"http": false,
// 			"url": false,
// 			"tls": false,
// 			"zlib": false,
// 			"string_decoder": false,
// 			"async_hooks": false,
// 			"node:async_hooks": false,
// 			"perf_hooks": false,
// 			"node:perf_hooks": false,
// 			"URI": false,
// 			"constants": false,
// 			"timers": false,
// 			"tty": false,
// 		},

// 	},
// 	plugins: [
// 		new webpack.ProvidePlugin({
// 			Buffer: ['buffer', 'Buffer'],
// 		}),
// 		new webpack.DefinePlugin({
// 			'process.env.NODE_ENV': JSON.stringify('production'),
// 			'process.env.BROWSER': JSON.stringify(true),
// 		}),
// 		new webpack.IgnorePlugin({
// 			resourceRegExp: /^node:async_hooks$/,
// 		}),
// 		new webpack.IgnorePlugin({
// 			resourceRegExp: /node-cron/, // avoid bundling node-cron for browser
// 			contextRegExp: /node_modules/,
// 		}),
// 		new webpack.IgnorePlugin({
// 			resourceRegExp: /^redis(|\/.*)$/, // avoid bundling redis for browser
// 			contextRegExp: /node_modules/,
// 			// NOTE: node-cron has a dynamic require for 'redis' which causes webpack to try bundling it.
// 			// This plugin ignores any require/import for 'redis' in node-cron and its submodules.
// 			// The `contextRegExp` ensures we only ignore 'redis' when it's required from node_modules,
// 			// preventing accidental ignoring of any local 'redis' imports in our source code if they exist.
// 		}),
// 		new webpack.IgnorePlugin({
// 			resourceRegExp: /^node:perf_hooks$/,
// 			contextRegExp: /node_modules/,
// 		}),
// 		new webpack.IgnorePlugin({ resourceRegExp: /^redis(|\/.*)$/ }),
// 		new webpack.IgnorePlugin({
// 			resourceRegExp: /^fs$/,
// 			contextRegExp: /node_modules/,
// 		}),
// 		new webpack.IgnorePlugin({
// 			resourceRegExp: /^child_process$/,
// 			contextRegExp: /node_modules/,
// 		}),
// 		new webpack.IgnorePlugin({
// 			resourceRegExp: /^node:crypto$/,
// 			contextRegExp: /node_modules/,
// 		}),
// 	],
// 	devtool: 'source-map', // Generate source maps for debugging
// 	stats: {
// 		errorDetails: true
// 	},
// 	// context: __dirname,
// };
