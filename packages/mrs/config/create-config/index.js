const {
    AsyncSeriesWaterfallHook,
    HookMap,
    SyncBailHook
} = require('tapable');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const fs = require('fs');
const paths = require('../paths');
const pkg = require(paths.appPackageJson);
const path = require('path');
const hooks = {
    rules: new HookMap(() => new AsyncSeriesWaterfallHook(['rules', 'config'])),
    plugins: new HookMap(() => new AsyncSeriesWaterfallHook(['plugins', 'config'])),
    entry: new AsyncSeriesWaterfallHook(['entryInitConfig', 'config']),
    output: new AsyncSeriesWaterfallHook(['outputInitConfig', 'config']),
    resolve: new AsyncSeriesWaterfallHook(['resolveInitConfig', 'config']),
    resolveLoader: new AsyncSeriesWaterfallHook(['resolveInitConfig', 'config']),
    optimization: new AsyncSeriesWaterfallHook(['optimizationInitConfig', 'config']),
    externals: new AsyncSeriesWaterfallHook(['externalsConfig', 'config']),
};
require('./rules/eslint')(hooks.rules);
require('./rules/javascript')(hooks.rules);
require('./rules/css')(hooks.rules);
require('./rules/img')(hooks.rules);
require('./rules/file')(hooks.rules);
require('./plugins/html')(hooks.plugins);
require('./plugins/define')(hooks.plugins);
require('./plugins/serviceworker')(hooks.plugins);
require('./plugins/typescript')(hooks.plugins);
require('./plugins/other')(hooks.plugins);
require('./optimization')(hooks.optimization);
require('./resolve')(hooks.resolve);
require('./resolveLoader')(hooks.resolveLoader);
require('./output')(hooks.output);
if (pkg.aliyun === true) {
    // 针对阿里云自定义的
    hooks.output.tapAsync('output', (outputConfig, options, callback) => {
        if (options.isEnvProduction) {
            if (pkg.component) {
                callback(null, {
                    ...outputConfig,
                    filename: 'bundle.js',
                    chunkFilename: '[name].chunk.js',
                });
            } else {
                callback(null, {
                    ...outputConfig,
                    filename: 'static/js/bundle.js',
                    chunkFilename: 'static/js/[name].chunk.js',
                });
            }
        } else {
            callback(null, outputConfig);
        }
    });
    hooks.plugins.for('sw').tapAsync('cssText', (otherPluginConfig, options, callback) => {
        callback(null, []);
    });
    hooks.plugins.for('other').tapAsync('cssText', (otherPluginConfig, options, callback) => {
        callback(null, otherPluginConfig.map((item) => {
            if (options.isEnvProduction && item && item.constructor.name &&  item.constructor.name === 'MiniCssExtractPlugin') {
                if (pkg.component) {
                    return null;
                } else {
                    return new MiniCssExtractPlugin({
                        filename: 'static/css/[name].css',
                        chunkFilename: 'static/css/[name].chunk.css',
                    });
                }
            } else {
                return item;
            }
        }));
    });
    hooks.optimization.tapAsync('output', (optimizationConfig, options, callback) => {
        if (options.isEnvProduction) {
            callback(null, {
                ...optimizationConfig,
                splitChunks: false
            });
        } else {
            callback(null, optimizationConfig);
        }
    });
}
module.exports = hooks;
// const jsPlugin = require('./rules/javascript');
// const ruleHooks = new HookMap(() => new AsyncSeriesWaterfallHook(['rules']));
// jsPlugin(ruleHooks);
// ruleHooks.for('js').promise(2).then((results) => {
//     console.log(results);
// });
// const jsHook = new AsyncSeriesWaterfallHook(['rules'])
// jsHook.tapAsync('js', (r, callback) => {
//     callback([3,4,2]);
// });
// jsHook.callAsync('323', (err, result) => {
//     console.log(err, result);
// });