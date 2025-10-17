import { useMutation } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIResponse } from 'interfaces/BaseAPIResponse';
import { NotificationReadInterface } from 'interfaces/NotificationInterface';

const putNotificationRead = async (id: string): Promise<APIResponse<NotificationReadInterface>> => {
  const { data } = await axiosServiceInstance.put<APIResponse<NotificationReadInterface>>(
    `/notification/${id}/read`
  );
  return data;
};

export function usePutNotificationRead(onSuccess: () => void) {
  return useMutation({ mutationFn: (id: string) => putNotificationRead(id), onSuccess });
}
