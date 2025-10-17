import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { AddressSuggestionInterface } from 'interfaces/AddressInterface';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';

interface AddressSuggestionParam {
  postalCode: string;
}

const getAddressSuggestion = async ({ params }: { params: AddressSuggestionParam }) => {
  const { data } = await axiosServiceInstance.get<APIResponse<AddressSuggestionInterface>>(
    '/postal_codes/search_address',
    { params }
  );
  return data;
};

export const useGetAddressSuggestion = ({
  params,
  options
}: {
  params: AddressSuggestionParam;
  options?: UseQueryOptions<APIResponse<AddressSuggestionInterface>, APIError>;
}) => {
  return useQuery({
    queryKey: ['useGetAddressSuggestion', params.postalCode],
    queryFn: () => getAddressSuggestion({ params }),
    ...options
  });
};
