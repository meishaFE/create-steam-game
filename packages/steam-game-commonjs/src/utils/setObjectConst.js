export default (obj, args) => {
  const consts = Object.keys(args).reduce((obj, key) => {
    obj[key] = {
      value: args[key],
      writable: false,
      configurable: false
    };
    return obj;
  }, {});

  Object.defineProperties(obj, consts);
  return obj;
};
