import glob from 'glob'
import HTMLWebpackPlugin from 'html-webpack-plugin'

class GetTemplates {
  public HTMLWebpackPluginList: HTMLWebpackPlugin[]
  constructor(private isProd: boolean) {
    const fileNames = this.getFileNames()
    this.HTMLWebpackPluginList = fileNames.map(this.toPluginList, this)
  }
  private getFileNames(): string[] {
    const fileNames = glob.sync('**/*.pug', {
      ignore: '**/_*.pug',
    })
    if (!fileNames) {
      throw new Error('Cannot find template file.')
    } else {
      console.log(`\x1b[35mFound ${fileNames.length} template files.\x1b[0m`, fileNames)
      return fileNames
    }
  }
  private toPluginList(this: GetTemplates, fileName: string): HTMLWebpackPlugin {
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

export default GetTemplates
