import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';
import { CountWishlistInterface } from 'interfaces/WishlistInterface';

const getCountWishlist = async () => {
  const { data } =
    await axiosServiceInstance.get<APIResponse<CountWishlistInterface>>('/wishlists/count');
  return data;
};

const useGetCountWishlist = ({
  options
}: {
  options?: UseQueryOptions<APIResponse<CountWishlistInterface>, APIError>;
}) => {
  return useQuery({
    queryKey: ['useGetCountWishlist'],
    queryFn: () => getCountWishlist(),
    ...options
  });
};
export default useGetCountWishlist;
