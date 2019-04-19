const paths = require('../../paths');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
module.exports = function (ruleHooks) {
    ruleHooks.for('sw').tapAsync('sw', (rules, config, callback) => {
        callback(null, rules.concat(
            config.isEnvProduction ? new WorkboxWebpackPlugin.GenerateSW({
                clientsClaim: true,
                exclude: [/\.map$/, /asset-manifest\.json$/],
                importWorkboxFrom: 'cdn',
                navigateFallback: config.publicUrl + '/index.html',
                navigateFallbackBlacklist: [
                // Exclude URLs starting with /_, as they're likely an API call
                new RegExp('^/_'),
                // Exclude URLs containing a dot, as they're likely a resource in
                // public/ and not a SPA route
                new RegExp('/[^/]+\\.[^/]+$'),
                ],
            }) : []
        ));
    });
}