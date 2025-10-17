import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIResponse } from 'interfaces/BaseAPIResponse';

interface BodyCheckIsWishlistInterface {
  product_ids: Array<string>;
}

const postCheckIsWishlist = async (
  body: BodyCheckIsWishlistInterface
): Promise<APIResponse<Record<string, boolean>>> => {
  const { data } = await axiosServiceInstance.post('/products/checkIsWishlist', body);
  return data;
};

export function usePostCheckIsWishlist(
  options?: UseMutationOptions<
    APIResponse<Record<string, boolean>>,
    AxiosError<APIResponse<Record<string, boolean>>>,
    BodyCheckIsWishlistInterface
  >
) {
  return useMutation<
    APIResponse<Record<string, boolean>>,
    AxiosError<APIResponse<Record<string, boolean>>>,
    BodyCheckIsWishlistInterface
  >(postCheckIsWishlist, options);
}
