import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';

export interface DeleteWishlistInterface {
  product_ids: Array<string>;
  from?: 'newArrivals' | 'categories' | 'recommendedProduct' | 'productDetail';
}

const deleteWishlist = async (body: DeleteWishlistInterface) => {
  const { data } = await axiosServiceInstance.delete<APIResponse<unknown>>('/wishlists/remove', {
    data: body
  });
  return data;
};

export function useDeleteWishlist(
  options: UseMutationOptions<APIResponse<unknown>, APIError, DeleteWishlistInterface>
) {
  return useMutation((body: DeleteWishlistInterface) => deleteWishlist(body), options);
}
