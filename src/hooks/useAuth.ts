import { AccountContext } from 'contexts/AppAccountContext';
import { initialPickAddressValues, PickAddressContext } from 'contexts/AppPickAddressContext';
import { _storeLocalStorageItem } from 'core/utils/localStorage';
import removeUserAuth from 'core/utils/removeUserAuth';
import { ResponseLoginInterface } from 'interfaces/LoginInterface';
import { useContext } from 'react';
import { OneSignal } from 'react-native-onesignal';

const useAuth = () => {
  const { dispatch: dispatchAccount } = useContext(AccountContext);
  const { setAddress } = useContext(PickAddressContext);

  const signIn = async (data: ResponseLoginInterface) => {
    await _storeLocalStorageItem({
      storageKey: 'UserToken',
      storageValue: data.access_token
    });

    await _storeLocalStorageItem({
      storageKey: 'UserRefreshToken',
      storageValue: data.refresh_token
    });
  };

  const signOut = async () => {
    OneSignal.logout();
    await removeUserAuth();
    dispatchAccount({
      type: 'RemoveAccount'
    });
    setAddress(initialPickAddressValues);
  };

  return {
    signIn,
    signOut
  };
};

export default useAuth;
