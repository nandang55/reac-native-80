import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIResponse } from 'interfaces/BaseAPIResponse';
import { PromoCodeInterface, ValidatePromoPayloadInterface } from 'interfaces/CheckoutInterface';

const postValidatePromo = async (
  body: ValidatePromoPayloadInterface
): Promise<APIResponse<PromoCodeInterface>> => {
  const { data } = await axiosServiceInstance.post('/promoCodes/validate', body);
  return data;
};

export function usePostValidatePromo(
  options?: UseMutationOptions<
    APIResponse<PromoCodeInterface>,
    AxiosError<APIResponse<PromoCodeInterface>>,
    ValidatePromoPayloadInterface
  >
) {
  return useMutation<
    APIResponse<PromoCodeInterface>,
    AxiosError<APIResponse<PromoCodeInterface>>,
    ValidatePromoPayloadInterface
  >(postValidatePromo, options);
}
