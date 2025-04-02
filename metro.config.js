const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname)

// nativewind
const updatedConfig = withNativeWind(config, { input: './global.css' });

// drizzle
updatedConfig.resolver.sourceExts.push('sql')

module.exports = updatedConfig;