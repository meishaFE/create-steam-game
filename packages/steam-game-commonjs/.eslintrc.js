module.exports = {
  extends: [
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  globals: {
    d3: true
  },
  plugins: ['import'],
  rules: {
    'prefer-promise-reject-errors': 0,
    'space-before-function-paren': 0,
    'no-console': 'off',
    strict: ['error', 'global'],
    curly: 'warn',
    semi: ['error', 'always']
  }
};
