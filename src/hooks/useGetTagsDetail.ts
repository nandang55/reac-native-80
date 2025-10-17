import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';
import { TagDetailInterface } from 'interfaces/TagInterface';

const getTagsDetail = async (tag: string) => {
  const { data } = await axiosServiceInstance.get<APIResponse<TagDetailInterface>>(`/tags/${tag}`);
  return data;
};

const useGetTagsDetail = ({
  tag,
  options
}: {
  tag: string;
  options?: UseQueryOptions<APIResponse<TagDetailInterface>, APIError>;
}) => {
  return useQuery({
    queryKey: ['useGetTagsDetail', tag],
    queryFn: () => getTagsDetail(tag),
    ...options
  });
};

export default useGetTagsDetail;
