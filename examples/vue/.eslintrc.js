module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'semi': ['error', 'always', {
      "omitLastInOneLineBlock": true
    }],
    "indent": [1, 2]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
