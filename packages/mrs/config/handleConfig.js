module.exports = function (config, hooks, projectConfig) {
    // 处理插件
    if (config.plugins) {
        config.plugins.forEach((pluginConfig) => {
            if (typeof pluginConfig == 'string') {
                require(require.resolve(pluginConfig))(projectConfig)(hooks);
            } else {
                require(require.resolve(pluginConfig[0]))(Object.assign(projectConfig, projectConfig[1]))(hooks);
            }
        });
    }
}