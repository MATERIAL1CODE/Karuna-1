const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add resolver configuration for web platform
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add alias for react-native-maps on web
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native-maps': path.resolve(__dirname, 'web-stubs/react-native-maps.js'),
};

// Platform-specific resolver
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;