const path = require('path');

module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias.set('@sdk', path.resolve(__dirname, '../../lib'));
  }
}
