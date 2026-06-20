const { withAndroidManifest } = require('@expo/config-plugins');

function withRemoveAdIdPermission(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    const permissions = manifest['uses-permission'] || [];

    const alreadyRemoved = permissions.some(
      (p) =>
        p.$?.['android:name'] === 'com.google.android.gms.permission.AD_ID' &&
        p.$?.['tools:node'] === 'remove'
    );

    if (!alreadyRemoved) {
      manifest['uses-permission'] = [
        ...permissions,
        { $: { 'android:name': 'com.google.android.gms.permission.AD_ID', 'tools:node': 'remove' } },
      ];
    }

    return config;
  });
}

module.exports = withRemoveAdIdPermission;
