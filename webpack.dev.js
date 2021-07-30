const { merge } = require('webpack-merge')

const commonConf = require('./webpack.common')
const templates = require('./config/webpack/utils/getTemplates')
const fileName = {
  output: '[name]',
  asset: '[name]',
}

module.exports = () =>
  merge(commonConf(fileName, templates), {
    mode: 'development',
    devtool: 'source-map',
    plugins: [...templates],
    devServer: {
      contentBase: 'dist',
      open: true,
      watchContentBase: true,
    },
    target: 'web',
    watchOptions: {
      ignored: /node_modules/,
    },
  })
