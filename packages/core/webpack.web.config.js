/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
	mode: 'production',
	entry: './browser.ts',
	target: 'web',
	output: {
		filename: 'abimongo-core.browser.js',
		path: path.resolve(__dirname, 'dist'),
		library: {
			type: 'umd', // Universal Module Definition for compatibility with CommonJS, AMD, and browser globals
			umdNamedDefine: true, // Use named UMD definition
			name: 'AbimongoCore' // global name if script loaded in <script> tag
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
			'@abimongo/logger': {
				'commonjs': '@abimongo/logger',
				'commonjs2': '@abimongo/logger',
				'amd': '@abimongo/logger',
				'root': '@abimongo/logger',
			},
			'@apollo/server': {
				commonjs: '@apollo/server',
				commonjs2: '@apollo/server',
				amd: '@apollo/server',
				root: '@apollo/server',
			},
			'dotenv': {
				commonjs: 'dotenv',
				commonjs2: 'dotenv',
				amd: 'dotenv',
				root: 'dotenv'
			},
			chalk: 'chalk',
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
			buffer: 'commonjs buffer',
			fs: 'commonjs fs',
			path: 'commonjs path',
			os: 'commonjs os',
			http: 'commonjs http',
			https: 'commonjs https',
			net: 'commonjs net',
			dns: 'commonjs dns',
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
			'@gcCron': path.resolve(__dirname, 'src/gc/gcCron.browser.ts')
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
