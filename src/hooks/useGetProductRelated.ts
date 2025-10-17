import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';
import { ProductItemInterface } from 'interfaces/ProductInterface';

const getProductRelated = async ({ id }: { id: string }) => {
  const { data } = await axiosServiceInstance.get<APIResponse<Array<ProductItemInterface>>>(
    `/products/related/${id}`
  );
  return data;
};

const useGetProductRelated = ({
  id,
  options
}: {
  id: string;
  options?: UseQueryOptions<APIResponse<Array<ProductItemInterface>>, APIError>;
}) => {
  return useQuery({
    queryKey: ['useGetProductRelated', id],
    queryFn: () => getProductRelated({ id }),
    ...options
  });
};

export default useGetProductRelated;
