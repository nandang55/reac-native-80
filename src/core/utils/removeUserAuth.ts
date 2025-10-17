import auth from '@react-native-firebase/auth';
import { Route } from '@react-navigation/native';
import config from 'config';
import { getCurrentRoute, reset } from 'navigators/RootStackNavigator';

import { _removeLocalStorageItem, _retrieveLocalStorageItem } from './localStorage';

const removeUserAuth = async () => {
  const otpType = config.otpType;
  const route: Route<string> | undefined = getCurrentRoute();
  const token = await _retrieveLocalStorageItem('UserToken');
  const currentUser = auth().currentUser;

  await _removeLocalStorageItem('UserToken');
  await _removeLocalStorageItem('UserRefreshToken');

  if (otpType === 'SMS' && currentUser) {
    await auth().signOut();
  }

  if (route?.name !== 'Home' && token) {
    reset('MainBottomTabNavigator');
  }
};

export default removeUserAuth;
