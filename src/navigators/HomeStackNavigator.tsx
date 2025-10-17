import {
  createStackNavigator,
  HeaderStyleInterpolators,
  StackNavigationOptions,
  TransitionSpecs
} from '@react-navigation/stack';
import LogoHorizontalGradientGray from 'assets/images/Logo/horizontal-logo-gradient-gray.svg';
import { BackButton } from 'components/BackButton';
import { BadgeComponent } from 'components/Badge';
import Hamburger from 'components/Hamburger';
import { AccountContext } from 'contexts/AppAccountContext';
import useBranchIO from 'hooks/useBranchIO';
import useGetCountCart from 'hooks/useGetCountCart';
import useGetCountWishlist from 'hooks/useGetCountWishlist';
import { useGetNotificationCount } from 'hooks/useGetNotificationCount';
import React, { useContext, useEffect, useState } from 'react';
import { BackHandler, Dimensions, Platform, View } from 'react-native';
import CategoryCatalogueScreen from 'screens/CategoryCatalogueScreen';
import CollectionCatalogueScreen from 'screens/CollectionCatalogueScreen';
import HomeScreen from 'screens/HomeScreen';
import LatestCollections from 'screens/LatestCollections';
import MenuDrawerScreen from 'screens/MenuDrawerScreen';
import { SearchSuggestionScreen } from 'screens/SearchSuggestionScreen';
import colors from 'styles/colors';

import { navigationRef } from './RootStackNavigator';

export type HomeStackParamList = {
  Home: undefined;
  MenuDrawer: undefined;
  SearchSuggestion: { from?: string } | undefined;
  CategoryCatalogue: { title: string; id: string; from?: string };
  CollectionCatalogue: { title: string; id: string; from?: string };
  LatestCollections: undefined;
};

const Stack = createStackNavigator<HomeStackParamList>();

const { width } = Dimensions.get('window');

const ASPECT_RATIO = 360 / 56;
const HEADER_WIDTH = width * 1.6;
const HEADER_HEIGHT = HEADER_WIDTH / ASPECT_RATIO;

