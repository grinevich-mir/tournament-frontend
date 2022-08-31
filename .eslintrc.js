module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'off' : 'off', // warn / off
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'max-len': [1, 300, 2],
    'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
    'no-param-reassign': [2, { 'props': false, }],
  },
};
