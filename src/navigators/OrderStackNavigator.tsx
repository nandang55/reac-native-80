import { createStackNavigator } from '@react-navigation/stack';
import { BackButton } from 'components/BackButton';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import OrderDetailScreen from 'screens/OrderDetailScreen';
import OrderInquiryScreen from 'screens/OrderInquiryScreen';
import colors from 'styles/colors';

import { navigationRef } from './RootStackNavigator';

export type OrderStackParamList = {
  OrderDetail: { id: string; source?: 'webview' };
  OrderInquiry: { id: string };
};

const Stack = createStackNavigator<OrderStackParamList>();

const OrderStackNavigator = () => {
  const { t } = useTranslation(['orderDetail']);

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
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{
          title: t('orderDetail:orderDetail'),
          headerTitleAllowFontScaling: false
        }}
      />
      <Stack.Screen
        name="OrderInquiry"
        component={OrderInquiryScreen}
        options={{
          title: t('orderDetail:orderInquiry'),
          headerTitleAllowFontScaling: false
        }}
      />
    </Stack.Navigator>
  );
};

export default OrderStackNavigator;
