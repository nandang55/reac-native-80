import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { FacetDataInterface } from 'interfaces/AlgoliaInterface';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';

const getFacets = async () => {
  const { data } =
    await axiosServiceInstance.get<APIResponse<Array<FacetDataInterface>>>('/facets');
  return data;
};

const useGetFacets = ({
  options
}: {
  options?: UseQueryOptions<APIResponse<Array<FacetDataInterface>>, APIError>;
}) => {
  return useQuery({
    queryKey: ['useGetFacets'],
    queryFn: () => getFacets(),
    ...options
  });
};

export default useGetFacets;
