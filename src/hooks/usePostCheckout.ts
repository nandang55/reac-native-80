import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIResponse } from 'interfaces/BaseAPIResponse';
import { CheckoutPayloadInterface, CheckoutResponse } from 'interfaces/CheckoutInterface';

interface CheckoutAPIResponse<T> extends APIResponse<T> {
  title?: string;
  errorType?: number | string;
}

const postCheckout = async (
  body: CheckoutPayloadInterface
): Promise<CheckoutAPIResponse<CheckoutResponse>> => {
  const { data } = await axiosServiceInstance.post('/checkout', body);
  return data;
};

export function usePostCheckout(
  options?: UseMutationOptions<
    CheckoutAPIResponse<CheckoutResponse>,
    AxiosError<CheckoutAPIResponse<CheckoutResponse>>,
    CheckoutPayloadInterface
  >
) {
  return useMutation<
    CheckoutAPIResponse<CheckoutResponse>,
    AxiosError<CheckoutAPIResponse<CheckoutResponse>>,
    CheckoutPayloadInterface
  >(postCheckout, options);
}
