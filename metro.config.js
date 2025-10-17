const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const defaultSourceExts = require('metro-config/src/defaults/defaults').sourceExts;
const defaultAssetExts = require('metro-config/src/defaults/defaults').assetExts;
const {
  createSentryMetroSerializer
} = require('@sentry/react-native/dist/js/tools/sentryMetroSerializer');

const { withSentryConfig } = require('@sentry/react-native/metro');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */

module.exports = withSentryConfig(
  mergeConfig(getDefaultConfig(__dirname), {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true
        }
      })
    },
    resolver: {
      assetExts: defaultAssetExts.filter((ext) => ext !== 'svg'),
      sourceExts: [...defaultSourceExts, 'svg'],
      // Mock react-dom for React Native (required by React Query v4)
      extraNodeModules: {
        'react-dom': require.resolve('./__mocks__/react-dom.js')
      }
    },
    serializer: {
      customSerializer: createSentryMetroSerializer()
    }
  })
);
