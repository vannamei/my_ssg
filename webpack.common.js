// 共通設定(webpack.dev.js, webpack.prod.jsから読み込み)

const MODE = process.env.NODE_ENV
const isProd = MODE === 'production'
const { resolve } = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { ProvidePlugin } = require('webpack')

if (isProd) {
  console.log('production')
} else {
  console.log('development')
}

module.exports = ({ output, asset }) => ({
  entry: './src/scripts/main.ts',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: `assets/js/${output}.js`,
  },
  module: {
    rules: [
      // JS/JSX/TS/TSX
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            // TypeScript/JavaScriptをES5にトランスパイル
            loader: 'ts-loader',
          },
        ],
      },
      // SASSのコンパイル
      {
        test: /\.(s[ac]ss|css)$/,
        use: [
          // CSSをJSファイルから分離して出力
          {
            loader: MiniCssExtractPlugin.loader,
          },
          // CSSの読み込み
          {
            loader: 'css-loader',
            options: {
              url: false,
              importLoaders: 2,
            },
          },
          // PostCSSの設定
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['autoprefixer', { grid: true }]],
              },
            },
          },
          // SASSの読み込み
          {
            loader: 'sass-loader',
          },
        ],
      },
      // 画像
      {
        test: /\.(ico|svg|jpe?g|png|webp)$/,
        type: 'asset/resource',
        generator: {
          filename: `assets/img/${asset}[ext]`,
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
      // Pug
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
    ],
  },
  resolve: {
    // import時の拡張子記述を省略
    extensions: ['.ts', '.js', '.tsx', '.jsx', '.vue', '.json', '.scss', '.sass', '.css'],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `assets/css/${output}.css`,
    }),
    new ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      React: 'react',
      ReactDOM: 'react-dom',
      Vue: ['vue/dist/vue.esm.js', 'default'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          context: 'src/static',
          from: '**',
          to: resolve(__dirname, 'dist'),
        },
      ],
    }),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
  ],
  optimization: {
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
  },
})
