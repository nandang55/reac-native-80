import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { BaseAddressInterface, ResponseAddressInfo } from 'interfaces/AddressInterface';
import { APIResponse } from 'interfaces/BaseAPIResponse';

const postCreateShippingAddress = async (
  body: BaseAddressInterface
): Promise<APIResponse<ResponseAddressInfo>> => {
  const { data } = await axiosServiceInstance.post('/shippingAddresses', body);
  return data;
};

export function usePostCreateShippingAddress(
  options: UseMutationOptions<
    APIResponse<ResponseAddressInfo>,
    AxiosError<APIResponse<BaseAddressInterface>>,
    BaseAddressInterface
  >
) {
  return useMutation<
    APIResponse<ResponseAddressInfo>,
    AxiosError<APIResponse<BaseAddressInterface>>,
    BaseAddressInterface
  >(postCreateShippingAddress, options);
}
