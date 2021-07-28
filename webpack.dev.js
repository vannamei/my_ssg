const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');

const commonConf = require('./webpack.common');
const fileName = {
  output: '[name]',
  asset: '[name]',
};

module.exports = () =>
  merge(commonConf(fileName), {
    mode: 'development',
    devtool: 'source-map',
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/pages/index.html',
      }),
    ],
    devServer: {
      contentBase: 'dist',
      open: true,
      watchContentBase: true,
    },
    target: 'web',
    watchOptions: {
      ignored: /node_modules/,
    },
  });
