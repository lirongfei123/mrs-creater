const paths = require('../../paths');
module.exports = function (ruleHooks) {
    ruleHooks.for('file').tapAsync('file', (rules, config, callback) => {
        callback(null, rules.concat({
            loader: require.resolve('file-loader'),
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
        }));
    });
}

