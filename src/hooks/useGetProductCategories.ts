import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { APIError, APIResponse } from 'interfaces/BaseAPIResponse';
import { ProductItemInterface } from 'interfaces/ProductInterface';
interface ProductCategoryParams {
  page: number;
  limit: number;
}
export interface ProductCategoriesResponse {
  categoryId: string;
  data: APIResponse<Array<ProductItemInterface>>;
}
const getProductCategories = async ({
  id,
  params
}: {
  id: Array<string>;
  params: ProductCategoryParams;
}) => {
  const requests = id.map((categoryId) =>
    axiosServiceInstance.get<APIResponse<Array<ProductItemInterface>>>(
      `/products/catalog?category_id=${categoryId}`,
      { params }
    )
  );
  const responses = await Promise.all(requests);
  // Create an array to store data as { categoryId, data }
  return responses.map(({ data }, index) => ({
    categoryId: id[index],
    data: data
  }));
};
export const useGetProductCategories = ({
  id,
  params,
  options
}: {
  id: Array<string>;
  params: ProductCategoryParams;
  options?: UseQueryOptions<Array<ProductCategoriesResponse>, APIError>;
}) => {
  return useQuery({
    queryKey: ['useGetCategoriseList', id],
    queryFn: () => getProductCategories({ id, params }),
    ...options
  });
};
