const paths = require('../paths');
const path = require('path');
const webpack = require('webpack');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
module.exports = function (ruleHooks) {
    ruleHooks.tapAsync('resolveLoader', (resolveOption, config, callback) => {
        callback(null, {
            plugins: [
              // Also related to Plug'n'Play, but this time it tells Webpack to load its loaders
              // from the current package.
              PnpWebpackPlugin.moduleLoader(module),
            ],
          });
    });
}




