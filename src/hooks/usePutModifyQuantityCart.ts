import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIResponse } from 'interfaces/BaseAPIResponse';
import { ResponseModifyInterface } from 'interfaces/ProfileInterface';

interface payloadQuantityCartInterface {
  quantity: number;
}

const putModifyQuantityCart = async ({
  cartId,
  body
}: {
  cartId: string;
  body: payloadQuantityCartInterface;
}): Promise<APIResponse<unknown>> => {
  const { data } = await axiosServiceInstance.put(`/carts/${cartId}`, body);
  return data;
};

export function usePutModifyQuantityCart(
  mutateFn?: UseMutationOptions<
    APIResponse<unknown>,
    AxiosError<ResponseModifyInterface>,
    { cartId: string; body: payloadQuantityCartInterface }
  >
) {
  return useMutation<
    APIResponse<unknown>,
    AxiosError<ResponseModifyInterface>,
    { cartId: string; body: payloadQuantityCartInterface }
  >(putModifyQuantityCart, mutateFn);
}
