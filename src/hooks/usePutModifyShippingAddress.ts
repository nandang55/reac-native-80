import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { BaseAddressInterface } from 'interfaces/AddressInterface';
import { APIResponse } from 'interfaces/BaseAPIResponse';
import { ResponseModifyInterface } from 'interfaces/ProfileInterface';

const putModifyShippingAddress = async (
  addressId: string,
  body: BaseAddressInterface
): Promise<APIResponse<unknown>> => {
  const { data } = await axiosServiceInstance.put(`/shippingAddresses/${addressId}`, body);
  return data;
};

export function usePutModifyShippingAddress(
  addressId: string,
  options: UseMutationOptions<
    APIResponse<unknown>,
    AxiosError<ResponseModifyInterface>,
    BaseAddressInterface
  >
) {
  return useMutation<
    APIResponse<unknown>,
    AxiosError<ResponseModifyInterface>,
    BaseAddressInterface
  >((body) => putModifyShippingAddress(addressId, body), options);
}