const HomeStackNavigator = () => {
  useBranchIO();
  const { state: accountState } = useContext(AccountContext);

  const { data: dataNotification, isSuccess: isDataNotificationSuccess } =
    useGetNotificationCount();
  const { data: dataCart, isSuccess: isDataCartSuccess } = useGetCountCart({
    options: { enabled: !!accountState.account }
  });
  const { data: dataWishlist, isSuccess: isDataWishlistSuccess } = useGetCountWishlist({
    options: { enabled: !!accountState.account }
  });

  const [active, setActive] = useState(false);

  const MenuOptions: StackNavigationOptions = {
    headerShown: true,
    headerTitle: () => null,
    headerLeft: () => (
      <View
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,
            marginLeft: 16
          }
        ]}
      >
        <Hamburger
          onPress={() => {
            const newActive = !active;
            setActive(newActive);
            newActive ? navigationRef.navigate('MenuDrawer') : navigationRef.goBack();
          }}
          active={active}
          color={colors.dark.color1}
        />
        <LogoHorizontalGradientGray width="124px" height="32px" style={{ margin: 'auto' }} />
      </View>
    ),
    headerMode: 'float',
    transitionSpec: {
      open: TransitionSpecs.TransitionIOSSpec,
      close: TransitionSpecs.TransitionIOSSpec
    },
    headerStyleInterpolator: HeaderStyleInterpolators.forNoAnimation,
    headerRight: () => (
      <View style={{ flexDirection: 'row', marginRight: 16, gap: 8 }}>
        <BadgeComponent
          total={dataWishlist?.data.count || 0}
          isSuccess={isDataWishlistSuccess}
          name="wishlist"
          size="24"
          color={colors.dark.color1}
          onPress={() => navigationRef.navigate('WishlistStack')}
        />
        <BadgeComponent
          total={dataCart?.data.count || 0}
          isSuccess={isDataCartSuccess}
          name="cart"
          size="24"
          color={colors.dark.color1}
          onPress={() => navigationRef.navigate('CartStack', { screen: 'Cart' })}
        />
        <BadgeComponent
          total={dataNotification?.count || 0}
          isSuccess={isDataNotificationSuccess}
          name="bell"
          size="24"
          color={colors.dark.color1}
          onPress={() => navigationRef.navigate('Notifications')}
        />
      </View>
    )
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (navigationRef.canGoBack()) {
        setActive(false);
        navigationRef.goBack();
      } else {
        BackHandler.exitApp();
      }
      return true;
    });

    return () => backHandler.remove();
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
          shadowColor: colors.dark.blackSolid,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.18,
          shadowRadius: 8,
          elevation: 14,
          ...(Platform.OS === 'ios' && { height: HEADER_HEIGHT })
        },
        headerTitleAlign: 'left',
        headerTintColor: colors.dark.blackCoral,
        headerTitleStyle: {
          fontFamily: 'Poppins-SemiBold',
          fontSize: 18,
          color: colors.dark.blackCoral,
          marginLeft: -16,
          marginTop: Platform.OS === 'ios' ? 0 : 5
        },
        headerTitleAllowFontScaling: false,
        headerBackTitleVisible: false,
        headerShadowVisible: true
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={MenuOptions}
        listeners={{
          focus: () => {
            if (active) {
              setActive(false);
            }
          }
        }}
      />

      <Stack.Screen
        name="MenuDrawer"
        component={MenuDrawerScreen}
        options={{
          ...MenuOptions,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-layouts.screen.width, 0]
                    })
                  }
                ]
              }
            };
          }
        }}
      />
      <Stack.Screen
        name="SearchSuggestion"
        component={SearchSuggestionScreen}
        options={{
          ...MenuOptions,
          cardStyleInterpolator: ({ current }) => {
            return {
              cardStyle: {
                opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1]
                })
              }
            };
          }
        }}
      />
      <Stack.Screen
        name="CategoryCatalogue"
        component={CategoryCatalogueScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerTitleAllowFontScaling: false,
          headerTitleStyle: { marginLeft: -20 },
          headerLeft: () => <BackButton onPress={() => navigationRef.goBack()} />,
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 16, gap: 8 }}>
              <BadgeComponent
                total={dataWishlist?.data.count || 0}
                isSuccess={isDataWishlistSuccess}
                name="wishlist"
                size="24"
                color={colors.dark.color1}
                onPress={() => navigationRef.navigate('WishlistStack')}
              />
              <BadgeComponent
                total={dataCart?.data.count || 0}
                isSuccess={isDataCartSuccess}
                name="cart"
                size="24"
                color={colors.dark.color1}
                onPress={() => navigationRef.navigate('CartStack', { screen: 'Cart' })}
              />
            </View>
          )
        })}
      />
      <Stack.Screen
        name="CollectionCatalogue"
        component={CollectionCatalogueScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerTitleAllowFontScaling: false,
          headerTitleStyle: { marginLeft: -20 },
          headerLeft: () => <BackButton onPress={() => navigationRef.goBack()} />,
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 16, gap: 8 }}>
              <BadgeComponent
                total={dataWishlist?.data.count || 0}
                isSuccess={isDataWishlistSuccess}
                name="wishlist"
                size="24"
                color={colors.dark.color1}
                onPress={() => navigationRef.navigate('WishlistStack')}
              />
              <BadgeComponent
                total={dataCart?.data.count || 0}
                isSuccess={isDataCartSuccess}
                name="cart"
                size="24"
                color={colors.dark.color1}
                onPress={() => navigationRef.navigate('CartStack', { screen: 'Cart' })}
              />
              <BadgeComponent
                total={dataNotification?.count || 0}
                isSuccess={isDataNotificationSuccess}
                name="bell"
                size="24"
                color={colors.dark.color1}
                onPress={() => navigationRef.navigate('Notifications')}
              />
            </View>
          )
        })}
      />
      <Stack.Screen
        name="LatestCollections"
        options={{
          headerShown: true,
          headerTitleAllowFontScaling: false,
          headerTitleStyle: { marginLeft: -20 },
          headerLeft: () => <BackButton onPress={() => navigationRef.goBack()} />,
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 16, gap: 8 }}>
              <BadgeComponent
                total={dataWishlist?.data.count || 0}
                isSuccess={isDataWishlistSuccess}
                name="wishlist"
                size="24"
                color={colors.dark.color1}
                onPress={() => navigationRef.navigate('WishlistStack')}
              />
              <BadgeComponent
                total={dataCart?.data.count || 0}
                isSuccess={isDataCartSuccess}
                name="cart"
                size="24"
                color={colors.dark.color1}
                onPress={() => navigationRef.navigate('CartStack', { screen: 'Cart' })}
              />
            </View>
          ),
          title: 'Latest Collections'
        }}
        component={LatestCollections}
      />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
