import { createStackNavigator } from '@react-navigation/stack';
import { BackButton } from 'components/BackButton';
import { CartInterface } from 'interfaces/CartInterface';
import {
  PaymentOptionInterface,
  ShippingMethodListInterface,
  VoucherInterface
} from 'interfaces/CheckoutInterface';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import CheckoutConfirmationScreen from 'screens/CheckoutConfirmationScreen';
import CheckoutPickAddress from 'screens/CheckoutPickAddressScreen';
import CheckoutScreen from 'screens/CheckoutScreen';
import HowToPayScreen from 'screens/HowToPayScreen';
import PaymentScreen from 'screens/PaymentScreen';
import colors from 'styles/colors';

import { navigationRef } from './RootStackNavigator';

interface CheckoutConfirmationParamInterface {
  cart: Array<CartInterface>;
  deliveryMethod: ShippingMethodListInterface;
  paymentOption: PaymentOptionInterface;
  promoCode?: string;
  discount?: number;
  voucher?: number;
  freeOngkir?: boolean;
}

export type CheckoutStackParamList = {
  CheckoutPickAddress: undefined;
  Checkout: { cart: Array<CartInterface>; voucher: VoucherInterface };
  CheckoutConfirmation: CheckoutConfirmationParamInterface;
  HowToPay: { id: string };
  Payment: { id: string };
};

const Stack = createStackNavigator<CheckoutStackParamList>();

const CheckoutStackNavigator = () => {
  const { t } = useTranslation(['address', 'checkout', 'howToPay']);
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
        name="Checkout"
        component={CheckoutScreen}
        options={{
          title: 'Checkout',
          headerTitleAllowFontScaling: false
        }}
      />
      <Stack.Screen
        name="CheckoutPickAddress"
        component={CheckoutPickAddress}
        options={{
          title: t('address:delivery.title'),
          headerTitleAllowFontScaling: false
        }}
      />
      <Stack.Screen
        name="CheckoutConfirmation"
        component={CheckoutConfirmationScreen}
        options={{
          title: t('checkout:checkoutConfirmation'),
          headerTitleAllowFontScaling: false
        }}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{
          title: t('checkout:payment'),
          headerTitleAllowFontScaling: false,
          headerLeft: () => null,
          headerTitleStyle: { margin: 0 }
        }}
      />
      <Stack.Screen
        name="HowToPay"
        component={HowToPayScreen}
        options={{
          title: t('howToPay:howToPay'),
          headerTitleAllowFontScaling: false
        }}
      />
    </Stack.Navigator>
  );
};

export default CheckoutStackNavigator;
