import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';
import { BannerInterface } from 'interfaces/ProductInterface';

const getCollectionById = async ({ id }: { id: string }) => {
  const { data } = await axiosServiceInstance.get<APIResponse<BannerInterface>>(
    `/collections/${id}`
  );
  return data;
};

const useGetCollectionById = ({
  id,
  options
}: {
  id: string;
  options?: UseQueryOptions<APIResponse<BannerInterface>, APIError>;
}) => {
  return useQuery({
    queryKey: ['useGetCollectionById'],
    queryFn: () => getCollectionById({ id }),
    ...options
  });
};

export default useGetCollectionById;
