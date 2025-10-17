// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import {
  createNavigationContainerRef,
  LinkingOptions,
  NavigationContainer,
  NavigatorScreenParams,
  PathConfigMap
} from '@react-navigation/native';
import {
  createStackNavigator,
  HeaderStyleInterpolators,
  StackCardInterpolationProps,
  StackNavigationOptions,
  TransitionSpecs
} from '@react-navigation/stack';
import { BackButton } from 'components/BackButton';
import { NewVersionConfirmation } from 'components/Confirmation';
import { Loading } from 'components/Loading';
import { ModalToast } from 'components/Modal';
import { LoadingContext } from 'contexts/AppLoadingContext';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import { _retrieveLocalStorageItem, _storeLocalStorageItem } from 'core/utils/localStorage';
import useAppState from 'hooks/useAppState';
import useCheckConnection from 'hooks/useCheckConnection';
import useGetAppVersion from 'hooks/useGetAppVersion';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Platform } from 'react-native';
import config from 'react-native-config';
import { NotificationClickEvent, OneSignal } from 'react-native-onesignal';
import AccountConfigEnv from 'screens/AccountConfigEnv';
import CloseAccountScreen from 'screens/CloseAccountScreen';
import ContactUsScreen from 'screens/ContactUsScreen';
import IntroScreen from 'screens/IntroScreen';
import LoadingScreen from 'screens/LoadingScreen';
import NoInternetScreen from 'screens/NoInternetScreen';
import NotificationsScreen from 'screens/NotificationsScreen';
import PaypalScreen from 'screens/PaypalScreen';
import WebViewScreen from 'screens/WebViewScreen';
import WebViewWithHeaderScreen from 'screens/WebViewWithHeaderScreen';
import colors from 'styles/colors';

import AccountStackNavigator, { AccountStackParamList } from './AccountStackNavigator';
import AddressStackNavigator, { AddressStackParamList } from './AddressStackNavigator';
import AuthenticationStackNavigator, {
  AuthenticationStackParamList
} from './AuthenticationStackNavigator';
import CartStackNavigator, { CartStackParamList } from './CartStackNavigator';
import { CategoriesStackParamList } from './CategoriesStackNavigator';
import CheckoutStackNavigator, { CheckoutStackParamList } from './CheckoutStackNavigator';
import { HomeStackParamList } from './HomeStackNavigator';
import MainBottomTabNavigator, { MainBottomTabParamList } from './MainBottomTabNavigator';
import OrderStackNavigator, { OrderStackParamList } from './OrderStackNavigator';
import ProductStackNavigator, { ProductStackParamList } from './ProductStackNavigator';
import SearchStackNavigation, { SearchStackPropsNavigator } from './SearchStackNavigator';
import WishlistStackNavigation from './WishlistStackNavigator';

export type RootStackParamList = {
  AccountStack: NavigatorScreenParams<AccountStackParamList>;
  CartStack: NavigatorScreenParams<CartStackParamList>;
  OrderStack: NavigatorScreenParams<OrderStackParamList>;
  AuthenticationStack: NavigatorScreenParams<AuthenticationStackParamList>;
  ProductStack: NavigatorScreenParams<ProductStackParamList>;
  AddressStack: NavigatorScreenParams<AddressStackParamList>;
  CheckoutStack: NavigatorScreenParams<CheckoutStackParamList>;
  HomeStack?: NavigatorScreenParams<HomeStackParamList>;
  CategoriesStack?: NavigatorScreenParams<CategoriesStackParamList>;
  MenuDrawer: undefined;
  Intro: undefined;
  Loading: undefined;
  // TODO: remove any and configure better type navigation in ProductDetailScreen
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  MainBottomTabNavigator: NavigatorScreenParams<MainBottomTabParamList> | any;
  NoInternet: undefined;
  Notifications: undefined;
  WebView: { uri: string; return_url: string; cancel_url: string };
  WebViewWithHeader: { uri: string };
  Paypal: { id: string };
  CloseAccount: undefined;
  ENVConfiguration: undefined;
  ContactUs: undefined;
  SearchStack: NavigatorScreenParams<SearchStackPropsNavigator>;
  WishlistStack: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function reset(name: string, params?: object) {
  navigationRef.current?.reset({
    index: 0,
    routes: [{ name: name, params: params }]
  });
}

export function getCurrentRoute() {
  return navigationRef.current?.getCurrentRoute();
}

const SlideTransition: StackNavigationOptions = {
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: TransitionSpecs.TransitionIOSSpec,
    close: TransitionSpecs.TransitionIOSSpec
  },
  headerStyleInterpolator: HeaderStyleInterpolators.forFade,
  cardStyleInterpolator: ({ current, layouts }: StackCardInterpolationProps) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0]
            })
          }
        ]
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.5]
        })
      }
    };
  }
};

