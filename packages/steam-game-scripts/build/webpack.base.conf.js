'use strict';
const utils = require('./utils');
const config = require('../config');
const vueLoaderConfig = require('./vue-loader.conf');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: require.resolve('eslint-loader'),
  enforce: 'pre',
  include: [utils.resolveApp('src'), utils.resolveApp('test')],
  options: {
    formatter: require.resolve('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
});

module.exports = {
  profile: true, // for profile
  entry: {
    app: [require.resolve('@babel/polyfill'), utils.resolveApp('src/main.js')]
  },
  output: {
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': utils.resolveApp('src'),
      Root: utils.resolveApp('../')
    }
  },
  module: {
    rules: [
      // ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: require.resolve('vue-loader'),
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: require.resolve('babel-loader'),
        include: [utils.resolveApp('src'), utils.resolveApp('test')],
        options: {
          babelrc: false,
          configFile: false,
          presets: [
            [
              require.resolve('@babel/preset-env'),
              {
                modules: false,
                targets: {
                  browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']
                }
              }
            ]
          ],
          plugins: [
            [
              require.resolve('@babel/plugin-transform-runtime'),
              {
                corejs: false,
                helpers: true,
                regenerator: true,
                useESModules: false
              }
            ],
            [
              require.resolve('@babel/plugin-proposal-class-properties'),
              { loose: false }
            ],
            [
              require.resolve('@babel/plugin-proposal-decorators'),
              { legacy: true }
            ],
            require.resolve('@babel/plugin-proposal-export-namespace-from'),
            require.resolve('@babel/plugin-proposal-function-sent'),
            require.resolve('@babel/plugin-proposal-json-strings'),
            require.resolve('@babel/plugin-proposal-numeric-separator'),
            require.resolve('@babel/plugin-proposal-throw-expressions'),
            require.resolve('@babel/plugin-syntax-dynamic-import'),
            require.resolve('@babel/plugin-syntax-import-meta'),
            require.resolve('@babel/plugin-syntax-jsx'),
            require.resolve('@vue/babel-plugin-transform-vue-jsx')
          ],
          // This is a feature of `babel-loader` for webpack (not Babel itself).
          // It enables caching results in ./node_modules/.cache/babel-loader/
          // directory for faster rebuilds.
          cacheDirectory: true,
          // Don't waste time on Gzipping the cache
          cacheCompression: false
        }
      },
      {
        test: /\.css$/,
        include: [utils.resolveApp('src')],
        loader: [
          require.resolve('css-loader'),
          require.resolve('vue-style-loader')
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({ options: {} }),
    new VueLoaderPlugin()
  ],
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
};
