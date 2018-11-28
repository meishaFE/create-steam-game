/**
 * VueJS全局过滤器
 */

import { dateFormat } from './date';
import { isType } from './type';

const STATIC_URL = window.STATIC_URL || 'https://cdn.meishakeji.com/';

const _filters = {
  dateFormat(str, format) {
    return dateFormat(new Date(str), format);
  },
  staticSource(source, width, height) {
    if (!source) return;
    const src = source.trim();
    if (!source) return '';
    if (
      src.startsWith('data') ||
      src.startsWith('base64') ||
      src.startsWith('http')
    ) {
      return src;
    }
    return (
      STATIC_URL +
      src +
      (width && height
        ? `?x-oss-process=image/resize,m_fill,h_${height},w_${width}`
        : '')
    );
  },
  formatNoData: (val, empty = '-') => (val === 0 || val ? val : empty),
  formatArray: (val, sper = ',', empty = '-') =>
    val && val.length ? val.join(sper) : empty
};

const install = Vue =>
  isType(_filters, 'Object') &&
  (Object.keys(_filters) || []).forEach(key => Vue.filter(key, _filters[key]));

export const filters = { install };
