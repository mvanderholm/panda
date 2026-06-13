const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

function withRNFirebaseStaticFramework(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let podfile = fs.readFileSync(podfilePath, 'utf8');
      if (!podfile.includes('$RNFirebaseAsStaticFramework')) {
        podfile = '$RNFirebaseAsStaticFramework = true\n' + podfile;
        fs.writeFileSync(podfilePath, podfile);
      }
      return config;
    },
  ]);
}

module.exports = withRNFirebaseStaticFramework;
