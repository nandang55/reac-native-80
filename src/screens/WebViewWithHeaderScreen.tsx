import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Icon } from 'components/Icon';
import { Text } from 'components/Text';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RNWebView, { WebView } from 'react-native-webview';
import colors from 'styles/colors';

type WebViewWithHeaderScreenProps = StackNavigationProp<RootStackParamList>;
type WebViewWithHeaderScreenRouteProps = RouteProp<RootStackParamList, 'WebViewWithHeader'>;

const WebViewWithHeaderScreen = () => {
  const navigation = useNavigation<WebViewWithHeaderScreenProps>();
  const route = useRoute<WebViewWithHeaderScreenRouteProps>();
  const insets = useSafeAreaInsets();
  const ref = useRef<WebView>(null);

  const { uri } = route.params;

  const [currentUrl, setCurrentUrl] = useState(uri);
  const [canGoBack, setCanGoBack] = useState(false);

  const handleBackPress = useCallback(() => {
    if (canGoBack && ref.current) {
      ref.current.goBack();
    } else {
      navigation.goBack();
    }
    return true;
  }, [canGoBack, navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, [handleBackPress]);

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          backgroundColor: colors.light.whiteSolid,
          flexDirection: 'row',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: colors.dark.solitude,
          gap: 16
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size="24" color={colors.dark.charcoal} />
        </TouchableOpacity>
        <View style={{ gap: 4, flex: 1 }}>
          <Text
            label="SriCandy"
            variant="medium"
            color={colors.dark.charcoal}
            fontWeight="semi-bold"
          />
          <Text
            label={currentUrl}
            variant="extra-small"
            color={colors.dark.gumbo}
            numberOfLines={1}
          />
        </View>
      </View>
      <RNWebView
        source={{ uri: uri }}
        ref={ref}
        onNavigationStateChange={(navState) => {
          setCurrentUrl(navState.url);
          setCanGoBack(navState.canGoBack);
        }}
      />
    </SafeAreaView>
  );
};

export default WebViewWithHeaderScreen;
