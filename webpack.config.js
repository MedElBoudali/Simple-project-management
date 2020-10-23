const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/App.ts',
  output: { filename: 'bundle.js', path: path.resolve(__dirname, 'dist') },
  module: {
    rules: [
      { test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  devtool: 'inline-source-map'
};
