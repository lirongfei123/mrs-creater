const paths = require('../../paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pkg = require(paths.appPackageJson);
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
module.exports = function (ruleHooks) {
    ruleHooks.for('html').tapAsync('file', (plugins, config, callback) => {
        if (pkg.component && config.isEnvProduction) {
            callback(null, plugins);
        } else {
            callback(null, plugins.concat(new HtmlWebpackPlugin(
                Object.assign(
                    {},
                    {
                        inject: true,
                        template: paths.appHtml,
                    },
                    config.isEnvProduction ? {
                        minify: {
                            removeComments: true,
                            collapseWhitespace: true,
                            removeRedundantAttributes: true,
                            useShortDoctype: true,
                            removeEmptyAttributes: true,
                            removeStyleLinkTypeAttributes: true,
                            keepClosingSlash: true,
                            minifyJS: true,
                            minifyCSS: true,
                            minifyURLs: true,
                        },
                    }
                    : undefined
                )
            ),
            (config.isEnvProduction && config.shouldInlineRuntimeChunk) ? new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime~.+[.]js/]) : [],
                new InterpolateHtmlPlugin(HtmlWebpackPlugin, config.env.raw),
            ));
        }
    });
}