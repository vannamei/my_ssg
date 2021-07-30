const glob = require('glob')
const HTMLWebpackPlugin = require('html-webpack-plugin')

const getFileNames = () => {
  const fileNames = glob.sync('**/*.pug', {
    ignore: '**/_*.pug',
  })
  if (!fileNames) {
    throw new Error('Cannot find template file.')
  } else {
    console.log(`Found ${fileNames.length} template files.`)
    fileNames.map((fileName) => {
      console.log(`${fileName}`)
    })
    return fileNames
  }
}
const toPlugin = (fileName) => {
  return new HTMLWebpackPlugin({
    template: fileName,
    filename: fileName.replace('src/templates/', '').replace(/\.pug$/, '.html'),
  })
}

const templates = getFileNames().map(toPlugin)

module.exports = templates
