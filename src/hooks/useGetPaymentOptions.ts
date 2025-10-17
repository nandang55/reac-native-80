import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';
import { PaymentOptionInterface } from 'interfaces/CheckoutInterface';

const getPaymentOptions = async () => {
  const { data } =
    await axiosServiceInstance.get<APIResponse<Array<PaymentOptionInterface>>>(
      '/payment/paymentOptions'
    );
  return data;
};

const useGetPaymentOptions = ({
  options
}: {
  options?: UseQueryOptions<APIResponse<Array<PaymentOptionInterface>>, APIError>;
}) => {
  return useQuery({
    queryKey: ['useGetPaymentOptions'],
    queryFn: () => getPaymentOptions(),
    ...options
  });
};

export default useGetPaymentOptions;
