// import webpack from 'webpack';
const webpack = require('webpack');
const path = require('path');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
	mode: 'production',
	target: 'node',
	entry: './bin/abimongo-scaffold.ts',
	output: {
		path: path.resolve(__dirname, 'lib'),
		filename: 'abimongo_core-cli.js',
	},
	devtool: 'source-map', // Generate source maps for debugging
	externals: [
		nodeExternals(),
		{
			// Exclude node_modules from the bundle
			// This is important for CLI tools to avoid bundling unnecessary dependencies

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
			}
			// 'logger': {
			// 	'commonjs': 'logger',
			// 	'commonjs2': 'logger',
			// 	'amd': 'logger',
			// 	'root': 'logger',
			// },
		}],
	resolve: {
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
			// Provide fallbacks for Node.js core modules
			fs: false,
			kerberos: false,
			"@mongodb-js/zstd": false,
			'@aws-sdk/credential-providers': false,
			'@aws-sdk/signature-v4-crt': false,
			'gcp-metadata': false,
			'snappy': false,
			'socks': false,
			'aws4': false,
			'mongodb-client-encryption': false,
		},
		plugins: [
			new TsconfigPathsPlugin({
				configFile: path.resolve(__dirname, 'tsconfig.json'),
			}),
		],
	},
	module: {
		rules: [
			{ test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ },
		],
	},
	stats: {
		errorDetails: true
	},
	plugins: [
		// Adds the shebang line for Node.js CLI
		new webpack.BannerPlugin({
			banner: '#!/usr/bin/env node',
			raw: true,
		}),
	],
	node: {
		__dirname: false,
		__filename: false,
	},
};
