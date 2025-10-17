import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIResponse } from 'interfaces/BaseAPIResponse';

interface PostBodyErrorFirebaseInterface {
  phone: string;
  error_message: string;
}

const postErrorFirebase = async (
  body: PostBodyErrorFirebaseInterface
): Promise<APIResponse<unknown>> => {
  const { data } = await axiosServiceInstance.post('/firebaseLogs', body);
  return data;
};

export function usePostErrorLogFirebase(
  options: UseMutationOptions<
    APIResponse<unknown>,
    AxiosError<APIResponse<unknown>>,
    PostBodyErrorFirebaseInterface
  >
) {
  return useMutation<
    APIResponse<unknown>,
    AxiosError<APIResponse<unknown>>,
    PostBodyErrorFirebaseInterface
  >(postErrorFirebase, options);
}
