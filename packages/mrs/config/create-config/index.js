const {
    AsyncSeriesWaterfallHook,
    HookMap,
    SyncBailHook
} = require('tapable');

const fs = require('fs');
const path = require('path');
const hooks = {
    rules: new HookMap(() => new AsyncSeriesWaterfallHook(['rules', 'config'])),
    plugins: new HookMap(() => new AsyncSeriesWaterfallHook(['plugins', 'config'])),
    entry: new AsyncSeriesWaterfallHook(['entryInitConfig', 'config']),
    output: new AsyncSeriesWaterfallHook(['outputInitConfig', 'config']),
    resolve: new AsyncSeriesWaterfallHook(['resolveInitConfig', 'config']),
    resolveLoader: new AsyncSeriesWaterfallHook(['resolveInitConfig', 'config']),
    optimization: new AsyncSeriesWaterfallHook(['optimizationInitConfig', 'config'])
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