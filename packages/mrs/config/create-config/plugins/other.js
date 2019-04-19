const paths = require('../../paths');
const webpack = require('webpack');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const resolve = require('resolve');

module.exports = function (ruleHooks) {
    ruleHooks.for('other').tapAsync('other', (rules, config, callback) => {
        callback(null, rules.concat(
            new ModuleNotFoundPlugin(paths.appPath),
            new webpack.DefinePlugin(config.env.stringified),
            config.isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
            config.isEnvDevelopment && new CaseSensitivePathsPlugin(),
            config.isEnvDevelopment &&
                new WatchMissingNodeModulesPlugin(paths.appNodeModules),
            config.isEnvProduction &&
                new MiniCssExtractPlugin({
                    filename: 'static/css/[name].[contenthash:8].css',
                    chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
                }),
            new ManifestPlugin({
                fileName: 'asset-manifest.json',
                publicPath: config.publicPath,
            }),
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        ));
    });
}

