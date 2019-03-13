'use strict';
require('../build/check-versions')();

process.env.NODE_ENV = 'production';

const ora = require('ora');
const rm = require('rimraf');
const chalk = require('chalk');
const webpack = require('webpack');
const webpackConfigFa = require('../build/webpack.prod.conf');
const utils = require('../build/utils');
const pkg = require(utils.resolveApp('package.json'));
const gameName = pkg.name;
const webpackConfig = webpackConfigFa(gameName);

const spinner = ora('building for production...');
spinner.start();

rm(utils.resolveApp(gameName), err => {
  if (err) {
    throw err;
  }
  utils.copyStaticFiles(utils.resolveApp(gameName));
  webpack(webpackConfig, function(err, stats) {
    spinner.stop();
    if (err) {
      throw err;
    }
    process.stdout.write(
      stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }) + '\n\n'
    );

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'));
      process.exit(1);
    }

    console.log(chalk.cyan('  Build complete.\n'));
    console.log(
      chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
          "  Opening index.html over file:// won't work.\n"
      )
    );
  });
});
