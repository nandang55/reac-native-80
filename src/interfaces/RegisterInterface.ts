import { LanguageType } from './TranslationInterface';

export interface PostBodyRegisterInterface {
  fullname: string;
  phone: string;
  phone_cc: string;
  email: string;
  lang: LanguageType;
  is_email_notification: boolean;
}

export interface RegisterInterface extends PostBodyRegisterInterface {}
