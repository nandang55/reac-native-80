import AsyncStorage from '@react-native-async-storage/async-storage';

type StoredItemKey =
  | 'UserToken'
  | 'UserRefreshToken'
  | 'I18nLang'
  | 'IntroViewed'
  | 'PaypalToken'
  | 'PaypalRequestID'
  | 'PaypalURL'
  | 'UpdateNotification';

export const _storeLocalStorageItem = async ({
  storageKey,
  storageValue
}: {
  storageKey: StoredItemKey;
  storageValue: string;
}) => {
  try {
    await AsyncStorage.setItem(storageKey, storageValue);
    return;
  } catch (error) {
    return error;
  }
};

export const _retrieveLocalStorageItem = async (storageKey: StoredItemKey): Promise<string> => {
  try {
    const value = await AsyncStorage.getItem(storageKey);
    if (value !== null) {
      return value;
    }
  } catch (err) {
    return '';
  }
  return '';
};

export const _removeLocalStorageItem = async (storageKey: StoredItemKey) => {
  try {
    await AsyncStorage.removeItem(storageKey);
    return true;
  } catch (exception) {
    return false;
  }
};
