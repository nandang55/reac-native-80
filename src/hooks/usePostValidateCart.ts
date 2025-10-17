import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIResponse } from 'interfaces/BaseAPIResponse';
import { BodyValidateCartInterface } from 'interfaces/CartInterface';

const postValidateCart = async (
  body: BodyValidateCartInterface
): Promise<APIResponse<BodyValidateCartInterface>> => {
  const { data } = await axiosServiceInstance.post('/carts/checkout', body);
  return data;
};

export function usePostValidateCart(
  options: UseMutationOptions<
    APIResponse<BodyValidateCartInterface>,
    AxiosError<APIResponse<BodyValidateCartInterface>>,
    BodyValidateCartInterface
  >
) {
  return useMutation<
    APIResponse<BodyValidateCartInterface>,
    AxiosError<APIResponse<BodyValidateCartInterface>>,
    BodyValidateCartInterface
  >(postValidateCart, options);
}
