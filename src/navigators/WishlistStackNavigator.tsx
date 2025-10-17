import { createStackNavigator } from '@react-navigation/stack';
import { BackButton } from 'components/BackButton';
import { BadgeComponent } from 'components/Badge';
import { AccountContext } from 'contexts/AppAccountContext';
import useGetCountCart from 'hooks/useGetCountCart';
import React, { useContext } from 'react';
import { Platform } from 'react-native';
import WishlistScreen from 'screens/WishlistScreen';
import colors from 'styles/colors';

import { navigationRef } from './RootStackNavigator';

export type WishlistStackPropsNavigator = {
  Wishlist: { query: string };
};

const Stack = createStackNavigator<WishlistStackPropsNavigator>();

const WishlistStackNavigation = () => {
  const { state: accountState } = useContext(AccountContext);
  const { data: dataCart, isSuccess: isDataCartSuccess } = useGetCountCart({
    options: { enabled: !!accountState.account }
  });
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
          shadowColor: colors.dark.blackSolid,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.18,
          shadowRadius: 8,
          elevation: 14
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
        headerShadowVisible: true,
        headerLeft: () => <BackButton onPress={() => navigationRef.goBack()} />
      }}
    >
      <Stack.Screen
        name="Wishlist"
        component={WishlistScreen}
        options={{
          title: 'Wishlist',
          headerTitleAllowFontScaling: false,
          headerTitleStyle: { marginLeft: -20 },
          headerLeft: () => <BackButton onPress={() => navigationRef.goBack()} />,
          headerRight: () =>
            accountState.account?.id && (
              <BadgeComponent
                total={dataCart?.data.count || 0}
                isSuccess={isDataCartSuccess}
                name="cart"
                size="24"
                color={colors.dark.blackCoral}
                onPress={() => navigationRef.navigate('CartStack', { screen: 'Cart' })}
                style={{ paddingRight: 16 }}
                countStyle={{ right: 12 }}
              />
            )
        }}
      />
    </Stack.Navigator>
  );
};

export default WishlistStackNavigation;
