import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { PutModifyInterface, ResponseModifyInterface } from 'interfaces/ProfileInterface';

const putModifyEmail = async (body: PutModifyInterface): Promise<ResponseModifyInterface> => {
  const { data } = await axiosServiceInstance.put('/users/modify_email', body);
  return data;
};

export function usePutModifyEmail(
  options: UseMutationOptions<
    ResponseModifyInterface,
    AxiosError<ResponseModifyInterface>,
    PutModifyInterface
  >
) {
  return useMutation<
    ResponseModifyInterface,
    AxiosError<ResponseModifyInterface>,
    PutModifyInterface
  >(putModifyEmail, options);
}
