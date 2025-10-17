import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { ResponseAddressInfo } from 'interfaces/AddressInterface';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';

const getShippingAddressList = async () => {
  const { data } =
    await axiosServiceInstance.get<APIResponse<Array<ResponseAddressInfo>>>('/shippingAddresses');
  return data;
};

const useGetShippingAddressList = ({
  options
}: {
  options?: UseQueryOptions<APIResponse<Array<ResponseAddressInfo>>, APIError>;
}) => {
  return useQuery({
    queryKey: ['useGetShippingAddressList'],
    queryFn: () => getShippingAddressList(),
    ...options
  });
};

export default useGetShippingAddressList;
