import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';
import { ProfileInterface } from 'interfaces/ProfileInterface';

const getProfile = async () => {
  const { data } = await axiosServiceInstance.get<APIResponse<ProfileInterface>>('/me');
  return data;
};

const useGetProfile = ({
  options
}: {
  options?: UseQueryOptions<APIResponse<ProfileInterface>, APIError>;
}) => {
  return useQuery({
    queryKey: ['useGetProfile'],
    queryFn: () => getProfile(),
    ...options
  });
};

export default useGetProfile;
