import { LanguageInterface } from 'interfaces/TranslationInterface';
import { NativeModules, Platform } from 'react-native';

export const useDeviceLanguage = () => {
  const appLanguage =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0]
      : NativeModules.I18nManager.localeIdentifier;

  const language: LanguageInterface = {
    // eslint-disable-next-line camelcase
    in_ID: 'id',
    // eslint-disable-next-line camelcase
    en_US: 'en'
  };

  return language[appLanguage];
};
