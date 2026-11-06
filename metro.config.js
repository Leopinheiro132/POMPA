const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Permite ao Metro resolver arquivos .wasm usados pelo expo-sqlite na Web
config.resolver.assetExts.push('wasm');

module.exports = config;
