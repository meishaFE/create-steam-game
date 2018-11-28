const HOST = window.location.host;

// 检查环境
export const ENV = {
  local: /127.0.0.1|192.168|localhost|iampomelo./.test(HOST),
  test: HOST.startsWith('test-'),
  pre: HOST.startsWith('pre-'),
  prod: HOST.startsWith('steam.'),
  iOS: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
};

// 静态资源地址前缀
export const STATIC_URL = 'https://cdn.meishakeji.com/';

// AJAX接口请求地址
export const BASE_URL = ENV.local ? '//dev-steam.meishakeji.com' : '';

// WebSocket链接地址·
export const WS_URL = 'wss://ws.meishakeji.com:9055';
