const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add resolver configuration for web platform
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Disable hierarchical lookup to enforce stricter alias resolution
config.resolver.disableHierarchicalLookup = true;

// Add alias for react-native-maps and native utilities on web
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native-maps': path.resolve(__dirname, 'web-stubs/react-native-maps.js'),
  'react-native/Libraries/Utilities/codegenNativeCommands': path.resolve(__dirname, 'web-stubs/codegenNativeCommands.js'),
  'react-native/Libraries/Utilities/codegenNativeComponent': path.resolve(__dirname, 'web-stubs/codegenNativeComponent.js'),
};

// Platform-specific resolver
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Additional resolver options for better web compatibility
config.resolver.sourceExts = [...config.resolver.sourceExts, 'web.js', 'web.ts', 'web.tsx'];

module.exports = config;