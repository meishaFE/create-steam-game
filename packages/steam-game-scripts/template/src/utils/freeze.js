const isObject = obj =>
  Object.prototype.toString.call(obj) === '[object Object]';

const freeze = obj => {
  (function __freeze(obj) {
    if (isObject(obj)) {
      Object.values(obj).forEach(val => __freeze(val));
      Object.freeze(obj);
    }
  })(obj);

  return obj;
};

export default freeze;
