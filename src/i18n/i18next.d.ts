import 'i18next';

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
} from './locales/en';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: undefined;
    resources: {
      account: typeof EnglishAccountScreen;
      common: typeof EnglishCommonScreen;
      checkout: typeof EnglishCheckoutScreen;
      login: typeof EnglishLoginScreen;
      navigation: typeof EnglishNavigation;
      bankInstruction: typeof EnglishBankInstruction;
      cart: typeof EnglishCartScreen;
      register: typeof EnglishRegisterScreen;
      intro: typeof EnglishIntroScreen;
      profileDetail: typeof EnglishProfileDetailScreen;
      language: typeof EnglishLanguageScreen;
      address: typeof EnglishAddressScreen;
      order: typeof EnglishOrderScreen;
      orderDetail: typeof EnglishOrderDetailScreen;
      notification: typeof EnglishNotificationScreen;
      howToPay: typeof EnglishHowToPayScreen;
      productDetail: typeof EnglishProductDetailScreen;
      home: typeof EnglishHomeScreen;
      noInternet: typeof EnglishNoInternetScreen;
    };
  }
}