const screens: PathConfigMap<Partial<RootStackParamList>> = {
  AccountStack: {
    screens: {
      ChangeLanguage: {
        path: 'changeLanguage'
      }
    }
  },
  ProductStack: {
    screens: {
      ProductDetail: {
        path: 'product-detail'
      }
    }
  },
  OrderStack: {
    screens: {
      OrderDetail: {
        path: 'OrderDetail/:id/:source?'
      }
    }
  },
  Paypal: {
    path: 'paypal-success/:id/:source?'
  }
};

const linking: LinkingOptions<Partial<RootStackParamList>> = {
  prefixes: [`${config.DEEPLINK_PREFIX}://`],
  config: {
    screens
  }
};

const RootStackNavigator = () => {
  const { isConnected } = useCheckConnection();
  const { i18n, t } = useTranslation(['notification', 'common']);

  const [isShowNewVersion, setIsShowNewVersion] = useState(false);
  const [isMandatory, setIsMandatory] = useState(false);
  const { loading } = useContext(LoadingContext);
  const { isShowToast, setIsShowToast, toastMessage, type, icon } = useContext(ModalToastContext);
  const { appState } = useAppState({ onForeground: () => refetchAppVersion() });

  const setUpdateNotification = async (version: string) =>
    await _storeLocalStorageItem({
      storageKey: 'UpdateNotification',
      storageValue: version
    });
  const retrieveUpdateNotification = async () =>
    await _retrieveLocalStorageItem('UpdateNotification');

  const { data: dataAppVersion, refetch: refetchAppVersion } = useGetAppVersion({
    platform: Platform.OS,
    params: { current_version: config.APP_VERSION },
    options: {
      enabled: appState === 'active',
      onSuccess: async (response) => {
        const updateNotification = await retrieveUpdateNotification();

        if (response.error) return;

        const { is_mandatory, is_notify } = response.data;
        setIsMandatory(is_mandatory);

        if (is_notify) {
          const shouldShowNotification =
            is_mandatory || !updateNotification || updateNotification !== config.APP_VERSION;
          setIsShowNewVersion(shouldShowNotification);
        }
      }
    }
  });

  useEffect(() => {
    const retrieveLocalStorage = async () => {
      const language = await _retrieveLocalStorageItem('I18nLang');
      if (language) {
        i18n.changeLanguage(language);
      }
    };
    retrieveLocalStorage();

    // Initialize OneSignal with fallback for development
    const oneSignalAppId = config.ONE_SIGNAL_APP_ID || '88092d7e-088a-456a-aa73-95357fa74a79';
    OneSignal.initialize(oneSignalAppId);
    OneSignal.Notifications.requestPermission(false);
    const onNotificationClicked = (event: NotificationClickEvent) => {
      const { result } = event;

      if (result.url) {
        Linking.canOpenURL(result.url).then((supported) => {
          if (supported) {
            Linking.openURL(result.url as string);
          }
        });
      }
    };

    OneSignal.Notifications.addEventListener('click', onNotificationClicked);

    return () => {
      OneSignal.Notifications.removeEventListener('click', onNotificationClicked);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isConnected) {
      navigationRef.navigate('NoInternet');
    }
  }, [isConnected]);

  return (
    <>
      <Loading visible={loading} size="large" />
      <NewVersionConfirmation
        isVisible={isShowNewVersion}
        isMandatory={isMandatory}
        title={dataAppVersion?.data.content?.title || 'New Version Update!'}
        description={
          dataAppVersion?.data.content?.message ||
          'The new version of SriCandy is updated with FAQ section for quick answers! All the important info you need, now in one place.'
        }
        onPressClose={() => {
          setUpdateNotification(config.APP_VERSION);
          setIsShowNewVersion(false);
        }}
        onPressUpdate={() => {
          Linking.openURL(dataAppVersion?.data.link || '');
        }}
      />
      <ModalToast
        isVisible={isShowToast}
        message={toastMessage}
        type={type}
        onCloseModal={() => setIsShowToast(false)}
        icon={icon}
      />
      <NavigationContainer ref={navigationRef} linking={linking}>
        <Stack.Navigator
          initialRouteName="Loading"
          screenOptions={{
            headerShown: false,
            headerStyle: {
              backgroundColor: colors.primary,
              shadowColor: colors.dark.blackSolid,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.18,
              shadowRadius: 8,
              elevation: 14
            },
            headerTintColor: colors.dark.blackCoral,
            headerTitleAlign: 'left',
            cardOverlayEnabled: true,
            ...SlideTransition
          }}
        >
          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen name="Intro" component={IntroScreen} />
          <Stack.Screen name="MainBottomTabNavigator" component={MainBottomTabNavigator} />
          <Stack.Screen name="CartStack" component={CartStackNavigator} />
          <Stack.Screen name="OrderStack" component={OrderStackNavigator} />
          <Stack.Screen name="AccountStack" component={AccountStackNavigator} />
          <Stack.Screen name="ProductStack" component={ProductStackNavigator} />
          <Stack.Screen name="AuthenticationStack" component={AuthenticationStackNavigator} />
          <Stack.Screen name="AddressStack" component={AddressStackNavigator} />
          <Stack.Screen name="CheckoutStack" component={CheckoutStackNavigator} />
          <Stack.Screen name="NoInternet" component={NoInternetScreen} />
          <Stack.Screen
            name="CloseAccount"
            component={CloseAccountScreen}
            options={{
              headerShown: true,
              headerLeft: () => null,
              title: 'Close Account'
            }}
          />
          <Stack.Screen
            name="Paypal"
            component={PaypalScreen}
            options={{
              headerShown: true,
              headerLeft: () => null,
              title: 'Payment'
            }}
          />
          <Stack.Screen name="WebView" component={WebViewScreen} />
          <Stack.Screen name="WebViewWithHeader" component={WebViewWithHeaderScreen} />
          <Stack.Screen
            name="Notifications"
            options={{
              headerShown: true,
              headerTitleStyle: { marginLeft: -20 },
              headerLeft: () => <BackButton onPress={() => navigationRef.goBack()} />,
              title: t('notification:title')
            }}
            component={NotificationsScreen}
          />
          <Stack.Screen
            name="ENVConfiguration"
            options={{
              headerShown: true,
              headerTitleStyle: { marginLeft: -20 },
              headerLeft: () => <BackButton onPress={() => navigationRef.goBack()} />,
              title: 'ENV Configuration'
            }}
            component={AccountConfigEnv}
          />
          <Stack.Screen
            name="ContactUs"
            options={{
              headerShown: true,
              headerTitleStyle: { marginLeft: -20 },
              headerLeft: () => <BackButton onPress={() => navigationRef.goBack()} />,
              title: 'Contact Us'
            }}
            component={ContactUsScreen}
          />
          <Stack.Screen name="SearchStack" component={SearchStackNavigation} />
          <Stack.Screen name="WishlistStack" component={WishlistStackNavigation} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default RootStackNavigator;
