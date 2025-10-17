import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';
import { Platform } from 'react-native';

interface GetAppVersionParams {
  current_version: string;
}
interface GetAppVersionResponse {
  id: string;
  version: string;
  link: string;
  is_mandatory: boolean;
  is_notify: boolean;
  content?: {
    title?: string;
    message?: string;
  };
}

const getAppVersion = async ({
  platform,
  params
}: {
  platform: typeof Platform.OS;
  params: GetAppVersionParams;
}) => {
  const { data } = await axiosServiceInstance.get(`/app-versions/${platform}`, { params });
  return data;
};

const useGetAppVersion = ({
  platform,
  params,
  options
}: {
  platform: typeof Platform.OS;
  params: GetAppVersionParams;
  options?: UseQueryOptions<APIResponse<GetAppVersionResponse>, APIError>;
}) => {
  return useQuery({
    queryKey: ['useGetAppVersion'],
    queryFn: () => getAppVersion({ platform, params }),
    ...options
  });
};

export default useGetAppVersion;
