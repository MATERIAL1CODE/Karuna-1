const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configure resolver to handle native-only modules on web
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Alias native-only modules to empty modules when building for web
config.resolver.alias = {
  ...(config.resolver.alias || {}),
  // Handle react-native-maps native imports on web
  'react-native/Libraries/Utilities/codegenNativeCommands': require.resolve('./web-stubs/codegenNativeCommands.js'),
  'react-native/Libraries/Utilities/codegenNativeComponent': require.resolve('./web-stubs/codegenNativeComponent.js'),
};

// Ensure proper module resolution
config.resolver.sourceExts = [...config.resolver.sourceExts, 'jsx', 'js', 'ts', 'tsx', 'cjs'];

// Firebase/Supabase compatibility fixes for Expo SDK 53
config.resolver.unstable_enablePackageExports = false;

module.exports = config;