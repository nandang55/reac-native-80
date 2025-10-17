import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';
import { BannerInterface } from 'interfaces/ProductInterface';

const getCollections = async () => {
  const { data } =
    await axiosServiceInstance.get<APIResponse<Array<BannerInterface>>>('/collections');
  return data;
};

const useGetCollections = ({
  options
}: {
  options?: UseQueryOptions<APIResponse<Array<BannerInterface>>, APIError>;
}) => {
  return useQuery({
    queryKey: ['useGetCollections'],
    queryFn: () => getCollections(),
    ...options
  });
};

export default useGetCollections;
