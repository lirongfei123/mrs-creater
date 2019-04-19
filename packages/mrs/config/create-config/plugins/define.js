const paths = require('../../paths');
const webpack = require('webpack');
module.exports = function (ruleHooks) {
    ruleHooks.for('define').tapAsync('define', (rules, config, callback) => {
        callback(null, rules.concat(new webpack.DefinePlugin(config.env.stringified)));
    });
}

