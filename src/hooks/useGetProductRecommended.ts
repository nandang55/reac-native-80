import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';
import { ProductItemInterface } from 'interfaces/ProductInterface';

const getProductRecommended = async ({ id }: { id: string }) => {
  const { data } = await axiosServiceInstance.get<APIResponse<Array<ProductItemInterface>>>(
    `/products/recommended/${id}`
  );
  return data;
};

const useGetProductRecommended = ({
  id,
  options
}: {
  id: string;
  options?: UseQueryOptions<APIResponse<Array<ProductItemInterface>>, APIError>;
}) => {
  return useQuery({
    queryKey: ['useGetProductRecommended', id],
    queryFn: () => getProductRecommended({ id }),
    ...options
  });
};

export default useGetProductRecommended;
