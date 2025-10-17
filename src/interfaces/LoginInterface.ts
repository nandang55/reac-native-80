import { LanguageType } from './TranslationInterface';

export interface PostBodyLoginInterface {
  phone?: string;
  email?: string;
  verification_code?: string;
  lang: LanguageType;
}

export interface PostBodyLoginFirebaseInterface {
  phone?: string;
  firebase_id?: string;
  lang?: LanguageType;
}

export interface ErrorLoginInterface {
  phone?: Array<string>;
  email?: Array<string>;
  verification_code?: Array<string>;
}

export interface ResponseLoginInterface extends TokenInterface {
  data?: Record<string, unknown> | ErrorLoginInterface;
  error?: boolean;
  message?: string;
  errorType?: string;
}

export interface TokenInterface {
  access_token: string;
  refresh_token: string;
  expire_token: number;
}
