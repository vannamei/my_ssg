const glob = require('glob')
const HTMLWebpackPlugin = require('html-webpack-plugin')

const getFileNames = () => {
  const fileNames = glob.sync('./src/templates/**/*.pug', {
    ignore: '**/_*.pug',
  })
  return fileNames
}
const toPlugin = (fileName) => {
  return new HTMLWebpackPlugin({
    template: fileName,
    filename: fileName.replace(/\.pug$/, '.html'),
    chunks: [fileName],
  })
}

const templates = getFileNames().map(toPlugin)
console.log(getFileNames())
console.log(templates)

module.exports = templates
