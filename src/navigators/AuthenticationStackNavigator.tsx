import { createStackNavigator } from '@react-navigation/stack';
import { BackButton } from 'components/BackButton';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { NoAuth } from 'screens/Auth';
import EmailLoginScreen from 'screens/EmailLoginScreen';
import LoginScreen from 'screens/LoginScreen';
import RegisterScreen from 'screens/RegisterScreen';
import VerifyScreen from 'screens/VerifyScreen';
import WhatsAppLoginScreen from 'screens/WhatsAppScreen';
import colors from 'styles/colors';

import { navigationRef } from './RootStackNavigator';

export type VerifyParamsList = {
  from: 'email' | 'whatsApp';
  method: 'login' | 'change';
  email?: string;
  phone?: string;
  phoneCode?: string;
  verificationId?: string;
  textDescription: string;
};

export type AuthenticationStackParamList = {
  Register: { email?: string; phoneNumber?: string; phoneCode?: string } | undefined;
  Login: undefined;
  Verify: VerifyParamsList;
  EmailLogin: undefined;
  WhatsAppLogin: undefined;
  NoLogin: { title?: string } | undefined;
};

const Stack = createStackNavigator<AuthenticationStackParamList>();

const AuthenticationStackNavigator = () => {
  const { t } = useTranslation(['register', 'login']);
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
        headerTintColor: colors.dark.blackCoral,
        headerTitleStyle: {
          fontFamily: 'Poppins-SemiBold',
          fontSize: 18,
          color: colors.dark.blackCoral,
          marginLeft: -16,
          marginTop: Platform.OS === 'ios' ? 0 : 5
        },
        headerLeft: () => <BackButton onPress={() => navigationRef.goBack()} />,
        headerTitleAlign: 'left'
      }}
    >
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: t('register:title'),
          headerShown: false
        }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: t('login:login'),
          headerShown: false
        }}
      />
      <Stack.Screen
        name="EmailLogin"
        component={EmailLoginScreen}
        options={{
          title: t('login:login')
        }}
      />
      <Stack.Screen
        name="WhatsAppLogin"
        component={WhatsAppLoginScreen}
        options={{
          title: t('login:login')
        }}
      />
      <Stack.Screen
        name="Verify"
        component={VerifyScreen}
        options={{
          title: t('login:verification.title')
        }}
      />
      <Stack.Screen
        name="NoLogin"
        component={NoAuth}
        options={({ route }) => ({
          title: route?.params?.title,
          headerTitleAllowFontScaling: false,
          headerTitleStyle: { marginLeft: -20 }
        })}
      />
    </Stack.Navigator>
  );
};

export default AuthenticationStackNavigator;
