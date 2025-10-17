import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';
import { CartInterface } from 'interfaces/CartInterface';

const getCartList = async () => {
  const { data } = await axiosServiceInstance.get<APIResponse<Array<CartInterface>>>('/carts');
  return data;
};

const useGetCartList = ({
  options
}: {
  options?: UseQueryOptions<APIResponse<Array<CartInterface>>, APIError>;
}) => {
  return useQuery({
    queryKey: ['useGetCartList'],
    queryFn: () => getCartList(),
    ...options
  });
};

export default useGetCartList;
