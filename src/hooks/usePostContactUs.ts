import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIResponse } from 'interfaces/BaseAPIResponse';

import { BodyContactUsInterface } from './../interfaces/ContactUsInterface';

interface ContactUsAPIResponse<T> extends APIResponse<T> {
  errorType?: string;
}

const postContactUs = async (
  body: BodyContactUsInterface
): Promise<ContactUsAPIResponse<BodyContactUsInterface>> => {
  const { data } = await axiosServiceInstance.post('/contactUs', body);
  return data;
};

export function usePostContactUs(
  options?: UseMutationOptions<
    ContactUsAPIResponse<BodyContactUsInterface>,
    AxiosError<ContactUsAPIResponse<BodyContactUsInterface>>,
    BodyContactUsInterface
  >
) {
  return useMutation<
    ContactUsAPIResponse<BodyContactUsInterface>,
    AxiosError<ContactUsAPIResponse<BodyContactUsInterface>>,
    BodyContactUsInterface
  >(postContactUs, options);
}
