import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIResponse } from 'interfaces/BaseAPIResponse';

interface BodyAddToWishlistInterface {
  id: string;
  from?: 'newArrivals' | 'categories' | 'recommendedProduct' | 'productDetail';
  module: 'products' | 'carts';
}

const postAddToWishlist = async (
  body: BodyAddToWishlistInterface
): Promise<APIResponse<unknown>> => {
  const { module, id } = body;
  const { data } = await axiosServiceInstance.post(`/${module}/${id}/addToWishlist`);
  return data;
};

export function usePostAddToWishlist(
  options?: UseMutationOptions<
    APIResponse<unknown>,
    AxiosError<APIResponse<unknown>>,
    BodyAddToWishlistInterface
  >
) {
  return useMutation<
    APIResponse<unknown>,
    AxiosError<APIResponse<unknown>>,
    BodyAddToWishlistInterface
  >(postAddToWishlist, options);
}
