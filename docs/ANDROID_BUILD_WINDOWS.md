# Android build on Windows (path length)

If the Android build fails with **CMake path length**, **ninja: manifest 'build.ninja' still dirty**, or **CreateProcess error=2** on Windows, use these steps.

## What we did in the repo

1. **`.npmrc`** – `node-linker=hoisted` so `node_modules` is flatter and paths are shorter.
2. **Patch** – `react-native-reanimated` is patched to pass `-DCMAKE_OBJECT_PATH_MAX=512` to CMake.
3. **Postinstall script** – `scripts/patch-android-cmake-path.js` runs after `pnpm install` and adds `-DCMAKE_OBJECT_PATH_MAX=512` to `react-native-worklets` and `react-native-screens` Android build.gradle so long paths don’t break the build.

## If the build still fails

### 1. Enable long paths in Windows (recommended)

Run **PowerShell as Administrator** and run:

```powershell
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1
```

Then **restart your machine** (or at least close and reopen the terminal).

### 2. Clean reinstall and rebuild

From the repo root:

```powershell
# Clean Android build cache
cd apps\mobile\android
.\gradlew.bat clean
cd ..\..

# Optional: if paths are still too long, reinstall with a clean node_modules
# Remove-Item -Recurse -Force node_modules
# pnpm install

# Build
cd apps\mobile
npx expo run:android
```

Or from `apps/mobile`:

```powershell
npx expo run:android
```

### 3. Use a shorter project path

Move the project closer to the drive root to shorten paths, for example:

- `C:\dev\planity`
- `C:\p`

Then run `pnpm install` again in the new location and build.
