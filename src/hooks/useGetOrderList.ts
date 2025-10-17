import { useInfiniteQuery, UseInfiniteQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';
import { OrderListInterface } from 'interfaces/OrderInterface';

interface OrderListParams {
  page: number;
  per_page: number;
}

const getOrderList = async ({ params }: { params: OrderListParams }) => {
  const { data } = await axiosServiceInstance.get<APIResponse<Array<OrderListInterface>>>(
    '/orders',
    { params }
  );
  return data;
};

export const useGetOrderList = ({
  params,
  options
}: {
  params: OrderListParams;
  options?: UseInfiniteQueryOptions<APIResponse<Array<OrderListInterface>>, APIError>;
}) => {
  return useInfiniteQuery({
    queryKey: ['useGetOrderList', params],
    queryFn: ({ pageParam = 1 }) => getOrderList({ params: { ...params, page: pageParam } }),
    getNextPageParam: (lastPage) => {
      if (lastPage.links?.next !== null && lastPage.meta?.current_page) {
        return lastPage.meta?.current_page + 1;
      } else {
        return null;
      }
    },
    ...options
  });
};
