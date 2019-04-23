const paths = require('../../paths');
module.exports = function (ruleHooks) {
    ruleHooks.for('eslint').tapAsync('eslint', (rules, config, callback) => {
        callback(null, rules.concat({
            test: /\.(js|mjs|jsx)$/,
            enforce: 'pre',
            use: [
                {
                    options: {
                        formatter: require.resolve('react-dev-utils/eslintFormatter'),
                        eslintPath: require.resolve('eslint'),
                        
                    },
                    loader: require.resolve('eslint-loader'),
                },
            ],
            include: paths.appSrc,
        }));
    });
}

