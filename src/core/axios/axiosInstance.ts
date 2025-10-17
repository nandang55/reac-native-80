import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig
} from 'axios';
import { _retrieveLocalStorageItem, _storeLocalStorageItem } from 'core/utils/localStorage';
import removeUserAuth from 'core/utils/removeUserAuth';
import { RetryQueueItem } from 'interfaces/BaseAPIResponse';
import config from 'react-native-config';

interface ResponseRefreshToken {
  access_token?: string;
  refresh_token?: string;
  message: string;
  error: boolean;
}

let isRefreshing = false;
let refreshAndRetryQueue: Array<RetryQueueItem> = [];

// Default values for development
const DEFAULT_APP_ID = 'sparkle-app';
const DEFAULT_APP_REGION = 'sg';
const DEFAULT_APP_VERSION = '1.0.0';
const DEFAULT_ALGOLIA_APPID = '9O35FH7LWB';
const DEFAULT_ALGOLIA_APIKEY = 'a80ad6cca4e0866c745d747bdd6512cf';
const DEFAULT_APP_SERVICE_URL = 'https://sit-sparkle-service-api.gajicermat.co';

const baseHeaders = {
  'x-platform': config.APP_ID || DEFAULT_APP_ID,
  'x-region': config.APP_REGION || DEFAULT_APP_REGION,
  'x-mobile-version': config.APP_VERSION || DEFAULT_APP_VERSION,
  'x-algolia-application-id': config.ALGOLIA_APPID || DEFAULT_ALGOLIA_APPID,
  'x-algolia-api-key': config.ALGOLIA_APIKEY || DEFAULT_ALGOLIA_APIKEY
};

const GetRefreshToken = async ({ token }: { token: string }): Promise<ResponseRefreshToken> =>
  new Promise((resolve, reject) => {
    fetch(`${config.APP_SERVICE_URL || DEFAULT_APP_SERVICE_URL}/refreshToken`, {
      headers: {
        ...baseHeaders,
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((res: ResponseRefreshToken) => resolve(res))
      .catch((err) => {
        removeUserAuth();
        return reject(err);
      });
  });

export const syncRefreshToken = async (
  originalRequest?: AxiosRequestConfig
): Promise<ResponseRefreshToken> => {
  if (isRefreshing && originalRequest) {
    return new Promise((resolve, reject) => {
      refreshAndRetryQueue.push({
        resolve,
        reject,
        config: originalRequest
      });
    });
  }

  isRefreshing = true;

  const refreshTokenCookie = await _retrieveLocalStorageItem('UserRefreshToken');

  if (refreshTokenCookie) {
    // eslint-disable-next-line camelcase
    const { access_token, refresh_token, error } = await GetRefreshToken({
      token: refreshTokenCookie
    });

    // eslint-disable-next-line camelcase
    if (!error && access_token && refresh_token) {
      await _storeLocalStorageItem({
        storageKey: 'UserToken',
        // eslint-disable-next-line camelcase
        storageValue: access_token
      });
      await _storeLocalStorageItem({
        storageKey: 'UserRefreshToken',
        // eslint-disable-next-line camelcase
        storageValue: refresh_token
      });

      refreshAndRetryQueue.forEach(({ resolve }) => resolve());
      refreshAndRetryQueue = [];

      isRefreshing = false;

      return {
        // eslint-disable-next-line camelcase
        access_token,
        // eslint-disable-next-line camelcase
        refresh_token,
        message: '',
        error: false
      };
    }
    removeUserAuth();
  }

  isRefreshing = false;

  return {
    message: 'error',
    error: true
  };
};

export const axiosBaseConfigOptions: AxiosRequestConfig = {
  timeout: 30000,
  headers: baseHeaders
};

export const axiosInterceptorRequest = async (headerConfig: InternalAxiosRequestConfig) => {
  const token = await _retrieveLocalStorageItem('UserToken');

  if (token && headerConfig.headers) {
    headerConfig.headers.Authorization = `Bearer ${token}`;
  }

  axios.defaults.headers.common['x-platform'] = baseHeaders['x-platform'];
  axios.defaults.headers.common['x-region'] = baseHeaders['x-region'];

  return headerConfig;
};

export const axiosInterceptorResponseError = async ({
  error,
  instance
}: {
  error: AxiosError;
  instance: AxiosInstance;
}) => {
  const status = error.response ? error.response.status : null;
  const originalRequest = error.config;

  if (!originalRequest) {
    return Promise.reject(error);
  }

  const refreshTokenCookie = await _retrieveLocalStorageItem('UserRefreshToken');

  if ((status === 406 || status === 401) && refreshTokenCookie) {
    const newTokens = await syncRefreshToken(originalRequest);

    if (!newTokens.error) {
      originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`;
      return instance(originalRequest);
    }
  }
  return Promise.reject(error);
};

const instanceAuthOption: AxiosRequestConfig = {
  baseURL: config.APP_SERVICE_URL || DEFAULT_APP_SERVICE_URL,
  ...axiosBaseConfigOptions
};

export const axiosServiceInstance = axios.create(instanceAuthOption);

axiosServiceInstance.interceptors.request.use(axiosInterceptorRequest);
axiosServiceInstance.interceptors.response.use(
  (response) => response,
  (error) =>
    axiosInterceptorResponseError({
      error,
      instance: axiosServiceInstance
    })
);
