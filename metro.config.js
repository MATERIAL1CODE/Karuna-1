const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configure resolver to handle native-only modules on web
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Ensure proper module resolution
config.resolver.sourceExts = [...config.resolver.sourceExts, 'jsx', 'js', 'ts', 'tsx', 'cjs'];

// Fix for Clerk and other dependencies
config.resolver.unstable_enablePackageExports = false;

// Clear resolver cache to fix InternalBytecode.js issues
config.resetCache = true;

module.exports = config;