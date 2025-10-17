import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';
import { ProductDetailInterface } from 'interfaces/ProductDetailInterface';

const getProductDetail = async ({ id }: { id: string }) => {
  const { data } = await axiosServiceInstance.get<APIResponse<ProductDetailInterface>>(
    `/products/${id}`
  );
  return data;
};

const useGetProductDetail = ({
  id,
  options
}: {
  id: string;
  options?: UseQueryOptions<APIResponse<ProductDetailInterface>, APIError>;
}) => {
  return useQuery({
    queryKey: ['useGetProductDetail', id],
    queryFn: () => getProductDetail({ id }),
    ...options
  });
};

export default useGetProductDetail;
