const path = require('path');
const webpack = require('webpack');

const {
  override,
  addWebpackAlias,
  removeModuleScopePlugin,
} = require('customize-cra');

module.exports = override(
  addWebpackAlias({
    "@sdk": path.resolve(__dirname, "../../lib"),
  }),
  removeModuleScopePlugin()
);