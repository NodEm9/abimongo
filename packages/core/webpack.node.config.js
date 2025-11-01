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
		filename: 'abimongo-core.js',
		path: path.resolve(__dirname, 'dist'),
		library: {
			name: 'abimongo-core',
			type: 'umd',
			// umdNamedDefine: true, // Use named UMD definition
		},
		globalObject: 'this',
		clean: true
	},
	externals: [
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
			'dotenv': {
				commonjs: 'dotenv',
				commonjs2: 'dotenv',
				amd: 'dotenv',
				root: 'dotenv'
			},
			graphql: {
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
			type: 'commonjs'
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
				use: {
					loader: 'ts-loader',
					options: {
						// When resolving local package source via webpack aliases we may
						// include TS files from sibling packages (e.g. ../logger/src).
						// Override rootDir so TypeScript accepts those files as part of the
						// program during webpack builds.
						compilerOptions: {
							rootDir: path.resolve(__dirname, '..')
						},
						// Only transpile here to avoid the TS project-file-list errors
						// that occur when sibling-package sources are pulled into the
						// compilation by webpack aliases. Type-checking can be run
						// separately (e.g. via `pnpm -w -r tsc -b`) in CI if desired.
						transpileOnly: true,
						onlyCompileBundledFiles: true,
					}
				},
				exclude: [
					/^node_modules/,
					/^examples\//i,
				],
			},
		]
	},
	resolve: {
		alias: {
			'@gcCron': path.resolve(__dirname, 'src/gc/gcCron.node.ts'),
			// NOTE: intentionally not aliasing @abimongo/logger to the local
			// source here. Building logger first (workspace-aware build order)
			// produces its `dist` artifacts and avoids pulling sibling package
			// TS sources into this compilation which causes ts-loader/tsc
			// project-listing issues. If you prefer source-first local
			// development, set an env var and adjust this alias in dev only.
		},
		// alias: {
		//  	'node:crypto': 'crypto-browserify',
		//  	'node:stream': 'stream-browserify',
		//  	'node:buffer': 'buffer',
		//  	'node:path': 'path-browserify',
		//  	'node:util': 'util',
		//  	'node:fs': false, // if your lib doesn't need fs at runtime
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
			// util: require.resolve('util/'),
			"async_hooks": false,
			// "child_process": false,
			"fs": false,
		},
		plugins: [new TsconfigPathsPlugin()]
	},
	// Build-time plugins. Allow disabling ESLint plugin via DISABLE_ESLINT_PLUGIN
	// env var to avoid dependency resolution issues in CI/local where devDeps
	// may not be installed for every package.
	plugins: (() => {
		const p = [
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify('production'),
				'process.env.BROWSER': JSON.stringify(false),
				'process.env.TS_NODE': JSON.stringify(VERSION),
			})
		];
		if (process.env.ENABLE_ESLINT_PLUGIN) {
			p.push(new ESLintPlugin({
				extensions: ['ts'],
				exclude: ['dist', 'build', 'node_modules']
			}));
		}
		return p;
	})(),
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
