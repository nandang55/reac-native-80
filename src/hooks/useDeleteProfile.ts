import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';

export interface DeleteProfileInterface {
  id: string;
}

const deleteProfile = async ({ id }: DeleteProfileInterface) => {
  const { data } = await axiosServiceInstance.delete<APIResponse<unknown>>(`/admin/users/${id}`);
  return data;
};

export function useDeleteProfile(
  options: UseMutationOptions<APIResponse<unknown>, APIError, DeleteProfileInterface>
) {
  return useMutation((addressId: DeleteProfileInterface) => deleteProfile(addressId), options);
}
