import config from 'react-native-config';

const {
  APP_ID,
  APP_ID_SUFFIX,
  APP_WHITELABEL,
  APP_LABEL,
  ONE_SIGNAL_APP_ID,
  OTP_TYPE,
  APP_VERSION,
  COMMIT_ID
} = config;

export interface ConfigInterface {
  appId: string;
  appIdSuffix: string;
  appWhitelabel: string;
  appLabel: string;
  oneSignalAppId: string;
  otpType: string;
  appVersion: string;
  commitId: string;
}

export default <ConfigInterface>{
  appId: APP_ID,
  appIdSuffix: APP_ID_SUFFIX,
  appWhitelabel: APP_WHITELABEL,
  appLabel: APP_LABEL,
  oneSignalAppId: ONE_SIGNAL_APP_ID,
  otpType: OTP_TYPE,
  appVersion: APP_VERSION,
  commitId: COMMIT_ID
};
