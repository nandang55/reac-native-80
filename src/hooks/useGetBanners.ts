import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';
import { ResponseGetBannerInterface } from 'interfaces/ProductInterface';

const getBanners = async () => {
  const { data } =
    await axiosServiceInstance.get<APIResponse<ResponseGetBannerInterface>>('/banners');
  return data;
};

const useGetBanners = ({
  options
}: {
  options?: UseQueryOptions<APIResponse<ResponseGetBannerInterface>, APIError>;
}) => {
  return useQuery({
    queryKey: ['useGetBanners'],
    queryFn: () => getBanners(),
    ...options
  });
};

export default useGetBanners;
