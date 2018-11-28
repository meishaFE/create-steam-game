import * as $http from './http';
import { filters } from './filters';
import setObjectConst from '../utils/setObjectConst';

/**
 * 初始化 http, 在 Vue 上挂载 filters
 * @param {Vue} Vue
 * @param {String} staticUrl
 */
export default function init(Vue, staticUrl = '') {
  if (staticUrl) {
    const STATIC_URL = staticUrl;
    setObjectConst(window, { STATIC_URL });
  }

  setObjectConst(window, { $http });
  Vue.use(filters);
}
