import $type from '$type';

const freeze = obj => {
  (function __freeze(obj) {
    if ($type.isObject(obj)) {
      Object.values(obj).forEach(val => __freeze(val));
      Object.freeze(obj);
    }
  })(obj);

  return obj;
};

export default freeze;
