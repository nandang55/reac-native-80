import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';

const getDeleteReasonList = async () => {
  const { data } =
    await axiosServiceInstance.get<APIResponse<Array<string>>>('/users/deleted_reason');
  return data;
};

const useGetDeleteReasonList = ({
  options
}: {
  options?: UseQueryOptions<APIResponse<Array<string>>, APIError>;
}) => {
  return useQuery({
    queryKey: ['useGetDeleteReasonList'],
    queryFn: () => getDeleteReasonList(),
    ...options
  });
};

export default useGetDeleteReasonList;
