#!/usr/bin/env node
/**
 * Patches for Android build:
 * 1. react-native-worklets and react-native-screens: add -DCMAKE_OBJECT_PATH_MAX=512 for Windows.
 * 2. @react-native/gradle-plugin: set agp to 8.6.0 so app and native modules match (fixes "No variants exist"; 8.6+ required by androidx.core).
 * Run after pnpm install (e.g. via postinstall).
 */
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const nodeModules = path.join(rootDir, 'node_modules');

const packages = [
  {
    name: 'react-native-worklets',
    replace: [
      ['"-DWORKLETS_FEATURE_FLAGS=${WORKLETS_FEATURE_FLAGS}"\n                abiFilters (*reactNativeArchitectures())', '"-DWORKLETS_FEATURE_FLAGS=${WORKLETS_FEATURE_FLAGS}",\n                        "-DCMAKE_OBJECT_PATH_MAX=512"\n                abiFilters (*reactNativeArchitectures())'],
    ],
  },
  {
    name: 'react-native-screens',
    replace: [
      ['"-DANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON"\n            ', '"-DANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON",\n                        "-DCMAKE_OBJECT_PATH_MAX=512"\n            '],
      ['"-DANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON",\n            ', '"-DANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON",\n                        "-DCMAKE_OBJECT_PATH_MAX=512"\n            '],
    ],
  },
];

function findPackageDir(pkgName) {
  const direct = path.join(nodeModules, pkgName);
  if (fs.existsSync(direct)) return direct;
  try {
    const resolved = require.resolve(pkgName + '/package.json', { paths: [rootDir] });
    return path.dirname(resolved);
  } catch {
    return null;
  }
}

function patchFile(pkg) {
  const pkgDir = findPackageDir(pkg.name);
  if (!pkgDir) return false;
  const gradlePath = path.join(pkgDir, 'android', 'build.gradle');
  if (!fs.existsSync(gradlePath)) return false;

  let content = fs.readFileSync(gradlePath, 'utf8');
  if (content.includes('CMAKE_OBJECT_PATH_MAX')) return true;

  let changed = false;
  for (const [from, to] of pkg.replace) {
    if (content.includes(from)) {
      content = content.replace(from, to);
      changed = true;
      break;
    }
  }
  if (changed) fs.writeFileSync(gradlePath, content);
  return changed;
}

let ok = 0;
for (const pkg of packages) {
  if (patchFile(pkg)) {
    console.log('[patch-android-cmake-path] Patched', pkg.name);
    ok++;
  }
}

// Align AGP version: React Native plugin uses 8.11.0 but native modules use 8.2.1 → "No variants exist".
const rnGradlePluginDir = path.join(nodeModules, '@react-native', 'gradle-plugin');
const libsToml = path.join(rnGradlePluginDir, 'gradle', 'libs.versions.toml');
if (fs.existsSync(libsToml)) {
  let toml = fs.readFileSync(libsToml, 'utf8');
  const agpMatch = toml.match(/agp = "([^"]+)"/);
  if (agpMatch && agpMatch[1] !== '8.6.0') {
    toml = toml.replace(/agp = "[^"]+"/, 'agp = "8.6.0"');
    fs.writeFileSync(libsToml, toml);
    console.log('[patch-android-cmake-path] Patched @react-native/gradle-plugin AGP to 8.6.0');
    ok++;
  }
}

if (ok > 0) {
  console.log('[patch-android-cmake-path] Applied', ok, 'patch(es).');
}
