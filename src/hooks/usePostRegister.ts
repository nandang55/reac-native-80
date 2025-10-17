import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIResponse } from 'interfaces/BaseAPIResponse';
import { PostBodyRegisterInterface } from 'interfaces/RegisterInterface';

const postRegister = async (
  body: PostBodyRegisterInterface
): Promise<APIResponse<PostBodyRegisterInterface>> => {
  const { data } = await axiosServiceInstance.post('/users/register', body);
  return data;
};

export function usePostRegister(
  options: UseMutationOptions<
    APIResponse<PostBodyRegisterInterface>,
    AxiosError<APIResponse<PostBodyRegisterInterface>>,
    PostBodyRegisterInterface
  >
) {
  return useMutation<
    APIResponse<PostBodyRegisterInterface>,
    AxiosError<APIResponse<PostBodyRegisterInterface>>,
    PostBodyRegisterInterface
  >(postRegister, options);
}
