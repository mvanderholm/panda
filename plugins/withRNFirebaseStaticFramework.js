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

      // With use_frameworks! :linkage => :static, RNFB Objective-C pods (RNFBApp, etc.)
      // have DEFINES_MODULE = YES from their podspec, which creates a module map.
      // This causes two cascading errors:
      //   1. "non-modular header inside framework module RNFBApp" (React-Core headers)
      //   2. "RCTBridgeModule must be imported from module RNFBApp.RNFBAppModule"
      // Setting DEFINES_MODULE = NO on RNFB* targets removes the module map, making
      // them plain static frameworks that don't enforce modular header rules.
      if (!podfile.includes('RNFB_DEFINES_MODULE_PATCH')) {
        const callStart = podfile.indexOf('react_native_post_install(');
        if (callStart !== -1) {
          let lineStart = callStart;
          while (lineStart > 0 && podfile[lineStart - 1] !== '\n') lineStart--;
          const indent = podfile.slice(lineStart, callStart).match(/^([ \t]*)/)[1];

          // Count balanced parens to handle multi-line calls
          let depth = 0;
          let callEnd = callStart;
          for (let i = callStart; i < podfile.length; i++) {
            if (podfile[i] === '(') depth++;
            else if (podfile[i] === ')') {
              depth--;
              if (depth === 0) { callEnd = i + 1; break; }
            }
          }
          while (callEnd < podfile.length && podfile[callEnd] !== '\n') callEnd++;
          callEnd++;

          const fix =
            `${indent}# RNFB_DEFINES_MODULE_PATCH\n` +
            `${indent}installer.pods_project.targets.each do |target|\n` +
            `${indent}  if target.name.start_with?('RNFB')\n` +
            `${indent}    target.build_configurations.each do |build_config|\n` +
            `${indent}      build_config.build_settings['DEFINES_MODULE'] = 'NO'\n` +
            `${indent}    end\n` +
            `${indent}  end\n` +
            `${indent}end\n`;

          podfile = podfile.slice(0, callEnd) + fix + podfile.slice(callEnd);
        }
      }

      fs.writeFileSync(podfilePath, podfile);
      return config;
    },
  ]);
}

module.exports = withRNFirebaseStaticFramework;
