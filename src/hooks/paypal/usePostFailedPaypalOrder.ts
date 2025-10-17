import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIResponse } from 'interfaces/BaseAPIResponse';

interface FailedPaypalOrderInterface {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paypalResponse: any;
  token: string;
}

const postFailedPaypalOrder = async ({
  id,
  paypalResponse,
  token
}: FailedPaypalOrderInterface): Promise<APIResponse<unknown>> => {
  const { data } = await axiosServiceInstance.post(
    `/orders/failedPaypalLog/${id}`,
    { ...paypalResponse },
    {
      headers: { 'x-paypal-token': token }
    }
  );
  return data;
};

export function usePostFailedPaypalOrder(
  mutateFn?: UseMutationOptions<APIResponse<unknown>, AxiosError, FailedPaypalOrderInterface>
) {
  return useMutation<APIResponse<unknown>, AxiosError, FailedPaypalOrderInterface>(
    postFailedPaypalOrder,
    mutateFn
  );
}
