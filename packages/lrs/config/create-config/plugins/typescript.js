const paths = require('../../paths');
const ForkTsCheckerWebpackPlugin = require('react-dev-utils/ForkTsCheckerWebpackPlugin');
const typescriptFormatter = require('react-dev-utils/typescriptFormatter');
const resolve = require('resolve');

module.exports = function (ruleHooks) {
    ruleHooks.for('ts').tapAsync('ts', (rules, config, callback) => {
        callback(null, rules.concat(
            // TypeScript type checking
            config.useTypeScript ? new ForkTsCheckerWebpackPlugin({
                typescript: resolve.sync('typescript', {
                    basedir: paths.appNodeModules,
                }),
                async: config.isEnvDevelopment,
                useTypescriptIncrementalApi: true,
                checkSyntacticErrors: true,
                tsconfig: paths.appTsConfig,
                reportFiles: [
                    '**',
                    '!**/*.json',
                    '!**/__tests__/**',
                    '!**/?(*.)(spec|test).*',
                    '!**/src/setupProxy.*',
                    '!**/src/setupTests.*',
                ],
                watch: paths.appSrc,
                silent: true,
                // The formatter is invoked directly in WebpackDevServerUtils during development
                formatter: config.isEnvProduction ? typescriptFormatter : undefined,
            }): []
        ));
    });
}
