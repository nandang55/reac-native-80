import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { PrimaryAdressInterface } from 'interfaces/AddressInterface';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';

const getPrimaryShippingAddress = async () => {
  const { data } = await axiosServiceInstance.get<APIResponse<PrimaryAdressInterface>>(
    '/shippingAddresses/myPrimary'
  );
  return data;
};

const useGetPrimaryShippingAddress = ({
  options
}: {
  options?: UseQueryOptions<APIResponse<PrimaryAdressInterface>, APIError>;
}) => {
  return useQuery({
    queryKey: ['useGetPrimaryShippingAddress'],
    queryFn: () => getPrimaryShippingAddress(),
    ...options
  });
};

export default useGetPrimaryShippingAddress;
