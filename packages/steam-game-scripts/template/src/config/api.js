import { BASE_URL } from './env';
const API = {
  COMMON: { ...steamgame.CONFIG.COMMON_API }
};

/**
 * 根据环境不同加前缀
 */
export default (function addBaseURL(obj, prefix) {
  for (let [key, value] of Object.entries(obj)) {
    typeof value === 'object'
      ? addBaseURL(value, prefix)
      : (obj[key] = prefix + value);
  }
  return obj;
})(API, BASE_URL + '/api/v1/');
