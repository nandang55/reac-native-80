import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';
import { CategoryListInterface } from 'interfaces/ProductInterface';

const getCategoryList = async () => {
  const { data } =
    await axiosServiceInstance.get<APIResponse<Array<CategoryListInterface>>>('/categories');
  return data;
};

const useGetCategoryList = ({
  options
}: {
  options?: UseQueryOptions<APIResponse<Array<CategoryListInterface>>, APIError>;
}) => {
  return useQuery({
    queryKey: ['useGetCategoryList'],
    queryFn: () => getCategoryList(),
    ...options
  });
};

export default useGetCategoryList;
