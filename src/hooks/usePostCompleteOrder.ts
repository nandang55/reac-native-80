import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIResponse } from 'interfaces/BaseAPIResponse';

const postCompleteOrder = async ({ id }: { id: string }): Promise<APIResponse<unknown>> => {
  const { data } = await axiosServiceInstance.post(`/orders/${id}/completed`);
  return data;
};

export function usePostCompleteOrder(
  mutateFn?: UseMutationOptions<APIResponse<unknown>, AxiosError, { id: string }>
) {
  return useMutation<APIResponse<unknown>, AxiosError, { id: string }>(postCompleteOrder, mutateFn);
}

interface CompletePaypalOrderInterface {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paypalResponse: any;
  token: string;
}

const postCompletePaypalOrder = async ({
  id,
  paypalResponse,
  token
}: CompletePaypalOrderInterface): Promise<APIResponse<unknown>> => {
  const { data } = await axiosServiceInstance.post(
    `/orders/paypal/${id}`,
    { ...paypalResponse },
    {
      headers: { 'x-paypal-token': token }
    }
  );
  return data;
};

export function usePostCompletePaypalOrder(
  mutateFn?: UseMutationOptions<APIResponse<unknown>, AxiosError, CompletePaypalOrderInterface>
) {
  return useMutation<APIResponse<unknown>, AxiosError, CompletePaypalOrderInterface>(
    postCompletePaypalOrder,
    mutateFn
  );
}
