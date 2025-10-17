import { createStackNavigator } from '@react-navigation/stack';
import { BackButton } from 'components/BackButton';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import ChangeEmailScreen from 'screens/ChangeEmailScreen';
import ChangeFullNameScreen from 'screens/ChangeFullNameScreen';
import ChangeLanguageScreen from 'screens/ChangeLanguageScreen';
import ChangePhoneNumberScreen from 'screens/ChangePhoneNumberScreen';
import DeleteAccountScreen from 'screens/DeleteAccountScreen';
import ProfileDetailScreen from 'screens/ProfileDetailScreen';
import colors from 'styles/colors';

import { navigationRef, reset } from './RootStackNavigator';

export type AccountStackParamList = {
  ProfileDetail: undefined;
  ChangeFullName: undefined;
  ChangeEmail: undefined;
  ChangePhoneNumber: undefined;
  ChangeLanguage: undefined;
  DeleteAccount: undefined;
};

const Stack = createStackNavigator<AccountStackParamList>();

const AccountStackNavigator = () => {
  const { t } = useTranslation(['navigation', 'profileDetail']);
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
        name="ProfileDetail"
        component={ProfileDetailScreen}
        options={{
          title: t('profileDetail:myProfile'),
          headerTitleAllowFontScaling: false,
          headerLeft: () => (
            <BackButton
              onPress={() =>
                navigationRef.canGoBack() ? navigationRef.goBack() : reset('MainBottomTabNavigator')
              }
            />
          )
        }}
      />
      <Stack.Screen
        name="ChangeFullName"
        component={ChangeFullNameScreen}
        options={{
          title: t('profileDetail:updateName'),
          headerTitleAllowFontScaling: false
        }}
      />
      <Stack.Screen
        name="ChangeEmail"
        component={ChangeEmailScreen}
        options={{
          title: t('profileDetail:updateEmailAddress'),
          headerTitleAllowFontScaling: false
        }}
      />
      <Stack.Screen
        name="ChangePhoneNumber"
        component={ChangePhoneNumberScreen}
        options={{
          title: t('profileDetail:updatePhoneNumber'),
          headerTitleAllowFontScaling: false
        }}
      />
      <Stack.Screen
        name="ChangeLanguage"
        component={ChangeLanguageScreen}
        options={{
          title: t('navigation:navigator.language'),
          headerTitleAllowFontScaling: false
        }}
      />
      <Stack.Screen
        name="DeleteAccount"
        component={DeleteAccountScreen}
        options={{
          title: 'Delete Account',
          headerTitleAllowFontScaling: false
        }}
      />
    </Stack.Navigator>
  );
};

export default AccountStackNavigator;
