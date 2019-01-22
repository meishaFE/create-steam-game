const host = process.env.HOST || '0.0.0.0';
const config = require('../config');

module.exports = (port, gameName) => ({
  clientLogLevel: 'warning',
  hot: true,
  contentBase: false, // since we use CopyWebpackPlugin.
  host,
  port,
  open: config.dev.autoOpenBrowser,
  overlay: false,
  publicPath: `/game/`,
  proxy: config.dev.proxyTable,
  quiet: true,
  // inline: true,
  historyApiFallback: {
    rewrites: [
      {
        from: new RegExp(`^\\/game\\/${gameName}/`),
        to: `/game/index.html`
      }
    ]
  },
  watchOptions: {
    poll: false
  }
});
