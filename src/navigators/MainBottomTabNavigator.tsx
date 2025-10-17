import {
  BottomTabNavigationOptions,
  createBottomTabNavigator
} from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { BackButton } from 'components/BackButton';
import { Icon, IconType } from 'components/Icon';
import { Text } from 'components/Text';
import { AccountContext } from 'contexts/AppAccountContext';
import useAuth from 'hooks/useAuth';
import useGetProfile from 'hooks/useGetProfile';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import { OneSignal } from 'react-native-onesignal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AccountScreen from 'screens/AccountScreen';
import OrderScreen from 'screens/OrderScreen';
import colors from 'styles/colors';

import CategoriesStackNavigator from './CategoriesStackNavigator';
import HomeStackNavigator from './HomeStackNavigator';
import { navigationRef } from './RootStackNavigator';

export type MainBottomTabParamList = {
  HomeStack: undefined;
  CategoriesStack: undefined;
  Order: undefined;
  Account: undefined;
};

const BottomTab = createBottomTabNavigator<MainBottomTabParamList>();

const MainBottomTabNavigator = () => {
  const insets = useSafeAreaInsets();
  const { dispatch, state: accountState } = useContext(AccountContext);
  const { signOut } = useAuth();
  const { t } = useTranslation(['order', 'home', 'account']);
  const { data: dataProfile, isLoading: isLoadingGetProfile } = useGetProfile({
    options: {
      onError: (error) => {
        const res = error.response?.data;
        if (res?.error) {
          signOut();
        }
      }
    }
  });

  useEffect(() => {
    if (!isLoadingGetProfile && dataProfile?.data && dataProfile.data.id) {
      OneSignal.login(dataProfile.data.id);
      dispatch({ type: 'SetAccount', payload: dataProfile.data });
      if (accountState.close) {
        navigationRef.navigate('AccountStack', { screen: 'ProfileDetail' });
        dispatch({ type: 'RemoveCloseAccount' });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataProfile?.data, accountState.close]);

  const screenOptions = ({
    route
  }: {
    route: Readonly<{ key: string; name: keyof MainBottomTabParamList; path?: string | undefined }>;
  }): BottomTabNavigationOptions => {
    const customTabBarIcon = ({ color }: { color: string }) => {
      const menuNameMapper: Record<keyof MainBottomTabParamList, IconType> = {
        HomeStack: 'home',
        CategoriesStack: 'categoriesMenu',
        Order: 'orderDollar',
        Account: 'accountMenu'
      };

      return <Icon size="24" name={menuNameMapper[route.name]} color={color} />;
    };

    const customTabBarLabel = ({ color }: { color: string }) => {
      const menuNameMapper: Record<keyof MainBottomTabParamList, string> = {
        HomeStack: t('home:home'),
        CategoriesStack: t('home:categories'),
        Order: t('order:orders'),
        Account: t('home:account')
      };

      return (
        <Text
          label={menuNameMapper[route.name]}
          color={color === colors.dark.bermudaGrey ? colors.dark.blackCoral : colors.red.newPink3}
          variant="extra-small"
          fontWeight="regular"
          style={{ marginBottom: 4 }}
        />
      );
    };

    return {
      tabBarIcon: customTabBarIcon,
      tabBarLabel: customTabBarLabel,
      tabBarActiveTintColor: colors.red.newPink,
      tabBarInactiveTintColor: colors.dark.bermudaGrey,
      tabBarButton: (props) => (
        <TouchableOpacity
          {...props}
          onPress={(e) => {
            // eslint-disable-next-line react/prop-types
            const { onPress, to } = props;

            e.preventDefault();

            if (to && onPress) {
              onPress(e);
            }
          }}
        />
      ),
      tabBarStyle: {
        height: 64 + insets.bottom || 0,
        paddingTop: 4,
        backgroundColor: colors.light.whiteSolid,
        paddingVertical: 8,
        elevation: 3,
        borderTopWidth: 1,
        shadowOffset: { height: -4, width: 0 },
        shadowOpacity: 0.05
      },
      tabBarItemStyle: {
        height: 56 + insets.bottom || 0,
        paddingBottom: insets.bottom
      },
      headerShown: false,
      headerTintColor: colors.dark.blackCoral,
      headerStyle: {
        backgroundColor: colors.primary,
        shadowColor: colors.dark.blackSolid,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
        elevation: 14
      },
      headerTitleStyle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: colors.dark.blackCoral
      },
      headerTitleAlign: 'left'
    };
  };

  return (
    <BottomTab.Navigator initialRouteName="HomeStack" screenOptions={screenOptions}>
      <BottomTab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={({ route }) => {
          const current = getFocusedRouteNameFromRoute(route);

          return {
            tabBarStyle: {
              height: 64 + insets.bottom || 0,
              paddingTop: 4,
              backgroundColor: colors.light.whiteSolid,
              paddingVertical: 8,
              elevation: 3,
              borderTopWidth: 1,
              shadowOffset: { height: -4, width: 0 },
              shadowOpacity: 0.05,
              display: current === 'MenuDrawer' || current === 'SearchSuggestion' ? 'none' : 'flex'
            }
          };
        }}
      />

      <BottomTab.Screen
        name="CategoriesStack"
        component={CategoriesStackNavigator}
        options={{ unmountOnBlur: true }}
        listeners={({ navigation }) => ({
          blur: () => {
            navigation.setParams({ screen: undefined });
          }
        })}
      />

      <BottomTab.Screen
        name="Order"
        component={OrderScreen}
        options={{
          title: t('order:orders'),
          headerTitleAllowFontScaling: false,
          headerShown: true,
          headerTitleStyle: {
            marginLeft: -20
          },
          headerLeft: () => <BackButton onPress={() => navigationRef.goBack()} />
        }}
      />
      <BottomTab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          title: t('account:title'),
          headerTitleAllowFontScaling: false,
          headerShown: true,
          headerTitleStyle: {
            marginLeft: -20
          },
          headerLeft: () => <BackButton onPress={() => navigationRef.goBack()} />
        }}
      />
    </BottomTab.Navigator>
  );
};

export default MainBottomTabNavigator;
