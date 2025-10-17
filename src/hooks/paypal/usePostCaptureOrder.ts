// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { axiosPaypalServiceInstance } from 'core/axios/axiosPaypalInstance';
import { APIResponse } from 'interfaces/BaseAPIResponse';
import { PostCaptureOrderInterface } from 'interfaces/OrderInterface';

const postCaptureOrder = async ({
  orderId,
  failed
}: PostCaptureOrderInterface): Promise<APIResponse<unknown>> => {
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json'
  };

  if (failed) {
    headers['PayPal-Mock-Response'] = JSON.stringify({
      mock_application_codes: 'INSTRUMENT_DECLINED'
    });
  }

  const { data } = await axiosPaypalServiceInstance.post(
    `/v2/checkout/orders/${orderId}/capture`,
    {},
    //FIXME: somehow paypal return error without this
    {
      headers
    }
  );
  return data;
};

export function usePostCaptureOrder(
  mutateFn?: UseMutationOptions<APIResponse<unknown>, AxiosError, PostCaptureOrderInterface>
) {
  return useMutation<APIResponse<unknown>, AxiosError, PostCaptureOrderInterface>(
    postCaptureOrder,
    mutateFn
  );
}
