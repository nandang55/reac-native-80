import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig
} from 'axios';
import { _retrieveLocalStorageItem } from 'core/utils/localStorage';

const baseHeaders = {
  'Content-Type': 'application/json'
};

export const axiosBaseConfigOptions: AxiosRequestConfig = {
  timeout: 30000,
  headers: baseHeaders
};

export const axiosInterceptorRequest = async (headerConfig: InternalAxiosRequestConfig) => {
  const token = await _retrieveLocalStorageItem('PaypalToken');
  const paypalRequestId = await _retrieveLocalStorageItem('PaypalRequestID');
  const paypalUrl = await _retrieveLocalStorageItem('PaypalURL');

  if (paypalUrl) {
    headerConfig.baseURL = paypalUrl;
  }

  if (headerConfig.headers) {
    headerConfig.headers['Content-Type'] = baseHeaders['Content-Type'];

    if (token && paypalRequestId) {
      headerConfig.headers.Authorization = `Bearer ${token}`;
      headerConfig.headers['PayPal-Request-Id'] = paypalRequestId;
    }
  }

  return headerConfig;
};

export const axiosInterceptorResponseError = async ({
  error
}: {
  error: AxiosError;
  instance: AxiosInstance;
}) => {
  //TODO: complete interceptor response error

  return Promise.reject(error);
};

export const axiosPaypalServiceInstance = axios.create(axiosBaseConfigOptions);

axiosPaypalServiceInstance.interceptors.request.use(axiosInterceptorRequest);
axiosPaypalServiceInstance.interceptors.response.use(
  (response) => response,
  (error) =>
    axiosInterceptorResponseError({
      error,
      instance: axiosPaypalServiceInstance
    })
);
