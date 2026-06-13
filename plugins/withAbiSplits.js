const { withAppBuildGradle } = require('@expo/config-plugins');

function withAbiSplits(config) {
  const abi = process.env.ABI_FILTER;
  if (!abi) return config;

  return withAppBuildGradle(config, (config) => {
    const gradle = config.modResults.contents;
    if (gradle.includes('splits {')) return config; // idempotent

    const splitsBlock = [
      '    splits {',
      '        abi {',
      '            enable true',
      '            reset()',
      `            include "${abi}"`,
      '            universalApk false',
      '        }',
      '    }',
      '',
    ].join('\n');

    config.modResults.contents = gradle.replace(
      /^(android \{)/m,
      `$1\n${splitsBlock}`
    );
    return config;
  });
}

module.exports = withAbiSplits;
