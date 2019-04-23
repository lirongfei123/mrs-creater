const paths = require('../paths');
const path = require('path');
module.exports = function (ruleHooks) {
    ruleHooks.tapAsync('output', (resolveOption, config, callback) => {
        callback(null, {
            // The build folder.
            path: config.isEnvProduction ? paths.appBuild : undefined,
            // Add /* filename */ comments to generated require()s in the output.
            pathinfo: config.isEnvDevelopment,
            // There will be one main bundle, and one file per asynchronous chunk.
            // In development, it does not produce real files.
            filename: config.isEnvProduction
              ? 'static/js/[name].[contenthash:8].js'
              : config.isEnvDevelopment && 'static/js/bundle.js',
            // There are also additional JS chunk files if you use code splitting.
            chunkFilename: config.isEnvProduction
              ? 'static/js/[name].[contenthash:8].chunk.js'
              : config.isEnvDevelopment && 'static/js/[name].chunk.js',
            // We inferred the "public path" (such as / or /my-project) from homepage.
            // We use "/" in development.
            publicPath: config.publicPath,
            // Point sourcemap entries to original disk location (format as URL on Windows)
            devtoolModuleFilenameTemplate: config.isEnvProduction
              ? info =>
                  path
                    .relative(paths.appSrc, info.absoluteResourcePath)
                    .replace(/\\/g, '/')
              : config.isEnvDevelopment &&
                (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
        });
    });
}





