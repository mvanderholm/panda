const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

function withRNFirebaseStaticFramework(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let podfile = fs.readFileSync(podfilePath, 'utf8');

      // Tell @react-native-firebase pods to build as static libraries
      if (!podfile.includes('$RNFirebaseAsStaticFramework')) {
        podfile = '$RNFirebaseAsStaticFramework = true\n' + podfile;
      }

      // Allow non-modular includes in framework modules — required because RNFBApp
      // (Objective-C) includes React-Core headers that are not modular, which becomes
      // a hard error when use_frameworks! :linkage => :static is active.
      // Insert into the existing post_install block (CocoaPods ignores extra blocks).
      if (!podfile.includes('CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES')) {
        podfile = podfile.replace(
          /([ \t]*)(react_native_post_install\(installer[^\n]*\n)/,
          (match, indent, line) =>
            indent + line +
            `${indent}installer.pods_project.targets.each do |target|\n` +
            `${indent}  target.build_configurations.each do |build_config|\n` +
            `${indent}    build_config.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'\n` +
            `${indent}  end\n` +
            `${indent}end\n`
        );
      }

      fs.writeFileSync(podfilePath, podfile);
      return config;
    },
  ]);
}

module.exports = withRNFirebaseStaticFramework;
