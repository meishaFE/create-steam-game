'use strict';

const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

module.exports = function(id, loaders) {
  return new HappyPack({
    id,
    threadPool: happyThreadPool,
    verbose: true,
    loaders
  });
};
