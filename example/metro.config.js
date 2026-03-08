const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '..');

const libraryEntry = path.join(monorepoRoot, 'src', 'index.ts');

const FORCE_FROM_EXAMPLE = ['react', 'react-native'];

/** @type {import('metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

config.watchFolders = [...(config.watchFolders || []), monorepoRoot];

const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react-native-aura-select') {
    return { type: 'sourceFile', filePath: libraryEntry };
  }
  if (FORCE_FROM_EXAMPLE.includes(moduleName)) {
    const exampleOrigin = path.join(projectRoot, 'app', 'index.tsx');
    const modifiedContext = { ...context, originModulePath: exampleOrigin };
    return defaultResolveRequest
      ? defaultResolveRequest(modifiedContext, moduleName, platform)
      : context.resolveRequest(modifiedContext, moduleName, platform);
  }
  return defaultResolveRequest
    ? defaultResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = config;