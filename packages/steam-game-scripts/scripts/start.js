'use strict';
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const webpackConfig = require('../build/webpack.dev.conf.js');
const createDevServerConfig = require('../build/webpackDevServer.config.js');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const portfinder = require('portfinder');
const config = require('../config');
const utils = require('../build/utils');
const HOST = process.env.HOST || '0.0.0.0';

portfinder.basePort = process.env.PORT || config.dev.port;
portfinder.getPort((err, port) => {
  if (err) {
  } else {
    const devServerConfig = createDevServerConfig(port);
    webpackConfig.plugins.push(
      new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [
            `Your application is running here: http://${
              config.dev.host
            }:${port}`,
          ],
        },
        onErrors: config.dev.notifyOnErrors
          ? utils.createNotifierCallback()
          : undefined,
      })
    );

    var compiler = webpack(webpackConfig);
    var devServer = new WebpackDevServer(compiler, devServerConfig);

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
