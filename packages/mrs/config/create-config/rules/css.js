const paths = require('../../paths');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const safePostCssParser = require('postcss-safe-parser');
const getStyleLoaders = (cssOptions, preProcessor, config) => {
    const loaders = [
        config.isEnvDevelopment && require.resolve('style-loader'),
        config.isEnvProduction && {
            loader: MiniCssExtractPlugin.loader,
            options: Object.assign(
                {},
                config.shouldUseRelativeAssetPaths ? { publicPath: '../../' } : undefined
            ),
        },
        {
            loader: require.resolve('css-loader'),
            options: cssOptions,
        },
        {
            // Options for PostCSS as we reference these options twice
            // Adds vendor prefixing based on your specified browser support in
            // package.json
            loader: require.resolve('postcss-loader'),
            options: {
            // Necessary for external CSS imports to work
            // https://github.com/facebook/create-react-app/issues/2677
            ident: 'postcss',
            plugins: () => [
                require('postcss-flexbugs-fixes'),
                require('postcss-preset-env')({
                autoprefixer: {
                    flexbox: 'no-2009',
                },
                stage: 3,
                }),
            ],
            sourceMap: config.isEnvProduction && config.shouldUseSourceMap,
            },
        },
    ].filter(Boolean);
    if (preProcessor) {
        loaders.push({
            loader: require.resolve(preProcessor),
            options: {
                sourceMap: config.isEnvProduction && config.shouldUseSourceMap,
                javascriptEnabled: true
            },
        });
    }
    return loaders;
};
// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const lessModuleRegex = /\.module\.less$/;
module.exports = function (ruleHooks) {
    ruleHooks.for('css').tapAsync('css23', function(rules, config, callback) {
        callback(null, rules.concat({
            test: cssRegex,
            exclude: cssModuleRegex,
            use: getStyleLoaders({
                importLoaders: 1,
                sourceMap: config.isEnvProduction && config.shouldUseSourceMap,
            }, undefined, config),
            // Don't consider CSS imports dead code even if the
            // containing package claims to have no side effects.
            // Remove this when webpack adds a warning or an error for this.
            // See https://github.com/webpack/webpack/issues/6571
            sideEffects: true,
        }));
    });
    ruleHooks.for('css').tapAsync('moduleCss', function(rules, config, callback) {
        callback(null, rules.concat({
            test: cssModuleRegex,
            use: getStyleLoaders({
                importLoaders: 1,
                sourceMap: config.isEnvProduction && config.shouldUseSourceMap,
                modules: true,
                getLocalIdent: getCSSModuleLocalIdent,
            }, undefined, config),
        }));
    });
    ruleHooks.for('css').tapAsync('cssSass', function(rules, config, callback) {
        callback(null, rules.concat({
            test: sassRegex,
            exclude: sassModuleRegex,
            use: getStyleLoaders(
                {
                    importLoaders: 2,
                    sourceMap: config.isEnvProduction && config.shouldUseSourceMap,
                },
                'sass-loader',
                config
            ),
            // Don't consider CSS imports dead code even if the
            // containing package claims to have no side effects.
            // Remove this when webpack adds a warning or an error for this.
            // See https://github.com/webpack/webpack/issues/6571
            sideEffects: true,
        }));
    });
    ruleHooks.for('css').tapAsync('cssSassModule', function(rules, config, callback) {
        callback(null, rules.concat({
            test: sassModuleRegex,
            use: getStyleLoaders(
                {
                    importLoaders: 2,
                    sourceMap: config.isEnvProduction && config.shouldUseSourceMap,
                    modules: true,
                    getLocalIdent: getCSSModuleLocalIdent,
                },
                'sass-loader',
                config
            ),
        }));
    });
    ruleHooks.for('css').tapAsync('cssLessModule', function(rules, config, callback) {
        callback(null, rules.concat({
            test: lessModuleRegex,
            use: getStyleLoaders(
                {
                    importLoaders: 2,
                    sourceMap: config.isEnvProduction && config.shouldUseSourceMap,
                    modules: true,
                    getLocalIdent: getCSSModuleLocalIdent,
                },
                'less-loader',
                config
            ),
        }));
    });
}
