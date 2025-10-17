import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { axiosPaypalServiceInstance } from 'core/axios/axiosPaypalInstance';
import { APIResponse } from 'interfaces/BaseAPIResponse';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const postCreateOrder = async (body: any): Promise<APIResponse<unknown>> => {
  const { data } = await axiosPaypalServiceInstance.post('/v2/checkout/orders', body);
  return data;
};

export function usePostCreateOrder(
  mutateFn?: UseMutationOptions<APIResponse<unknown>, AxiosError, unknown>
) {
  return useMutation<APIResponse<unknown>, AxiosError, unknown>(postCreateOrder, mutateFn);
}
