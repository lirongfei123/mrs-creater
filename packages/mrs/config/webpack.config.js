const createConfig = require('./create-config/index');
const async = require('async');
const paths = require('./paths');
const fs = require('fs');
const handleConfig = require('./handleConfig');
const getClientEnvironment = require('./env');
module.exports = async function (webpackEnv) {
  if (fs.existsSync(paths.mrsSetup)) {
    const mrsSetup = require(paths.mrsSetup);
    // 处理
    handleConfig(mrsSetup, createConfig, paths);
  }
  if (fs.existsSync(paths.configSetup)) {
    require(paths.configSetup)(createConfig);
  }
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
  return new Promise ((resolve) => {
        async.parallel({
        output: function(callback) {
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
        externals: function(callback) {
            createConfig.externals.callAsync({}, config, (err, result) => {
                callback(null, result);
            })
        },
        entry: function(callback) {
            createConfig.entry.callAsync([
                isEnvDevelopment && require.resolve('react-dev-utils/webpackHotDevClient'),
                paths.appIndexJs
            ].filter(Boolean), config, (err, result) => {
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
                    async.waterfall([
                    (icallback) => {
                        createConfig.rules.for('js').callAsync([], config, (err, result) => {
                        icallback(null, [...result]);
                        });
                    },
                    (ipreResult, icallback) => {
                        createConfig.rules.for('css').callAsync([], config, (err, result) => {
                            icallback(null, [...ipreResult, ...result]);
                        });
                    },
                    (ipreResult, icallback) => {
                        createConfig.rules.for('img').callAsync([], config, (err, result) => {
                            icallback(null, [...ipreResult, ...result]);
                        });
                    },
                    (ipreResult, icallback) => {
                        createConfig.rules.for('file').callAsync([], config, (err, result) => {
                            icallback(null, [...ipreResult, ...result]);
                        });
                    }
                    ], (err, result) => {
                    callback(null, [...preResult, {
                        oneOf: result
                    }]);
                    });
                },
            ], (err, results) => {
                callback(null, results);
            });
        },
    }, function(err, results) {
        console.log(results.output);
        const config = {
            mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
            // Stop compilation early in production
            bail: isEnvProduction,
            devtool: isEnvProduction ? shouldUseSourceMap
                ? 'source-map'
                : false
                : isEnvDevelopment && 'cheap-module-source-map',
            entry: Array.isArray(results.entry) ? results.entry.filter(Boolean) : results.entry,
            externals: results.externals,
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
        resolve(config);
    });
  });
}

