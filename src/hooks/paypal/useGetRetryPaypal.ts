import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';
import { CheckoutResponse } from 'interfaces/CheckoutInterface';

const getRetryPaypal = async (id: string): Promise<APIResponse<CheckoutResponse>> => {
  const { data } = await axiosServiceInstance.get(`/orders/retryAccessPaypal/${id}`);
  return data;
};

const useGetRetryPaypal = ({
  id,
  options
}: {
  id: string;
  options?: UseQueryOptions<APIResponse<CheckoutResponse>, APIError>;
}) => {
  return useQuery({
    queryKey: ['useGetRetryPaypal', id],
    queryFn: () => getRetryPaypal(id),
    ...options
  });
};

export default useGetRetryPaypal;
