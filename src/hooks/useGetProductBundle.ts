import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';
import { ProductItemInterface } from 'interfaces/ProductInterface';

const getProductBundle = async () => {
  const { data } =
    await axiosServiceInstance.get<APIResponse<Array<ProductItemInterface>>>('/products/bundle');
  return data;
};

export const useGetProductBundle = ({
  options
}: {
  options?: UseQueryOptions<APIResponse<Array<ProductItemInterface>>, APIError>;
}) => {
  return useQuery({
    queryKey: ['useGetProductBundle'],
    queryFn: () => getProductBundle(),
    ...options
  });
};
