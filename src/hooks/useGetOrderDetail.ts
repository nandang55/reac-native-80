import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';
import { OrderDetailInterface } from 'interfaces/OrderInterface';

const getOrderDetail = async ({ id }: { id: string }) => {
  const { data } = await axiosServiceInstance.get<APIResponse<OrderDetailInterface>>(
    `/orders/${id}`
  );
  return data;
};

const useGetOrderDetail = ({
  id,
  options
}: {
  id: string;
  options?: UseQueryOptions<APIResponse<OrderDetailInterface>, APIError>;
}) => {
  return useQuery({
    queryKey: ['useGetOrderDetail', id],
    queryFn: () => getOrderDetail({ id }),
    ...options
  });
};

export default useGetOrderDetail;
