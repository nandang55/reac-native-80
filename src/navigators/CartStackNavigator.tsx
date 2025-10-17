import { createStackNavigator } from '@react-navigation/stack';
import { BackButton } from 'components/BackButton';
import { BadgeComponent } from 'components/Badge';
import { AccountContext } from 'contexts/AppAccountContext';
import useGetCountWishlist from 'hooks/useGetCountWishlist';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';
import CartScreen from 'screens/CartScreen';
import colors from 'styles/colors';

import { navigationRef } from './RootStackNavigator';

export type CartStackParamList = {
  Cart: undefined;
};

const Stack = createStackNavigator<CartStackParamList>();

const CartStackNavigator = () => {
  const { state: accountState } = useContext(AccountContext);
  const { data: dataWishlist, isSuccess: isDataWishlistSuccess } = useGetCountWishlist({
    options: { enabled: !!accountState.account }
  });

  const { t } = useTranslation(['cart']);
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
        name="Cart"
        component={CartScreen}
        options={{
          title: t('cart:title'),
          headerTitleAllowFontScaling: false,
          headerTitleStyle: { marginLeft: -20 },
          headerRight: () =>
            accountState.account?.id && (
              <View style={{ flexDirection: 'row', marginRight: 16, gap: 8 }}>
                <BadgeComponent
                  total={dataWishlist?.data.count || 0}
                  isSuccess={isDataWishlistSuccess}
                  name="wishlist"
                  size="24"
                  color={colors.dark.color1}
                  onPress={() => navigationRef.navigate('WishlistStack')}
                />
              </View>
            )
        }}
      />
    </Stack.Navigator>
  );
};

export default CartStackNavigator;
