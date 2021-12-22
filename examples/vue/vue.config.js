const path = require('path');
const webpack = require('webpack');

module.exports = {
  chainWebpack: (config) => {
    config.resolve.symlinks(false);
    config.plugin('env').use(webpack.DefinePlugin, [{
      'process.env.BUILD_TIME': JSON.stringify(new Date()),
    }]);
  }
}
