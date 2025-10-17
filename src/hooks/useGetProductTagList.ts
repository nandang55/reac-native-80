import { useInfiniteQuery, UseInfiniteQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';
import { ProductItemInterface } from 'interfaces/ProductInterface';

interface ProductTagListParam {
  page: number;
  limit: number;
}

const getProductTagList = async ({ tag, params }: { tag: string; params: ProductTagListParam }) => {
  const { data } = await axiosServiceInstance.get<APIResponse<Array<ProductItemInterface>>>(
    `/products/tags/${tag}`,
    { params }
  );
  return data;
};

const useGetProductTagList = ({
  tag,
  params,
  options
}: {
  tag: string;
  params: ProductTagListParam;
  options?: UseInfiniteQueryOptions<APIResponse<Array<ProductItemInterface>>, APIError>;
}) => {
  return useInfiniteQuery({
    queryKey: ['useGetProductTagList', tag],
    queryFn: ({ pageParam = 1 }) =>
      getProductTagList({ tag, params: { ...params, page: pageParam } }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getNextPageParam: (lastPage: any) => {
      if (lastPage.meta && lastPage.meta?.current_page < lastPage.meta?.last_page) {
        return lastPage.meta?.current_page + 1;
      }
    },
    ...options
  });
};

export default useGetProductTagList;
