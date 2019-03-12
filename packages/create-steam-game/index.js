#!/usr/bin/env node
/*
 * Copyright (c) Wed Oct 10 2018-present, Jayden, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

// if Node.js version lower v9.0.0, exit process
nodeMajorVersionCheck(9);

const packageJson = require('./package.json');
const commander = require('commander');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const envinfo = require('envinfo');
const chalk = require('chalk');
const validateProjectName = require('validate-npm-package-name');
const execSync = require('child_process').execSync;
const spawn = require('cross-spawn');
const url = require('url');
const dns = require('dns');

let projectName;

const program = new commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .action(name => {
    projectName = name;
  })
  .option('--info', 'print environment debug info')
  .option(
    '--packages <alternative-install-package>',
    'Other packages you want to install, like echarts, d3'
  )
  .allowUnknownOption()
  .parse(process.argv);
// TODO add help console

if (program.info) {
  console.log(chalk.bold('\nEnvironment Info:'));

  return envinfo
    .run(
      {
        System: ['OS', 'CPU'],
        Binaries: ['Node', 'npm', 'Yarn'],
        Browsers: ['Chrome', 'Edge', 'Internet Explorer', 'Firefox', 'Safari'],
        npmPackages: ['steam-game-scripts'],
        npmGlobalPackages: ['create-steam-game']
      },
      {
        clipboard: true,
        duplicates: true,
        showNotFound: true
      }
    )
    .then(console.log)
    .then(() => console.log(chalk.green('Copied To Clipboard!\n')));
}

if (typeof projectName === 'undefined') {
  console.error('Please specify the project directory:');
  console.log(
    `  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`
  );
  console.log();
  console.log('For example:');
  console.log(`  ${chalk.cyan(program.name())} ${chalk.green('steam-game')}`);
  console.log();
  console.log(
    `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
  );
  process.exit(1);
}

createSteamGame(projectName, program.packages);
function createSteamGame(name, packages) {
  /**
   1. 检查文件夹名是否规范
 */
  const rootPath = path.resolve(name);
  const gameName = path.basename(rootPath);
  packages = getPackageToInstall(packages);
  checkGameName(gameName);

  /**
   2. 判断文件夹是否存在并创建
  */
  fs.ensureDirSync(rootPath);

  /**
   3. 非空文件夹则退出
 */
  if (!emptyDirectory(rootPath)) {
    console.log(`The directory ${chalk.green(gameName)} is not empty.`);
    console.log();
    console.log('Either try using a new directory name, or remove the files.');
    process.exit(1);
  }

  /**
   4. 创建 package.json
 */
  const packageJson = {
    name: gameName,
    version: '0.1.0',
    private: true
  };

  fs.writeFileSync(
    path.join(rootPath, 'package.json'),
    JSON.stringify(packageJson, null, 2) + os.EOL
  );

  const useYarn = shouldUseYarn();

  run(rootPath, gameName, packages, useYarn);
}

function run(root, gameName, packages, useYarn) {
  const allDependencies = [
    'babel-polyfill',
    'vue',
    'vue-router',
    'vuex',
    'meisha-fe-watch',
    'katex',
    'vue-i18n',
    ...packages
  ];

  const allDevDependencies = ['@msfe/steam-game-scripts'];

  console.log('Installing packages. This might take a couple of minutes.');

  checkIfOnline(useYarn)
    .then(isOnline => {
      console.log(`Installing ${chalk.cyan(allDependencies.join(' '))}...`);
      console.log();

      return install(root, useYarn, allDependencies, isOnline).then(() =>
        install(root, useYarn, allDevDependencies, isOnline, true)
      );
    })
    .then(async () => {
      await executeNodeScript(
        {
          cwd: root,
          args: []
        },
        [root, gameName],
        `
      var init = require('@msfe/steam-game-scripts/scripts/init.js');
      init.apply(null, JSON.parse(process.argv[1]));
      `
      );
    })
    .catch(reason => {
      console.log();
      console.log('Aborting installation.');
      if (reason.command) {
        console.log(`  ${chalk.cyan(reason.command)} has failed.`);
      } else {
        console.log(chalk.red('Unexpected error. Please report it as a bug:'));
        console.log(reason);
      }
      console.log();

      // On 'exit' we will delete these files from target directory.
      const knownGeneratedFiles = ['package.json', 'yarn.lock', 'node_modules'];
      const currentFiles = fs.readdirSync(path.join(root));
      currentFiles.forEach(file => {
        knownGeneratedFiles.forEach(fileToMatch => {
          // This remove all of knownGeneratedFiles.
          if (file === fileToMatch) {
            console.log(`Deleting generated file... ${chalk.cyan(file)}`);
            fs.removeSync(path.join(root, file));
          }
        });
      });
      const remainingFiles = fs.readdirSync(path.join(root));
      if (!remainingFiles.length) {
        // Delete target folder if empty
        console.log(
          `Deleting ${chalk.cyan(`${gameName}/`)} from ${chalk.cyan(
            path.resolve(root, '..')
          )}`
        );
        process.chdir(path.resolve(root, '..'));
        fs.removeSync(path.join(root));
      }
      console.log('Done.');
      process.exit(1);
    });
}

