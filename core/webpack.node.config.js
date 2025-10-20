const webpack = require('webpack');
const path = require('path');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const { VERSION } = require('ts-node');
const ESLintPlugin = require('eslint-webpack-plugin');
const nodeExternals = require('webpack-node-externals');


module.exports = {
	mode: 'production',
	entry: './index.ts',
	target: 'node',
	output: {
		filename: 'abimongo_core.node.js',
		path: path.resolve(__dirname, 'lib'),
		globalObject: 'this',
		library: {
			name: 'abimongo_core',
			type: 'umd',
			umdNamedDefine: true, // Use named UMD definition
		},
		clean: true
	},
	externals: [
	nodeExternals(),
		{
			mongodb: {
				commonjs: 'mongodb',
				commonjs2: 'mongodb',
				amd: 'mongodb',
				root: 'mongodb',
			},
			'@abimongo/abimongo-logger': {
				'commonjs': '@abimongo/abimongo-logger',
				'commonjs2': '@abimongo/abimongo-logger',
				'amd': '@abimongo/abimongo-logger',
				'root': '@abimongo/abimongo-logger',
			},
			chalk: 'chalk',
			graphql: {
				commonjs: 'graphql',
				commonjs2: 'graphql',
				amd: 'graphql',
				root: 'graphql',
			},
			"express": {
				commonjs: 'express',
				commonjs2: 'express',
				amd: 'express',
				root: 'express',
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
	recordsPath: path.join(__dirname, "records.json"),
	module: {
		rules: [
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
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: [
					/^node_modules/,
					/^examples\//i,
				],
			},
		]
	},
	resolve: {
		alias: {
			'@gcCron': path.resolve(__dirname, 'src/gc/gcCron.node.ts')
		},
		// alias: {
		// 	'node:crypto': 'crypto-browserify',
		// 	'node:stream': 'stream-browserify',
		// 	'node:buffer': 'buffer',
		// 	'node:path': 'path-browserify',
		// 	'node:util': 'util',
		// 	'node:fs': false, // if your lib doesn't need fs at runtime
		// },
		extensions: ['.ts', '.js'],
		byDependency: {
			esm: {
				mainFields: ['browser', 'module', 'main'],
			},
			commonjs2: {
				aliasFields: ['browser', 'module'],
			},
		},
		fallback: {
			buffer: require.resolve('buffer/'),
			console: require.resolve('console-browserify'),
			crypto: require.resolve("crypto-browserify"),
			path: require.resolve('path-browserify'),
			util: require.resolve('util/'),
			"async_hooks": false,
			// "child_process": false,
			"fs": false,
		},
		plugins: [new TsconfigPathsPlugin()]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production'),
			'process.env.BROWSER': JSON.stringify(false),
			'process.env.TS_NODE': JSON.stringify(VERSION),
		}),
		new ESLintPlugin({
			extensions: ['ts'],
			exclude: ['dist', 'build', 'node_modules']
		}),
	],
	performance: {
		hints: false, // Disable performance hints
		maxEntrypointSize: 512000, // Set max entry point size to 500KB
		maxAssetSize: 512000, // Set max asset size to 500KB
	},
	devtool: 'source-map', // Generate source maps for debugging
	stats: {
		errorDetails: true
	},
	// This helps suppress dynamic require warnings
	context: __dirname,
};
