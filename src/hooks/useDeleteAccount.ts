import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';

export interface DeleteAccountInterface {
  reason: string;
}

const deleteAccount = async (body: DeleteAccountInterface) => {
  const { data } = await axiosServiceInstance.delete<APIResponse<unknown>>('/users/delete', {
    data: body
  });
  return data;
};

export function useDeleteAccount(
  options: UseMutationOptions<APIResponse<unknown>, APIError, DeleteAccountInterface>
) {
  return useMutation((reason: DeleteAccountInterface) => deleteAccount(reason), options);
}
