import { useInfiniteQuery, UseInfiniteQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';
import { WishlistInterface } from 'interfaces/WishlistInterface';

interface WishlistsParams {
  page: number;
  per_page: number;
}

const getWishlists = async ({ params }: { params: WishlistsParams }) => {
  const { data } = await axiosServiceInstance.get<APIResponse<Array<WishlistInterface>>>(
    '/wishlists',
    { params }
  );
  return data;
};

export const useGetWishlists = ({
  params,
  options
}: {
  params: WishlistsParams;
  options?: UseInfiniteQueryOptions<APIResponse<Array<WishlistInterface>>, APIError>;
}) => {
  return useInfiniteQuery({
    queryKey: ['useGetWishlists', params],
    queryFn: ({ pageParam = 1 }) => getWishlists({ params: { ...params, page: pageParam } }),
    getNextPageParam: (lastPage) => {
      if (lastPage?.links?.next !== null && lastPage?.meta?.current_page) {
        return lastPage?.meta?.current_page + 1;
      } else {
        return null;
      }
    },
    ...options
  });
};
