import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';
import { BanklistInterface } from 'interfaces/CheckoutInterface';

const getBankList = async () => {
  const { data } =
    await axiosServiceInstance.get<APIResponse<Array<BanklistInterface>>>('/payment/vaBank');
  return data;
};

const useGetBankList = ({
  options
}: {
  options?: UseQueryOptions<APIResponse<Array<BanklistInterface>>, APIError>;
}) => {
  return useQuery({
    queryKey: ['useGetBankList'],
    queryFn: () => getBankList(),
    ...options
  });
};

export default useGetBankList;
