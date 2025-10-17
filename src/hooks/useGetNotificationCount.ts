import { useQuery } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIResponse } from 'interfaces/BaseAPIResponse';
import { NotificationCountInterface } from 'interfaces/NotificationInterface';

const getNotificationCount = async () => {
  const { data } = await axiosServiceInstance.get<APIResponse<NotificationCountInterface>>(
    '/notification/countUnread'
  );
  return data.data;
};

export const useGetNotificationCount = () => {
  return useQuery({
    queryKey: ['useGetNotificationCount'],
    queryFn: () => getNotificationCount()
  });
};
