import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import {
  EnglishAccountScreen,
  EnglishAddressScreen,
  EnglishBankInstruction,
  EnglishCartScreen,
  EnglishCheckoutScreen,
  EnglishCommonScreen,
  EnglishHomeScreen,
  EnglishHowToPayScreen,
  EnglishIntroScreen,
  EnglishLanguageScreen,
  EnglishLoginScreen,
  EnglishNavigation,
  EnglishNoInternetScreen,
  EnglishNotificationScreen,
  EnglishOrderDetailScreen,
  EnglishOrderScreen,
  EnglishProductDetailScreen,
  EnglishProfileDetailScreen,
  EnglishRegisterScreen
} from '../../i18n/locales/en';
import {
  BahasaAccountScreen,
  BahasaAddressScreen,
  BahasaBankInstruction,
  BahasaCartScreen,
  BahasaCheckoutScreen,
  BahasaCommonScreen,
  BahasaHomeScreen,
  BahasaHowToPayScreen,
  BahasaIntroScreen,
  BahasaLanguageScreen,
  BahasaLoginScreen,
  BahasaNavigation,
  BahasaNoInternetScreen,
  BahasaNotificationScreen,
  BahasaOrderDetailScreen,
  BahasaOrderScreen,
  BahasaProductDetailScreen,
  BahasaProfileDetailScreen,
  BahasaRegisterScreen
} from '../../i18n/locales/id';

export const useI18n = () => {
  // TODO: uncomment if need default language & multiple languages
  // const defaultLanguage = useDeviceLanguage();

  const englishResources = {
    account: EnglishAccountScreen,
    checkout: EnglishCheckoutScreen,
    common: EnglishCommonScreen,
    login: EnglishLoginScreen,
    navigation: EnglishNavigation,
    bankInstruction: EnglishBankInstruction,
    cart: EnglishCartScreen,
    register: EnglishRegisterScreen,
    intro: EnglishIntroScreen,
    profileDetail: EnglishProfileDetailScreen,
    language: EnglishLanguageScreen,
    address: EnglishAddressScreen,
    order: EnglishOrderScreen,
    orderDetail: EnglishOrderDetailScreen,
    notification: EnglishNotificationScreen,
    howToPay: EnglishHowToPayScreen,
    productDetail: EnglishProductDetailScreen,
    home: EnglishHomeScreen,
    noInternet: EnglishNoInternetScreen
  };

  const bahasaResources = {
    account: BahasaAccountScreen,
    checkout: BahasaCheckoutScreen,
    common: BahasaCommonScreen,
    login: BahasaLoginScreen,
    navigation: BahasaNavigation,
    bankInstruction: BahasaBankInstruction,
    cart: BahasaCartScreen,
    register: BahasaRegisterScreen,
    intro: BahasaIntroScreen,
    profileDetail: BahasaProfileDetailScreen,
    language: BahasaLanguageScreen,
    address: BahasaAddressScreen,
    order: BahasaOrderScreen,
    orderDetail: BahasaOrderDetailScreen,
    notification: BahasaNotificationScreen,
    howToPay: BahasaHowToPayScreen,
    productDetail: BahasaProductDetailScreen,
    home: BahasaHomeScreen,
    noInternet: BahasaNoInternetScreen
  };

  const resources = {
    en: englishResources,
    id: bahasaResources
  } as const;

  const init = () => {
    // TODO: change lng if need default language & multiple languages
    // eslint-disable-next-line import/no-named-as-default-member
    i18next.use(initReactI18next).init({
      resources,
      lng: 'en',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false
      },
      compatibilityJSON: 'v3',
      defaultNS: undefined,
      ns: [
        'account',
        'checkout',
        'common',
        'login',
        'navigation',
        'bankInstruction',
        'cart',
        'register',
        'intro',
        'profileDetail',
        'language',
        'address',
        'order',
        'orderDetail',
        'notification',
        'howToPay',
        'productDetail',
        'howToPay',
        'home',
        'noInternet'
      ]
    });
  };

  return { i18next, init };
};
