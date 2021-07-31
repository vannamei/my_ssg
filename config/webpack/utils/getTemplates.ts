import glob from 'glob'
import HTMLWebpackPlugin from 'html-webpack-plugin'

export default class GetTemplates {
  public pluginList: HTMLWebpackPlugin[]
  constructor(private isProd: boolean) {
    const fileNames = this.getFileNames()
    this.pluginList = fileNames.map(this.toPlugin, this)
  }
  private getFileNames(): string[] {
    const fileNames = glob.sync('**/*.pug', {
      ignore: '**/_*.pug',
    })
    if (!fileNames) {
      throw new Error('Cannot find template file.')
    } else {
      console.log(`Found ${fileNames.length} template files.`, fileNames)
      return fileNames
    }
  }
  private toPlugin(fileName: string) {
    const option: HTMLWebpackPlugin.Options = {
      template: fileName,
      filename: fileName.replace('src/templates/', '').replace(/\.pug$/, '.html'),
      inject: 'body',
    }
    if (this.isProd) {
      option.minify = {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      }
    }
    return new HTMLWebpackPlugin(option)
  }
}
