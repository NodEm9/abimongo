// import webpack from 'webpack';
const webpack = require('webpack');
const path = require('path');
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
module.exports = {
	mode: 'production',
	target: 'node',
	entry: './bin/abimongo-core-cli.ts',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'abimongo-core-cli.js',
	},
	devtool: 'source-map', // Generate source maps for debugging
	externalsType: 'umd',
	externals: [
		nodeExternals(),
		{
			// Exclude node_modules from the bundle
			// This is important for CLI tools to avoid bundling unnecessary dependencies

			'mongodb': {
				umd: 'mongodb',
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
				umd: '@apollo/server',
				commonjs: '@apollo/server',
				commonjs2: '@apollo/server',
				amd: '@apollo/server',
				root: '@apollo/server',
			},
			'dotenv': {
				umd: 'dotenv',
				commonjs: 'dotenv',
				commonjs2: 'dotenv',
				amd: 'dotenv',
				root: 'dotenv'
			},
			// chalk: 'chalk',
			graphql: {
				umd: 'graphql',
				commonjs: 'graphql',
				commonjs2: 'graphql',
				amd: 'graphql',
				root: 'graphql',
			},
			'express': {
				und: 'express',
				commonjs: 'express',
				commonjs2: 'express',
				amd: 'express',
				root: 'express',
			},
		}
	],
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
		// fallback: {
		// 	// Provide fallbacks for Node.js core modules
		// 	fs: false,
		// 	kerberos: false,
		// 	"@mongodb-js/zstd": false,
		// 	'@aws-sdk/credential-providers': false,
		// 	'@aws-sdk/signature-v4-crt': false,
		// 	'gcp-metadata': false,
		// 	'snappy': false,
		// 	'socks': false,
		// 	'aws4': false,
		// 	'mongodb-client-encryption': false,
		// },
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