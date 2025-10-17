import { useInfiniteQuery, UseInfiniteQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';
import { NotificationInterface } from 'interfaces/NotificationInterface';

interface NotificationListParams {
  page: number;
  per_page: number;
}

const getNotificationList = async ({ params }: { params: NotificationListParams }) => {
  const { data } = await axiosServiceInstance.get<APIResponse<Array<NotificationInterface>>>(
    '/notification/myList',
    { params }
  );
  return data;
};

export const useGetNotificationList = ({
  params,
  options
}: {
  params: NotificationListParams;
  options?: UseInfiniteQueryOptions<APIResponse<Array<NotificationInterface>>, APIError>;
}) => {
  return useInfiniteQuery({
    queryKey: ['useGetNotificationList', params],
    queryFn: ({ pageParam = 1 }) => getNotificationList({ params: { ...params, page: pageParam } }),
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
