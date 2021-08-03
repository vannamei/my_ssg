import rootDir from 'app-root-path'
import glob from 'glob'
import HTMLWebpackPlugin from 'html-webpack-plugin'

interface GetTemplatesOp {
  engine: 'pug' | 'ejs' | 'njk'
  minify: boolean
}

export default class GetTemplates {
  public HTMLWebpackPluginList: HTMLWebpackPlugin[]
  constructor(private option: GetTemplatesOp) {
    const fileNames = this.getFileNames()
    this.HTMLWebpackPluginList = fileNames.map(this.toPluginList, this)
    console.log('\x1b[1;35mGenerated HTMLWebpackPluginList.\x1b[0m')
  }
  private getFileNames(this: GetTemplates): string[] {
    const fileNames = glob.sync(`**/*.${this.option.engine}`, {
      ignore: `**/_*.${this.option.engine}`,
      cwd: `${rootDir}/src/templates`,
    })
    if (!fileNames.length) {
      throw new Error('Cannot find template file.')
    } else {
      console.log(`\x1b[35mFound ${fileNames.length} template files.\x1b[0m`, fileNames)
      return fileNames
    }
  }
  private toPluginList(this: GetTemplates, fileName: string): HTMLWebpackPlugin {
    const regexp = new RegExp(`\.${this.option.engine}$`)
    const option: HTMLWebpackPlugin.Options = {
      template: `src/templates/${fileName}`,
      filename: fileName.replace(regexp, '.html'),
      inject: 'body',
    }
    if (this.option.minify) {
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
