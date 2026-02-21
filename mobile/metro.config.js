const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "..");

const config = getDefaultConfig(projectRoot);

// So Metro can see and resolve the symlinked "shared" package (file:../shared)
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];
// Required so Metro respects shared/package.json "exports" (e.g. shared/services/api -> .ts)
config.resolver.unstable_enablePackageExports = true;

// Force a single copy of React + React Query so shared hooks use the app's instances (fixes Invalid hook call)
config.resolver.extraNodeModules = {
  react: path.resolve(projectRoot, "node_modules/react"),
  "react-native": path.resolve(projectRoot, "node_modules/react-native"),
  "@tanstack/react-query": path.resolve(projectRoot, "node_modules/@tanstack/react-query"),
};

module.exports = config;
