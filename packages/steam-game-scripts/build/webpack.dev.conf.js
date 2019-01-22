'use strict';
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = gameName =>
  merge(baseWebpackConfig, {
    mode: 'development',
    watch: true,
    output: {
      publicPath: `/game/`
    },
    module: {
      rules: utils.styleLoaders({
        sourceMap: config.dev.cssSourceMap,
        usePostCSS: true
      })
    },
    // cheap-module-eval-source-map is faster for development
    devtool: config.dev.devtool,
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      // https://github.com/ampedandwired/html-webpack-plugin
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: utils.resolveApp('index.html'),
        inject: true
      }),
      new CopyWebpackPlugin([
        {
          from: utils.resolveApp('static'),
          to: config.dev.assetsSubDirectory,
          ignore: ['.*']
        }
      ])
    ],
    devServer: {
      hot: true
    }
  });
