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
        const callStart = podfile.indexOf('react_native_post_install(');
        if (callStart !== -1) {
          // Detect indentation of the react_native_post_install line
          let lineStart = callStart;
          while (lineStart > 0 && podfile[lineStart - 1] !== '\n') lineStart--;
          const indent = podfile.slice(lineStart, callStart).match(/^([ \t]*)/)[1];

          // Find end of the call by counting balanced parens (handles multi-line)
          let depth = 0;
          let callEnd = callStart;
          for (let i = callStart; i < podfile.length; i++) {
            if (podfile[i] === '(') depth++;
            else if (podfile[i] === ')') {
              depth--;
              if (depth === 0) { callEnd = i + 1; break; }
            }
          }
          // Advance past the rest of the closing line (including newline)
          while (callEnd < podfile.length && podfile[callEnd] !== '\n') callEnd++;
          callEnd++;

          const clangFix =
            `${indent}installer.pods_project.targets.each do |target|\n` +
            `${indent}  target.build_configurations.each do |build_config|\n` +
            `${indent}    build_config.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'\n` +
            `${indent}  end\n` +
            `${indent}end\n`;

          podfile = podfile.slice(0, callEnd) + clangFix + podfile.slice(callEnd);
        }
      }

      fs.writeFileSync(podfilePath, podfile);
      return config;
    },
  ]);
}

module.exports = withRNFirebaseStaticFramework;
