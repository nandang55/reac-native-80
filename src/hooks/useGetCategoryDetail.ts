import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';
import { CategoryDetailInterface } from 'interfaces/ProductInterface';

const getCategoryDetail = async ({ id }: { id: string }) => {
  const { data } = await axiosServiceInstance.get<APIResponse<CategoryDetailInterface>>(
    `/categories/${id}`
  );
  return data;
};

const useGetCategoryDetail = ({
  id,
  options
}: {
  id: string;
  options?: UseQueryOptions<APIResponse<CategoryDetailInterface>, APIError>;
}) => {
  return useQuery({
    queryKey: ['useGetCategoryDetail', id],
    queryFn: () => getCategoryDetail({ id }),
    ...options
  });
};

export default useGetCategoryDetail;
