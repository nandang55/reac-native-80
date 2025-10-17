import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIResponse } from 'interfaces/BaseAPIResponse';

export interface DeleteProductCartInterface {
  cartId: string;
}

const deleteProductCart = async ({
  cartId
}: DeleteProductCartInterface): Promise<APIResponse<unknown>> => {
  const { data } = await axiosServiceInstance.delete<APIResponse<unknown>>(`/carts/${cartId}`);
  return data;
};

export function useDeleteProductCart(
  mutateFn?: UseMutationOptions<APIResponse<unknown>, AxiosError, DeleteProductCartInterface>
) {
  return useMutation<APIResponse<unknown>, AxiosError, DeleteProductCartInterface>(
    deleteProductCart,
    mutateFn
  );
}
