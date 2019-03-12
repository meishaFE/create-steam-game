'use strict';
const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const webpackConfig = gameName => {
  if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin');
  }
  if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
      .BundleAnalyzerPlugin;
  }

  return merge(baseWebpackConfig, {
    mode: 'production',
    performance: {
      hints: false
    },
    optimization: {
      runtimeChunk: {
        name: 'manifest'
      },
      minimizer: [
        new TerserPlugin({
          extractComments: true,
          cache: true,
          sourceMap: config.build.productionSourceMap, // set to true if you want JS source maps,
          parallel: true,
          terserOptions: {
            ecma: 6
          }
        }),
        new OptimizeCSSPlugin({
          cssProcessorOptions: config.build.productionSourceMap
            ? { safe: true, map: { inline: false } }
            : { safe: true }
        })
      ],
      splitChunks: {
        chunks: 'async',
        minSize: 30000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        name: false,
        cacheGroups: {
          vendor: {
            name: 'vendor',
            chunks: 'initial',
            priority: -10,
            reuseExistingChunk: false,
            test: /node_modules\/(.*)\.js/
          },
          styles: {
            name: 'styles',
            test: /\.(scss|css)$/,
            chunks: 'all',
            minChunks: 1,
            reuseExistingChunk: true,
            enforce: true
          }
        }
      }
    },
    module: {
      rules: utils.styleLoaders({
        sourceMap: config.build.productionSourceMap,
        extract: true,
        usePostCSS: true
      })
    },
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
    output: {
      path: utils.resolveApp(gameName),
      filename: utils.assetsPath('js/[name].[chunkhash].js'),
      chunkFilename: utils.assetsPath('js/[id].[chunkhash].js'),
      publicPath: `/game/${gameName}/`
    },
    plugins: [
      new MiniCssExtractPlugin({
        ainfilename: utils.assetsPath('css/[name].[contenthash].css'),
        chunkFilename: utils.assetsPath('css/app.[contenthash:12].css') // use contenthash *
      }),
      // generate dist index.html with correct asset hash for caching.
      // you can customize output by editing /index.html
      // see https://github.com/ampedandwired/html-webpack-plugin
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: utils.resolveApp('index.html'),
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
          // more options:
          // https://github.com/kangax/html-minifier#options-quick-reference
        },
        // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        chunksSortMode: 'dependency'
      }),

      // keep module.id stable when vendor modules does not change
      new webpack.HashedModuleIdsPlugin(),
      // enable scope hoisting
      new webpack.optimize.ModuleConcatenationPlugin(),
      config.build.productionGzip &&
        new CompressionWebpackPlugin({
          asset: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp(
            '\\.(' + config.build.productionGzipExtensions.join('|') + ')$'
          ),
          threshold: 10240,
          minRatio: 0.8
        }),
      config.build.bundleAnalyzerReport && new BundleAnalyzerPlugin()
    ]
  });
};

module.exports = webpackConfig;
