const paths = require('../paths');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
module.exports = function (ruleHooks) {
    ruleHooks.tapAsync('optimization', (rules, config, callback) => {
        callback(null, {
            minimize: config.isEnvProduction,
            minimizer: [
              // This is only used in production mode
              new TerserPlugin({
                terserOptions: {
                  parse: {
                    // we want terser to parse ecma 8 code. However, we don't want it
                    // to apply any minfication steps that turns valid ecma 5 code
                    // into invalid ecma 5 code. This is why the 'compress' and 'output'
                    // sections only apply transformations that are ecma 5 safe
                    // https://github.com/facebook/create-react-app/pull/4234
                    ecma: 8,
                  },
                  compress: {
                    ecma: 5,
                    warnings: false,
                    // Disabled because of an issue with Uglify breaking seemingly valid code:
                    // https://github.com/facebook/create-react-app/issues/2376
                    // Pending further investigation:
                    // https://github.com/mishoo/UglifyJS2/issues/2011
                    comparisons: false,
                    // Disabled because of an issue with Terser breaking valid code:
                    // https://github.com/facebook/create-react-app/issues/5250
                    // Pending futher investigation:
                    // https://github.com/terser-js/terser/issues/120
                    inline: 2,
                  },
                  mangle: {
                    safari10: true,
                  },
                  output: {
                    ecma: 5,
                    comments: false,
                    // Turned on because emoji and regex is not minified properly using default
                    // https://github.com/facebook/create-react-app/issues/2488
                    ascii_only: true,
                  },
                },
                // Use multi-process parallel running to improve the build speed
                // Default number of concurrent runs: os.cpus().length - 1
                parallel: true,
                // Enable file caching
                cache: true,
                sourceMap: config.shouldUseSourceMap,
              }),
              // This is only used in production mode
              new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                  parser: safePostCssParser,
                  map: config.shouldUseSourceMap
                    ? {
                        // `inline: false` forces the sourcemap to be output into a
                        // separate file
                        inline: false,
                        // `annotation: true` appends the sourceMappingURL to the end of
                        // the css file, helping the browser find the sourcemap
                        annotation: true,
                      }
                    : false,
                },
              }),
            ],
            // Automatically split vendor and commons
            // https://twitter.com/wSokra/status/969633336732905474
            // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
            splitChunks: {
              chunks: 'all',
              name: false,
            },
            // Keep the runtime chunk separated to enable long term caching
            // https://twitter.com/wSokra/status/969679223278505985
            runtimeChunk: true,
        });
    });
}




