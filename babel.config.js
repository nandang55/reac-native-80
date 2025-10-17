module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json'
        ],
        alias: {
          '@context': './src/contexts',
          '@asset': './src/assets',
          '@constant': './src/constant',
          '@util': './src/utils',
          '@screen': './src/screens',
          '@component': './src/components',
          '@config': './src/config',
          '@layout': './src/components/layouts',
          '@mocks': './src/mocks',
          '@model': './src/models',
          '@navigator': './src/navigators',
          '@i18n': './src/i18n',
          '@core': './src/core',
          '@interface': './src/interfaces',
          '@hook': './src/hooks',
          '@style': './src/styles'
        }
      }
    ],
    'react-native-reanimated/plugin'
  ]
};
