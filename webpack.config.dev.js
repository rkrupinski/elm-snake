const path = require('path');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');

module.exports = webpackMerge(
  require('./webpack.config.shared'),
  {
    plugins: [
      new DashboardPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src', 'index.ejs'),
        title: 'elm-snake',
      }),
    ],
    performance: {
      hints: false,
    },
    devtool: 'cheap-module-eval-source-map',
  }
);
