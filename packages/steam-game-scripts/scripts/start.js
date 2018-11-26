'use strict';
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const configFactory = require('../build/webpack.dev.conf.js');
const createDevServerConfig = require('../build/webpackDevServer.config.js');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const portfinder = require('portfinder');
const config = require('../config');
const utils = require('../build/utils');
const HOST = process.env.HOST || '0.0.0.0';
const pkg = require(utils.resolveApp('package.json'));
const gameName = pkg.name;
const webpackConfig = configFactory(gameName);

portfinder.basePort = process.env.PORT || config.dev.port;
portfinder.getPort((err, port) => {
  if (err) {
  } else {
    webpackConfig.plugins.push(
      new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [
            `Your application is running here: http://${
              config.dev.host
            }:${port}/game/${gameName}/`
          ]
        },
        onErrors: config.dev.notifyOnErrors
          ? utils.createNotifierCallback()
          : undefined
      })
    );

    webpackConfig.entry.app.unshift(
      `webpack-dev-server/client?http://${HOST}:${port}/`,
      'webpack/hot/dev-server'
    );

    const compiler = webpack(webpackConfig);
    const devServerConfig = createDevServerConfig(port, gameName);
    const devServer = new WebpackDevServer(compiler, devServerConfig);

    devServer.listen(port, HOST, err => {
      if (err) {
        return console.log(err);
      }
    });

    ['SIGINT', 'SIGTERM'].forEach(function(sig) {
      process.on(sig, function() {
        devServer.close();
        process.exit();
      });
    });
  }
});
