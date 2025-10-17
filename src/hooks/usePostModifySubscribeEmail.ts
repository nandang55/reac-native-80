import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIResponse } from 'interfaces/BaseAPIResponse';
import { BodyModifySubscribeEmail } from 'interfaces/ProfileInterface';

const postModifySubscribeEmail = async (
  body: BodyModifySubscribeEmail
): Promise<APIResponse<unknown>> => {
  const { data } = await axiosServiceInstance.post('/users/modify_subscribe_email', body);
  return data;
};

export function usePostModifySubscribeEmail(
  options?: UseMutationOptions<APIResponse<unknown>, AxiosError, BodyModifySubscribeEmail>
) {
  return useMutation<APIResponse<unknown>, AxiosError, BodyModifySubscribeEmail>(
    postModifySubscribeEmail,
    options
  );
}
