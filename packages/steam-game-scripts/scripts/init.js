#!/usr/bin/env node
'use strict';

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const os = require('os');

const defaultBrowsers = ['> 1%', 'last 10 versions', 'not ie <= 8'];

module.exports = function init(appPath, appName) {
  const appPackage = require(path.join(appPath, 'package.json'));
  const useYarn = fs.existsSync(path.join(appPath, 'yarn.lock'));
  // Copy over some of the devDependencies
  appPackage.dependencies = appPackage.dependencies || {};
  appPackage.devDependencies = appPackage.devDependencies || {};
  // Setup the script rules
  appPackage.scripts = {
    start: 'steam-game-scripts start',
    build: 'steam-game-scripts build',
    test: 'steam-game-scripts test'
  };
  appPackage.browserslist = defaultBrowsers;

  fs.writeFileSync(
    path.join(appPath, 'package.json'),
    JSON.stringify(appPackage, null, 2) + os.EOL
  );

  const readmeExists = fs.existsSync(path.join(appPath, 'README.md'));
  if (readmeExists) {
    fs.renameSync(
      path.join(appPath, 'README.md'),
      path.join(appPath, 'README.old.md')
    );
  }

  const templatePath = path.join(__dirname, '../template');
  if (fs.existsSync(templatePath)) {
    fs.copySync(templatePath, appPath);
  } else {
    console.error(
      `Could not locate supplied template: ${chalk.green(templatePath)}`
    );
    return;
  }

  const displayedCommand = useYarn ? 'yarn' : 'npm';

  console.log();
  console.log(`Success! Created ${appName} at ${appPath}`);
  console.log('Inside that directory, you can run several commands:');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} start`));
  console.log('    Starts the development server.');
  console.log();
  console.log(
    chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}build`)
  );
  console.log('    Bundles the app into static files for production.');
  console.log();
  console.log(
    `${chalk.cyan('  Please goto config to update')}${chalk.red(
      ' GAME_NAME'
    )} & ${chalk.red(' GAME_ID')} & ${chalk.red(' IS_GAME_HAS_EN_VERSION')}`
  );
};
