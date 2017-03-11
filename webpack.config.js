const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/network-monitor.js',
  target: 'node',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
        },
      },
      {
        test: /network-monitor\.html/,
        loader: 'file-loader',
        query: {
          name: '[name].[ext]',
        },
      },
      {
        test: /network-monitor\.json/,
        loader: 'file-loader',
        query: {
          name: '[path][name].[ext]',
        },
      },
    ],
  },
  output: {
    path: './dist',
    filename: 'network-monitor.js',
    libraryTarget: 'umd',
  },
  externals: [nodeExternals()],
};
