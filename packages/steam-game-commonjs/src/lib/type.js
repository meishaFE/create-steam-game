/**
 * 类型处理
 *
 * writtern by Jayden
 */

const toS = Object.prototype.toString;

/**
 * 判断val是否为type类型的值
 * @param val
 * @param type 可能的值为Function, Object, Array, Number, String, RegExp, Null, Undefined, Boolean, Symbol, Date等
 * @returns {boolean}
 */
const isType = (value, type = '') => {
  type = '' + type;

  if (type === 'Number' && Number.isNaN(value)) {
    return false;
  }

  return (
    toS
      .call(value)
      .replace(/.*\s(.*)]$/, '$1')
      .toLowerCase() === type.toLowerCase()
  );
};

/**
 * 获取val的类型
 * @param val
 * @returns {string}
 */
const getType = value =>
  Number.isNaN(value) ? 'NaN' : toS.call(value).replace(/.*\s(.*)]$/, '$1');

export { isType, getType };
