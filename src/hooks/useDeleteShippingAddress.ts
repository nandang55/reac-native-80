import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';

export interface DeleteShippingAddressInterface {
  addressId: string;
}

const deleteShippingAddress = async ({ addressId }: DeleteShippingAddressInterface) => {
  const { data } = await axiosServiceInstance.delete<APIResponse<unknown>>(
    `/shippingAddresses/${addressId}`
  );
  return data;
};

export function useDeleteShippingAddress(
  options: UseMutationOptions<APIResponse<unknown>, APIError, DeleteShippingAddressInterface>
) {
  return useMutation(
    (addressId: DeleteShippingAddressInterface) => deleteShippingAddress(addressId),
    options
  );
}
