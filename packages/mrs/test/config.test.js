const createConfig = require('../config/create-config/index');
const async = require('async');
const paths = require('../config/paths');
const fs = require('fs');
const getClientEnvironment = require('../config/env');
test('adds 1 + 2 to equal 3', () => {
    const webpackEnv = 'development';
    const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
    const isEnvDevelopment = webpackEnv === 'development';
    const isEnvProduction = webpackEnv === 'production';
    const publicPath = isEnvProduction ? paths.servedPath : isEnvDevelopment && '/';
    const useTypeScript = fs.existsSync(paths.appTsConfig);
    const shouldUseRelativeAssetPaths = publicPath === './';
    const publicUrl = isEnvProduction ? publicPath.slice(0, -1) : isEnvDevelopment && '';
    // Get environment variables to inject into our app.
    const env = getClientEnvironment(publicUrl);
    const config = {
        isEnvDevelopment,
        isEnvProduction,
        shouldUseSourceMap,
        publicPath,
        env,
        useTypeScript,
        shouldUseRelativeAssetPaths
    }
    async.parallel({
        ouput: function(callback) {
            createConfig.output.callAsync({}, config, (err, result) => {
                callback(null, result);
            });
        },
        resolve: function(callback) {
            createConfig.resolve.callAsync({}, config, (err, result) => {
                callback(null, result);
            });
        },
        resolveLoader: function(callback) {
            createConfig.resolveLoader.callAsync({}, config, (err, result) => {
                callback(null, result);
            });
        },
        optimization: function(callback) {
            createConfig.optimization.callAsync({}, config, (err, result) => {
                callback(null, result);
            })
        },
        plugins: function(callback) {
            async.waterfall([
                (callback) => {
                    createConfig.plugins.for('html').callAsync([], config, (err, result) => {
                        callback(null, result);
                    })
                },
                (preResult, callback) => {
                    createConfig.plugins.for('define').callAsync([], config, (err, result) => {
                        callback(null, [...preResult, ...result]);
                    })
                },
                (preResult, callback) => {
                    createConfig.plugins.for('sw').callAsync([], config, (err, result) => {
                        callback(null, [...preResult, ...result]);
                    })
                },
                (preResult, callback) => {
                    createConfig.plugins.for('ts').callAsync([], config, (err, result) => {
                        callback(null, [...preResult, ...result]);
                    })
                },
                (preResult, callback) => {
                    createConfig.plugins.for('other').callAsync([], config, (err, result) => {
                        callback(null, [...preResult, ...result]);
                    })
                }
            ], (err, results) => {
                callback(null, results);
            });
        },
        rules: function(callback) {
            async.waterfall([
                (callback) => {
                    createConfig.rules.for('eslint').callAsync([], config, (err, result) => {
                        callback(null, result);
                    })
                },
                (preResult, callback) => {
                    createConfig.rules.for('js').callAsync([], config, (err, result) => {
                        callback(null, [...preResult, ...result]);
                    });
                },
                (preResult, callback) => {
                    createConfig.rules.for('css').callAsync([], config, (err, result) => {
                        callback(null, [...preResult, ...result]);
                    });
                },
                (preResult, callback) => {
                    createConfig.rules.for('img').callAsync([], config, (err, result) => {
                        callback(null, [...preResult, ...result]);
                    });
                },
                (preResult, callback) => {
                    createConfig.rules.for('file').callAsync([], config, (err, result) => {
                        callback(null, [...preResult, ...result]);
                    });
                },
            ], (err, results) => {
                callback(null, results);
            });
        },
    }, function(err, results) {
        const config = {
            mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
            // Stop compilation early in production
            bail: isEnvProduction,
            devtool: isEnvProduction ? shouldUseSourceMap
                ? 'source-map'
                : false
                : isEnvDevelopment && 'cheap-module-source-map',
            entry: [
                isEnvDevelopment &&
                require.resolve('react-dev-utils/webpackHotDevClient'),
                paths.appIndexJs,
            ].filter(Boolean),
            output: results.output,
            optimization: results.optimization,
            resolve: results.resolve,
            resolveLoader: results.resolveLoader,
            module: {
                strictExportPresence: true,
                rules: [
                    {
                        parser: { requireEnsure: false }
                    },
                    ...results.rules
                ],
            },
            plugins: [
                ...results.plugins
            ].filter(Boolean),
            node: {
                module: 'empty',
                dgram: 'empty',
                dns: 'mock',
                fs: 'empty',
                net: 'empty',
                tls: 'empty',
                child_process: 'empty',
            },
            performance: false,
        };
        console.log(config);
    });
});


