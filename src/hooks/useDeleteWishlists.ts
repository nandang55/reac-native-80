// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';

export interface DeleteWishlistsInterface {
  product_ids: Array<string>;
}

const deleteWishlists = async ({ product_ids }: DeleteWishlistsInterface) => {
  const { data } = await axiosServiceInstance.delete<APIResponse<unknown>>('/wishlists/remove', {
    data: { product_ids }
  });
  return data;
};

export function useDeleteWishlists(
  options: UseMutationOptions<APIResponse<unknown>, APIError, DeleteWishlistsInterface>
) {
  return useMutation(
    (product_ids: DeleteWishlistsInterface) => deleteWishlists(product_ids),
    options
  );
}
