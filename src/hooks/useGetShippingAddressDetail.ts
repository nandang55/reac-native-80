import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { ResponseAddressInfo } from 'interfaces/AddressInterface';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';

const getShippingAddressDetail = async ({ id }: { id: string }) => {
  const { data } = await axiosServiceInstance.get<APIResponse<ResponseAddressInfo>>(
    `/shippingAddresses/${id}`
  );
  return data;
};

const useGetShippingAddressDetail = ({
  id,
  options
}: {
  id: string;
  options?: UseQueryOptions<APIResponse<ResponseAddressInfo>, APIError>;
}) => {
  return useQuery({
    queryKey: ['useGetShippingAddressDetail'],
    queryFn: () => getShippingAddressDetail({ id }),
    ...options
  });
};

export default useGetShippingAddressDetail;
