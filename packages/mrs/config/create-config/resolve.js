const paths = require('../paths');
const path = require('path');
const webpack = require('webpack');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
module.exports = function (ruleHooks) {
    ruleHooks.tapAsync('resolve', (resolveOption, config, callback) => {
        callback(null, {
            // This allows you to set a fallback for where Webpack should look for modules.
            // We placed these paths second because we want `node_modules` to "win"
            // if there are any conflicts. This matches Node resolution mechanism.
            // https://github.com/facebook/create-react-app/issues/253
            modules: ['node_modules'].concat(
              // It is guaranteed to exist because we tweak it in `env.js`
              process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
            ),
            // These are the reasonable defaults supported by the Node ecosystem.
            // We also include JSX as a common component filename extension to support
            // some tools, although we do not recommend using it, see:
            // https://github.com/facebook/create-react-app/issues/290
            // `web` extension prefixes have been added for better support
            // for React Native Web.
            extensions: paths.moduleFileExtensions
              .map(ext => `.${ext}`)
              .filter(ext => config.useTypeScript || !ext.includes('ts')),
            alias: {
              // Support React Native Web
              // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
              'react-native': 'react-native-web',
            },
            plugins: [
                PnpWebpackPlugin,
                new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
            ]
        });
    });
}




