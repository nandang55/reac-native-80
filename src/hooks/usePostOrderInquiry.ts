import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIResponse } from 'interfaces/BaseAPIResponse';
import { PostOrderInquiryInterface } from 'interfaces/OrderInterface';

interface PostOrderInquiry extends PostOrderInquiryInterface {
  id: string;
}

const postOrderInquiry = async ({
  id,
  ...data
}: PostOrderInquiry): Promise<APIResponse<unknown>> => {
  const { data: response } = await axiosServiceInstance.post(`/orders/${id}/submitInquiry`, data);
  return response;
};

export function usePostOrderInquiry(
  options: UseMutationOptions<
    APIResponse<unknown>,
    AxiosError<{ errors: PostOrderInquiryInterface }>,
    PostOrderInquiry
  >
) {
  return useMutation((payload: PostOrderInquiry) => postOrderInquiry(payload), options);
}
