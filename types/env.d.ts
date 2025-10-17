declare module 'react-native-config' {
    interface AppEnv {
      APP_ENV: '_SIT_' | '_STAGING_' | '_PROD_';
      APP_ID: 'kopcermat-app';
      APP_ID_SUFFIX: '.sit';
      APP_WHITELABEL: 'SRICANDY';
      APP_LABEL: 'SRICANDY';
      APP_SERVICE_URL: 'https://sit-sparkle-service-api.gajicermat.co';
      APP_REGION: 'sg';
      DEEPLINK_PREFIX: 'sparkle-mobile';
      DYNAMIC_LINK: '';
      ONE_SIGNAL_APP_ID: '88092d7e-088a-456a-aa73-95357fa74a79';
      OTP_TYPE: 'wa';
      SENTRY_DSN: '';
      SENTRY_DEFAULTS_PROJECT: '';
      SENTRY_DEFAULTS_ORG: '';
      SENTRY_DEFAULTS_URL: '';
      SENTRY_AUTH_TOKEN: '';
      APP_VERSION: '';
      COMMIT_ID: '';
      ALGOLIA_APPID: '9O35FH7LWB';
      ALGOLIA_APIKEY: 'a80ad6cca4e0866c745d747bdd6512cf';
      ALGOLIA_INDEX_NAME: 'test_sparkle_products';
      ALGOLIA_INDEX_NAME_ASC: 'test_sparkle_products_selling_price_asc';
      ALGOLIA_INDEX_NAME_DSC: 'sit_sparkle_products_selling_price_dsc';
      ALGOLIA_INDEX_NAME_LATEST: 'sit_sparkle_products_selling_price_latest';
      ALGOLIA_INDEX_NAME_QUERY_SUGGESTIONS: 'test_sparkle_suggestions';
    }
  
    const Config: AppEnv;
  
    export default Config;
  }
  