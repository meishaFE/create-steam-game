'use strict';

const chalk = require('chalk');
const error = console.error;
module.exports.nodeMajorVersionCheck = function nodeMajorVersionCheck(
  majorLimit
) {
  const currentNodeVersion = process.versions.node;
  const major = currentNodeVersion.split('.')[0];
  if (major < majorLimit) {
    error(
      chalk.red(
        'You are running Node ' +
          currentNodeVersion +
          '.\n' +
          'Create Steam Game requires Node 9 or higher. \n' +
          'Please update your version of Node.'
      )
    );
    process.exit(1);
  }
};
