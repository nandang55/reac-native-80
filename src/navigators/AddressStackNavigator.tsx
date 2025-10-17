import { createStackNavigator } from '@react-navigation/stack';
import { BackButton } from 'components/BackButton';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import AddressScreen from 'screens/AddressScreen';
import ModifyAddressScreen from 'screens/ModifyAddressScreen';
import NewAddressScreen from 'screens/NewAddressScreen';
import colors from 'styles/colors';

import { navigationRef } from './RootStackNavigator';

export type AddressStackParamList = {
  Address: undefined;
  NewAddress: { isPrimary: boolean; from?: 'checkout' | 'account' };
  ModifyAddress: { id?: string; isPrimary: boolean };
  SelectProvince: undefined;
  SelectCity: undefined;
  SelectArea: undefined;
};

const Stack = createStackNavigator<AddressStackParamList>();

const AddressStackNavigator = () => {
  const { t } = useTranslation(['address']);
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
        name="Address"
        component={AddressScreen}
        options={{
          title: t('address:common.title'),
          headerTitleAllowFontScaling: false
        }}
      />
      <Stack.Screen
        name="NewAddress"
        component={NewAddressScreen}
        options={{
          title: t('address:add.title'),
          headerTitleAllowFontScaling: false
        }}
      />
      <Stack.Screen
        name="ModifyAddress"
        component={ModifyAddressScreen}
        options={{
          title: t('address:modify.title'),
          headerTitleAllowFontScaling: false
        }}
      />
    </Stack.Navigator>
  );
};

export default AddressStackNavigator;
