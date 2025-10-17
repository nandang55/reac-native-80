import { renderHook } from '@testing-library/react-hooks';

import { wrapper } from '../../core/utils/testing-library-utils';
import useGetCategoryList from '../useGetCategoryList';
import { useGetProductCategories } from '../useGetProductCategories';

describe('user get product categories', () => {
  it('should fire useGetCategoryList and useGetProductCategories', async () => {
    const { result: categoryListResult, waitFor: waitForCategoryList } = renderHook(
      () => useGetCategoryList({}),
      {
        wrapper
      }
    );

    await waitForCategoryList(() => categoryListResult.current.isSuccess, { timeout: 30000 });
    expect(
      categoryListResult.current.data?.error === undefined ||
        categoryListResult.current.data.error === false
    ).toBe(true);

    const temp: Array<string> = [];
    categoryListResult.current.data?.data.map((e) => temp.push(e.id));

    const { result: orderDetailResult, waitFor: waitForOrderDetail } = renderHook(
      () =>
        useGetProductCategories({
          id: temp || [],
          params: { page: 1, limit: 5 }
        }),
      {
        wrapper
      }
    );

    await waitForOrderDetail(() => orderDetailResult.current.isSuccess, { timeout: 30000 });
    expect(orderDetailResult.current.isSuccess).toBe(true);
  });
});
