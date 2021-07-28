const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { merge } = require('webpack-merge');

const commonConf = require('./webpack.common');
const fileName = {
  output: '[name].[chunkhash]',
  asset: '[contenthash]',
};

module.exports = () =>
  merge(commonConf(fileName), {
    mode: 'production',
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/pages/index.html',
        inject: 'body',
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
        },
      }),
    ],
    target: ['web', 'es5'],
    optimization: {
      minimizer: [new TerserPlugin({}), new OptimizeCssAssetsPlugin({})],
    },
  });
