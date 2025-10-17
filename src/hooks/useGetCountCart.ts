import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';
import { CountCartInterface } from 'interfaces/CartInterface';
const getCountCart = async () => {
  const { data } = await axiosServiceInstance.get<APIResponse<CountCartInterface>>('/carts/count');
  return data;
};
const useGetCountCart = ({
  options
}: {
  options?: UseQueryOptions<APIResponse<CountCartInterface>, APIError>;
}) => {
  return useQuery({
    queryKey: ['useGetCountCart'],
    queryFn: () => getCountCart(),
    ...options
  });
};
export default useGetCountCart;
