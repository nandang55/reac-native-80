import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';
import { ShippingMethodListInterface } from 'interfaces/CheckoutInterface';

const getShippingMethodList = async ({ id }: { id: string }) => {
  const { data } = await axiosServiceInstance.get<APIResponse<Array<ShippingMethodListInterface>>>(
    `shippingMethods?shipping_address_id=${id}`
  );
  return data;
};

const useGetShippingMethodList = ({
  id,
  options
}: {
  id: string;
  options?: UseQueryOptions<APIResponse<Array<ShippingMethodListInterface>>, APIError>;
}) => {
  return useQuery({
    queryKey: ['useGetShippingMethodList', id],
    queryFn: () => getShippingMethodList({ id }),
    ...options
  });
};

export default useGetShippingMethodList;
