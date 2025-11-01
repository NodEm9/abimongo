/* eslint-disable @typescript-eslint/no-require-imports */
// webpack.cli.js

const path = require('path');

module.exports = {
  mode: 'production',
  entry: './bin/abimongo_cli.ts',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'abimongo_cli.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    // In a monorepo workspace prefer the local source of @abimongo/core
    // during development only when DEV_USE_SOURCE=true. Pulling sibling
    // package source into this compilation can cause ts-loader/tsc
    // project-listing errors, so keep this opt-in.
    alias: (process.env.DEV_USE_SOURCE === 'true') ? {
      '@abimongo/core': path.resolve(__dirname, '../core/src')
    } : {},
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            // Always point ts-loader at this package tsconfig to avoid
            // implicit cross-package program composition.
            configFile: path.resolve(__dirname, 'tsconfig.json'),
            // Only transpile for bundling; run full type-check in a
            // separate root-level `typecheck` step (added to package.json).
            transpileOnly: true,
            onlyCompileBundledFiles: true,
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  externals: {
    'fsevents': 'commonjs fsevents',
    // Optional native modules pulled in by mongodb - keep as externals so
    // the CLI bundle doesn't try to resolve optional native deps at build
    // time. They are optional at runtime and should not fail the build.
    'kerberos': 'commonjs kerberos',
    '@mongodb-js/zstd': 'commonjs @mongodb-js/zstd',
    '@aws-sdk/credential-providers': 'commonjs @aws-sdk/credential-providers',
    'gcp-metadata': 'commonjs gcp-metadata',
    'snappy': 'commonjs snappy',
    'socks': 'commonjs socks',
    'aws4': 'commonjs aws4',
    'mongodb-client-encryption': 'commonjs mongodb-client-encryption'
  },
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.emit.tapAsync('AddShebangPlugin', (compilation, callback) => {
          const content = compilation.assets['abimongo_cli.js'].source();
          compilation.assets['abimongo_cli.js'] = {
            source: () => `#!/usr/bin/env node\n${content}`,
            size: () => content.length + '#!/usr/bin/env node\n'.length,
          };
          callback();
        });
      },
    },
  ],
};