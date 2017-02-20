const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.jsx'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'snake.[hash:6].js',
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
  ],
};
