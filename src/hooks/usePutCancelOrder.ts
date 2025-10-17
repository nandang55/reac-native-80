import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIResponse } from 'interfaces/BaseAPIResponse';

const putCancelOrder = async ({ id }: { id: string }): Promise<APIResponse<unknown>> => {
  const { data } = await axiosServiceInstance.put(`/orders/${id}/cancel`);
  return data;
};

export function usePutCancelOrder(
  mutateFn?: UseMutationOptions<APIResponse<unknown>, AxiosError, { id: string }>
) {
  return useMutation<APIResponse<unknown>, AxiosError, { id: string }>(putCancelOrder, mutateFn);
}
