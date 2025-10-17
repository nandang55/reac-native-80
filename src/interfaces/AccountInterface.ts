import { LanguageType } from './TranslationInterface';

export type AccountResponse = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  phoneCC: string;
  email: string;
  redirectAfterLogin?: string;
  lang?: LanguageType;
  isTester?: number;
  isEmailNotification?: boolean;
};
