import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';
import { ProductItemInterface } from 'interfaces/ProductInterface';

const getNewArrivals = async () => {
  const { data } =
    await axiosServiceInstance.get<APIResponse<Array<ProductItemInterface>>>(
      '/products/newArrival'
    );
  return data;
};

const useGetNewArrivals = ({
  options
}: {
  options?: UseQueryOptions<APIResponse<Array<ProductItemInterface>>, APIError>;
}) => {
  return useQuery({
    queryKey: ['useGetNewArrivals'],
    queryFn: () => getNewArrivals(),
    ...options
  });
};

export default useGetNewArrivals;
