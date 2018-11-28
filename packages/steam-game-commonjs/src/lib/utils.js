const getQueryObj = function() {
  return window.location.search
    .substr(1)
    .split('&')
    .reduce((r, v) => {
      const t = v.split('=');
      if (t[0] && t[1]) {
        r[t[0]] = t[1];
      }
      return r;
    }, {});
};

const sleep = function(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

/**
 * 预加载图片
 * @param urls 图片地址数组
 * @param prefix 图片地址前缀(可选)
 * @returns {Promise}
 */
const preLoadImg = function(urls, prefix) {
  if (!Array.isArray(urls)) {
    return Promise.resolve();
  }
  const promises = new Array(urls.length);
  for (let i = 0; i < urls.length; i++) {
    promises[i] = new Promise(resolve => {
      const img = new Image();
      img.onload = resolve;
      img.src = (prefix || '') + urls[i];
    });
  }
  return Promise.all(promises);
};

export { getQueryObj, sleep, preLoadImg };
