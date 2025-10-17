import { useInfiniteQuery, UseInfiniteQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';
import { ProductItemInterface } from 'interfaces/ProductInterface';

interface ProductCategoryParams {
  page: number;
  limit: number;
}

const getProductCategory = async ({
  id,
  params
}: {
  id: string;
  params: ProductCategoryParams;
}) => {
  const { data } = await axiosServiceInstance.get<APIResponse<Array<ProductItemInterface>>>(
    `/products/catalog?category_id=${id}`,
    { params }
  );
  return data;
};

export const useGetProductCategory = ({
  id,
  params,
  options
}: {
  id: string;
  params: ProductCategoryParams;
  options?: UseInfiniteQueryOptions<APIResponse<Array<ProductItemInterface>>, APIError>;
}) => {
  return useInfiniteQuery({
    queryKey: ['useGetProductCategory', id],
    queryFn: ({ pageParam = 1 }) =>
      getProductCategory({ id, params: { ...params, page: pageParam } }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getNextPageParam: (lastPage: any) => {
      if (lastPage.meta && lastPage.meta?.current_page < lastPage.meta?.last_page) {
        return lastPage.meta?.current_page + 1;
      }
    },
    ...options
  });
};
