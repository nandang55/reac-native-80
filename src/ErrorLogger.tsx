import * as Sentry from '@sentry/react-native';
import React from 'react';
import config from 'react-native-config';

const sentryProperties: Sentry.ReactNativeOptions = {
  // TODO: sentry only enable when _PROD_ environment
  // enabled: config.APP_ENV === '_PROD_',
  enabled: !__DEV__,
  dsn: config.SENTRY_DSN,
  environment: config.APP_ENV,
  tracesSampleRate: 1.0,
  _experiments: {
    // profilesSampleRate is relative to tracesSampleRate.
    // Here, we'll capture profiles for 100% of transactions.
    profilesSampleRate: 1.0
  }
};

!__DEV__ && Sentry.init(sentryProperties);

const ErrorLogger = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Sentry.wrap(ErrorLogger);
