import { LanguageType } from './TranslationInterface';

export interface ProfileInterface {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  phoneCC: string;
  email: string;
  lang?: LanguageType;
  redirectAfterLogin?: string;
}

export interface ModifyFullNameInterface {
  fullname?: string;
}

export interface ErrorModifyFullNameInterface {
  data: {
    fullname: Array<string>;
  };
  message: string;
  error: boolean;
}

export interface PutModifyInterface {
  new_phone?: string;
  new_email?: string;
  verification_code?: string;
  lang: LanguageType;
}

export interface PutFirebaseModifyInterface {
  new_phone: string;
  phone_cc?: string;
  firebase_id?: string;
}

export interface ErrorModifyInterface {
  new_phone?: Array<string>;
  phone_cc?: Array<string>;
  new_email?: Array<string>;
  verification_code?: Array<string>;
}

export interface ResponseModifyInterface {
  data: Record<string, unknown> | ErrorModifyInterface;
  error: boolean;
  message?: string;
}

export interface BodyModifySubscribeEmail {
  is_email_notification: boolean;
}
