const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    main: path.resolve(__dirname, 'src', 'index.jsx'),
    vendor: [
      'regenerator-runtime/runtime',
      'react',
      'react-dom',
      'react-elm-components',
      'react-redux',
      'recompose',
      'redux',
      'redux-saga',
    ],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[chunkhash].[name].js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.elm'],
    modules: [
      path.join(__dirname, 'src'),
      path.join(__dirname, 'elm'),
      'node_modules',
    ],
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.elm/,
        exclude: /elm-stuff/,
        use: [
          {
            loader: 'elm-webpack-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['build']),
     new webpack.optimize.CommonsChunkPlugin({
      names: [
        'vendor',
        'manifest',
      ],
    }),
  ],
};
