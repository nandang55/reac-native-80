import { RouteProp, useRoute } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, Linking, SafeAreaView, StyleSheet } from 'react-native';
import RNWebView, { WebView } from 'react-native-webview';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    margin: 0
  },
  webview: {
    marginTop: 20
  }
});

type WebViewScreenRouteProps = RouteProp<RootStackParamList, 'WebView'>;

const WebViewScreen = () => {
  const route = useRoute<WebViewScreenRouteProps>();
  const ref = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  // eslint-disable-next-line camelcase
  const { uri, cancel_url, return_url } = route.params;

  const queryClient = useQueryClient();

  const handleNavigation = (url: string) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      }
    });
  };

  const backToApp = () => {
    handleNavigation(cancel_url);
    queryClient.invalidateQueries(['useGetOrderDetail']);
    queryClient.invalidateQueries(['useGetCartList']);
    queryClient.invalidateQueries(['useGetCountCart']);
    queryClient.invalidateQueries(['useGetOrderList']);
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      canGoBack ? ref.current?.goBack() : backToApp();

      return true;
    });

    return () => backHandler.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleNavigation]);

  return (
    <SafeAreaView style={styles.container}>
      <RNWebView
        source={{ uri: uri }}
        ref={ref}
        style={styles.webview}
        onNavigationStateChange={(navState) => {
          setCanGoBack(navState.canGoBack);

          if (navState.url.includes(return_url)) {
            handleNavigation(return_url);
          }

          if (navState.url.includes(cancel_url)) {
            backToApp();
          }
        }}
      />
    </SafeAreaView>
  );
};

export default WebViewScreen;
