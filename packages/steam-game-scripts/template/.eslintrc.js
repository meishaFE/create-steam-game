// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard',
  ],
  // required to lint *.vue files
  plugins: ['vue'],
  // add your custom rules here
  rules: {
    'prefer-promise-reject-errors': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'space-before-function-paren': 0,
    semi: ['error', 'always'],
    indent: 0,
    'no-fallthrough': 0,
    eqeqeq: 0,
    'one-var': 0,
    'no-extra-boolean-cast': 0,
    camelcase: 0,
    'no-mixed-operators': 0,
    'eol-last': 0,
  },
  globals: {
    MeishaWatch: true,
    API: true,
    $http: true,
    $type: true,
    d3: true,
    mathgeo: true,
    katex: true,
    fabric: true,
    steamgame: true,
  },
};
