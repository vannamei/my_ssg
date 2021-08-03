import path from 'path'
import webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin'

import GetTemplates from './config/webpack/utils/getTemplates'

const MODE = process.env['NODE_ENV']
const isProd = MODE === 'production'
const fileName = {
  output: isProd ? '[name].[chunkhash]' : '[name]',
  asset: isProd ? '[contenthash]' : '[name]',
}

const templates = new GetTemplates({
  engine: 'pug',
  minify: isProd,
})

console.log(`\x1b[1;33mWebpack running in ${MODE} mode...\x1b[0m`)

const rules = [
  {
    test: /\.[jt]sx?$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'ts-loader',
      },
    ],
  },
  {
    test: /\.(s[ac]ss|css)$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
      },
      {
        loader: 'css-loader',
        options: {
          url: false,
          importLoaders: 2,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: [['autoprefixer', { grid: true }]],
          },
        },
      },
      {
        loader: 'sass-loader',
      },
    ],
  },
  {
    test: /\.(ico|svg|jpe?g|png|webp)$/,
    type: 'asset/resource',
    generator: {
      filename: `assets/img/${fileName.asset}[ext]`,
    },
    use: [
      {
        loader: 'image-webpack-loader',
        options: {
          mozjpeg: {
            progressive: true,
            quality: 65,
          },
        },
      },
    ],
  },
  {
    test: /\.pug$/,
    use: [
      {
        loader: 'html-loader',
      },
      {
        loader: 'pug-html-loader',
        options: {
          pretty: true,
        },
      },
    ],
  },
]

const module = {
  rules: rules,
}

// @ts-ignore(MiniCssExtractPlugin -> "error TS2321: Excessive stack depth comparing types")
const plugins = [
  ...templates.HTMLWebpackPluginList,
  new MiniCssExtractPlugin({
    filename: `assets/css/${fileName.output}.css`,
  }),
  new webpack.ProvidePlugin({
    jQuery: 'jquery',
    $: 'jquery',
    React: 'react',
    ReactDOM: 'react-dom',
    Vue: ['vue/dist/vue.esm.js', 'default'],
  }),
  new webpack.ProgressPlugin(),
  new CopyWebpackPlugin({
    patterns: [
      {
        context: 'src/static',
        from: '**',
        to: path.resolve(__dirname, 'dist'),
      },
    ],
  }),
  new CleanWebpackPlugin({
    cleanStaleWebpackAssets: false,
  }),
]

const optimization = {
  minimize: isProd,
  minimizer: isProd ? [new TerserPlugin({}), new OptimizeCssAssetsPlugin({})] : [],
  splitChunks: {
    chunks: 'all',
    minSize: 0,
    cacheGroups: {
      vendors: {
        name: 'vendors',
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
      },
      default: false,
    },
  },
}

const config = {
  mode: MODE,
  devtool: isProd ? undefined : 'source-map',
  entry: './src/scripts/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `assets/js/${fileName.output}.js`,
  },
  module: module,
  resolve: {
    alias: {
      '@scss': path.resolve(__dirname, 'src/scss'),
      '@img': path.resolve(__dirname, 'src/img'),
    },
    extensions: ['.ts', '.js', '.tsx', '.jsx', '.vue', '.json', '.scss', '.sass', '.css'],
  },
  plugins: plugins,
  optimization: optimization,
  target: isProd ? ['web', 'es5'] : 'web',
  devServer: {
    contentBase: 'dist',
    open: true,
    watchContentBase: true,
  },
  watchOptions: {
    ignored: /node_modules/,
  },
}

export default config
