import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIResponse } from 'interfaces/BaseAPIResponse';
import { ErrorModifyFullNameInterface, ModifyFullNameInterface } from 'interfaces/ProfileInterface';

const putModifyFullName = async (
  body: ModifyFullNameInterface
): Promise<APIResponse<ModifyFullNameInterface>> => {
  const { data } = await axiosServiceInstance.put('/users/profile', body);
  return data;
};

export function usePutModifyFullName(
  options: UseMutationOptions<
    APIResponse<ModifyFullNameInterface>,
    AxiosError<ErrorModifyFullNameInterface>,
    ModifyFullNameInterface
  >
) {
  return useMutation<
    APIResponse<ModifyFullNameInterface>,
    AxiosError<ErrorModifyFullNameInterface>,
    ModifyFullNameInterface
  >(putModifyFullName, options);
}