function install(root, useYarn, dependencies, isOnline, isDev = false) {
  return new Promise((resolve, reject) => {
    let command;
    let args;

    if (useYarn) {
      command = 'yarnpkg';
      args = ['add'];

      if (isDev) {
        args.push('--dev');
      }

      if (!isOnline) {
        args.push('--offline');
      }

      [].push.apply(args, dependencies);
      args.push('--cwd');
      args.push(root);

      if (!isOnline) {
        console.log(chalk.yellow('You appear to be offline.'));
        console.log(chalk.yellow('Falling back to the local Yarn cache.'));
        console.log();
      }
    } else {
      command = 'npm';
      args = ['install', '--save', '--loglevel', 'error'];

      if (isDev) {
        args.push('--save-dev');
      }

      args = args.concat(dependencies);
    }

    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('close', code => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(' ')}`
        });
        return;
      }
      resolve();
    });
  });
}

function checkGameName(name) {
  const validResult = validateProjectName(name);
  if (!validResult.validForNewPackages) {
    console.error(
      `Could not create a project called ${chalk.red(
        `"${name}"`
      )} because of npm naming restrictions:`
    );
    printValidErrors(validResult.errors);
    printValidErrors(validResult.warnings);
  }
}

function printValidErrors(results) {
  if (Array.isArray(results)) {
    results.forEach(result => {
      console.log(`  ${chalk.red(result)}`);
    });
  }
}

function getPackageToInstall(packages) {
  try {
    if (!packages || !typeof packages === 'string') {
      return [];
    }
    return packages.split(' ');
  } catch (err) {
    return [];
  }
}

function checkIfOnline(useYarn) {
  if (!useYarn) {
    // Don't ping the Yarn registry.
    // We'll just assume the best case.
    return Promise.resolve(true);
  }

  return new Promise(resolve => {
    dns.lookup('registry.yarnpkg.com', err => {
      let proxy;
      if (err != null && (proxy = getProxy())) {
        // If a proxy is defined, we likely can't resolve external hostnames.
        // Try to resolve the proxy name as an indication of a connection.
        dns.lookup(url.parse(proxy).hostname, proxyErr => {
          resolve(proxyErr == null);
        });
      } else {
        resolve(err == null);
      }
    });
  });
}

function getProxy() {
  if (process.env.https_proxy) {
    return process.env.https_proxy;
  } else {
    try {
      // Trying to read https-proxy from .npmrc
      let httpsProxy = execSync('npm config get https-proxy')
        .toString()
        .trim();
      return httpsProxy !== 'null' ? httpsProxy : undefined;
    } catch (e) {
      return;
    }
  }
}

function emptyDirectory(path) {
  try {
    const files = fs.readdirSync(path);
    return !files || !files.length;
  } catch (error) {
    return true;
  }
}

function nodeMajorVersionCheck(majorLimit) {
  const currentNodeVersion = process.versions.node;
  const major = currentNodeVersion.split('.')[0];
  if (major < majorLimit) {
    console.error(
      chalk.red(
        'You are running Node ' +
          currentNodeVersion +
          '.\n' +
          `Create Steam Game requires Node ${majorLimit} or higher. \n` +
          'Please update your version of Node.'
      )
    );
    process.exit(1);
  }
}

function shouldUseYarn() {
  try {
    execSync('yarn --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

function executeNodeScript({ cwd, args }, data, source) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [...args, '-e', source, '--', JSON.stringify(data)],
      { cwd, stdio: 'inherit' }
    );

    child.on('close', code => {
      if (code !== 0) {
        reject({
          command: `node ${args.join(' ')}`
        });
        return;
      }
      resolve();
    });
  });
}
