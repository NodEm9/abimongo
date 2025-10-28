/* eslint-disable @typescript-eslint/no-require-imports */
// webpack.cli.js

const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'abimongo-create.js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [{ test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ }]
  },
  externals: {
    'fsevents': 'commonjs fsevents'
  },
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.emit.tapAsync('AddShebangPlugin', (compilation, callback) => {
          const content = compilation.assets['abimongo-create.js'];
          compilation.assets['abimongo-create.js'] = {
            source: () => `#!/usr/bin/env node\n${content}`,
            size: () => content.source().length + '#!/usr/bin/env node\n'.length,
          };
          callback();
        });
      },
    },
  ],
};
