import { useInfiniteQuery, UseInfiniteQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';
import { ProductItemInterface } from 'interfaces/ProductInterface';

interface ProductCollectionsParams {
  page: number;
  limit: number;
}

const getProductCollections = async ({
  id,
  params
}: {
  id: string;
  params: ProductCollectionsParams;
}) => {
  const { data } = await axiosServiceInstance.get<APIResponse<Array<ProductItemInterface>>>(
    `/products/collections/${id}`,
    { params }
  );
  return data;
};

export const useGetProductCollections = ({
  id,
  params,
  options
}: {
  id: string;
  params: ProductCollectionsParams;
  options?: UseInfiniteQueryOptions<APIResponse<Array<ProductItemInterface>>, APIError>;
}) => {
  return useInfiniteQuery({
    queryKey: ['useGetProductCollections', id],
    queryFn: ({ pageParam = 1 }) =>
      getProductCollections({ id, params: { ...params, page: pageParam } }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta && lastPage.meta?.current_page < lastPage.meta?.last_page) {
        return lastPage.meta?.current_page + 1;
      }
      return undefined;
    },
    ...options
  });
};
