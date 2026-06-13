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
      if (!podfile.includes('CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES')) {
        podfile += `
post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |build_config|
      build_config.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
    end
  end
end
`;
      }

      fs.writeFileSync(podfilePath, podfile);
      return config;
    },
  ]);
}

module.exports = withRNFirebaseStaticFramework;
