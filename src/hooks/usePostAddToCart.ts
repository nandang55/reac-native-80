import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIResponse } from 'interfaces/BaseAPIResponse';
import { PostBodyCartInterface } from 'interfaces/CartInterface';

const postAddToCart = async (
  body: PostBodyCartInterface
): Promise<APIResponse<PostBodyCartInterface>> => {
  const { data } = await axiosServiceInstance.post('/carts', body);
  return data;
};

export function usePostAddToCart(
  options?: UseMutationOptions<
    APIResponse<PostBodyCartInterface>,
    AxiosError<APIResponse<PostBodyCartInterface>>,
    PostBodyCartInterface
  >
) {
  return useMutation<
    APIResponse<PostBodyCartInterface>,
    AxiosError<APIResponse<PostBodyCartInterface>>,
    PostBodyCartInterface
  >(postAddToCart, options);
}
