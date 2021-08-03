import rootDir from 'app-root-path'
import glob from 'glob'
import HTMLWebpackPlugin from 'html-webpack-plugin'

interface GetTemplatesOption {
  engine: 'pug' | 'ejs' | 'nunjucks' | 'none'
  minify: boolean
}

type TemplateExtension = 'pug' | 'ejs' | 'njk' | 'html'

export default class GetTemplates {
  private ext: TemplateExtension
  public HTMLWebpackPluginList: HTMLWebpackPlugin[]
  constructor(private option: GetTemplatesOption) {
    switch (this.option.engine) {
      case 'nunjucks':
        this.ext = 'njk'
        break
      case 'none':
        this.ext = 'html'
        break
      default:
        this.ext = this.option.engine
        break
    }
    const fileNames = this.getFileNames()
    this.HTMLWebpackPluginList = fileNames.map(this.toPluginList, this)
    console.log('\x1b[1;35mGenerated HTMLWebpackPluginList.\x1b[0m')
  }
  private getFileNames(this: GetTemplates): string[] {
    const fileNames = glob.sync(`**/*.${this.ext}`, {
      ignore: `**/_*.${this.ext}`,
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
    const regexp = new RegExp(`\.${this.ext}$`)
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
