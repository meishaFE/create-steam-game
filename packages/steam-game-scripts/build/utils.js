'use strict';
const path = require('path');
const fs = require('fs');
const config = require('../config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const packageConfig = require('../package.json');
const shell = require('shelljs');
const chalk = require('chalk');
const postcssImport = require('postcss-import');
const postcssUrl = require('postcss-url');
const autoprefixer = require('autoprefixer');
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
exports.resolveApp = resolveApp;
exports.appDirectory = appDirectory;

exports.assetsPath = function(_path) {
  var assetsSubDirectory =
    process.env.NODE_ENV === 'production'
      ? config.build.assetsSubDirectory
      : config.dev.assetsSubDirectory;
  return path.posix.join(assetsSubDirectory, _path);
};

exports.cssLoaders = function(options) {
  options = options || {};

  const cssLoader = {
    loader: require.resolve('css-loader'),
    options: {
      sourceMap: options.sourceMap
    }
  };

  const postcssLoader = {
    loader: require.resolve('postcss-loader'),
    options: {
      sourceMap: options.sourceMap,
      plugins: [postcssUrl(), postcssImport(), autoprefixer]
    }
  };

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const loaders = options.usePostCSS
      ? [cssLoader, postcssLoader]
      : [cssLoader];

    if (loader) {
      loaders.push({
        loader: require.resolve(loader + '-loader'),
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      });
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      // return ExtractTextPlugin.extract({
      //   use: loaders,
      //   fallback: 'vue-style-loader'
      // });
      return [MiniCssExtractPlugin.loader].concat(loaders);
    } else {
      return [require.resolve('vue-style-loader')].concat(loaders);
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('fast-sass', { indentedSyntax: true }),
    scss: generateLoaders('fast-sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  };
};

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function(options) {
  const output = [];
  const loaders = exports.cssLoaders(options);

  for (const extension in loaders) {
    const loader = loaders[extension];
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    });
  }

  return output;
};

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier');

  return (severity, errors) => {
    if (severity !== 'error') return;

    const error = errors[0];
    const filename = error.file && error.file.split('!').pop();

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    });
  };
};

exports.copyStaticFiles = rootPath => {
  console.log(chalk.cyan('\n  Start Copy Static Files\n'));
  var assetsPath = rootPath;
  shell.mkdir('-p', assetsPath);
  shell.config.silent = true;
  shell.cp('-R', resolveApp('static'), assetsPath);
  shell.config.silent = false;
  console.log(chalk.cyan('\n  Copy Static Files Success\n'));
};
