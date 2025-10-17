import { PortalProvider } from '@gorhom/portal';
import * as Sentry from '@sentry/react-native';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { algoliasearch } from 'algoliasearch';
import { AppContext } from 'contexts/AppContext';
import { useI18n } from 'core/hooks/usei18n';
import { _retrieveLocalStorageItem } from 'core/utils/localStorage';
import ErrorLogger from 'ErrorLogger';
import RootStackNavigator from 'navigators/RootStackNavigator';
import React from 'react';
import { InstantSearch } from 'react-instantsearch-core';
import config from 'react-native-config';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import aa from 'search-insights';

Sentry.init({
  enabled: !__DEV__,
  dsn: config.SENTRY_DSN || '',
  environment: config.APP_ENV || 'development',
  tracesSampleRate: 1.0,
  _experiments: {
    profilesSampleRate: 1.0
  }
});

// eslint-disable-next-line react-hooks/rules-of-hooks
const { init } = useI18n();

init();

const queryCache = new QueryCache({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess: async (success: any, query) => {
    const token = await _retrieveLocalStorageItem('UserToken');

    if (token && typeof success === 'undefined') {
      query.fetch();
    }
  }
});

const MAX_RETRY = 2;

const queryClient = new QueryClient({
  queryCache,
  defaultOptions: {
    queries: {
      retry: MAX_RETRY
    }
  }
});

// Default Algolia credentials for development (SIT environment)
const DEFAULT_ALGOLIA_APPID = '9O35FH7LWB';
const DEFAULT_ALGOLIA_APIKEY = 'a80ad6cca4e0866c745d747bdd6512cf';
const DEFAULT_ALGOLIA_INDEX_NAME = 'test_sparkle_products';

const appIdAlgolia = config.ALGOLIA_APPID || DEFAULT_ALGOLIA_APPID;
const appKeyAlgolia = config.ALGOLIA_APIKEY || DEFAULT_ALGOLIA_APIKEY;

if (appIdAlgolia && appKeyAlgolia) {
  aa('init', {
    appId: appIdAlgolia,
    apiKey: appKeyAlgolia
  });
}

export const searchClient = algoliasearch(appIdAlgolia, appKeyAlgolia);

const App = () => {
  return (
    <ErrorLogger>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <KeyboardProvider statusBarTranslucent>
            <AppContext>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <PortalProvider>
                  <InstantSearch
                    searchClient={searchClient}
                    indexName={config.ALGOLIA_INDEX_NAME || DEFAULT_ALGOLIA_INDEX_NAME}
                    future={{ preserveSharedStateOnUnmount: true }}
                    insights
                  >
                    <RootStackNavigator />
                  </InstantSearch>
                </PortalProvider>
              </GestureHandlerRootView>
            </AppContext>
          </KeyboardProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorLogger>
  );
};

export default App;
