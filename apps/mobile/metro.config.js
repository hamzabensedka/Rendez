const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

function resolvePackageDir(pkg, fromDir) {
  return path.dirname(require.resolve(`${pkg}/package.json`, { paths: [fromDir] }));
}

const expoRoot = resolvePackageDir('expo', workspaceRoot);
const reactNativeRoot = resolvePackageDir('react-native', workspaceRoot);

/**
 * Hoisted node_modules can win with an ancient copy (Expo 46 / RN 0.69)
 * over the SDK 54 nested package. Pin those names to the real copies.
 */
const pinnedPackages = {
  'react-devtools-core': resolvePackageDir('react-devtools-core', reactNativeRoot),
  'expo-modules-core': resolvePackageDir('expo-modules-core', expoRoot),
  'expo-file-system': resolvePackageDir('expo-file-system', expoRoot),
  'expo-asset': resolvePackageDir('expo-asset', expoRoot),
  'expo-keep-awake': resolvePackageDir('expo-keep-awake', expoRoot),
};

for (const [name, dir] of Object.entries(pinnedPackages)) {
  const version = require(path.join(dir, 'package.json')).version;
  console.log(`[metro] ${name}@${version} -> ${dir}`);
}

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

// Do not watch the whole monorepo. On exFAT (D:), Metro's fallback watcher
// times out if it has to fs.watch every folder under node_modules / graphify-out.
config.watchFolders = [
  path.resolve(workspaceRoot, 'packages/shared'),
  path.resolve(workspaceRoot, 'packages/ui'),
];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

config.resolver.disableHierarchicalLookup = true;

config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  ...pinnedPackages,
};

const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const pinName = Object.keys(pinnedPackages).find(
    (name) => moduleName === name || moduleName.startsWith(`${name}/`)
  );

  if (pinName) {
    return {
      type: 'sourceFile',
      filePath: require.resolve(moduleName, {
        paths: [pinnedPackages[pinName]],
      }),
    };
  }

  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

config.transformer.getTransformOptions = async () => ({
  transform: {
    inlineRequires: true,
  },
});

module.exports = config;
