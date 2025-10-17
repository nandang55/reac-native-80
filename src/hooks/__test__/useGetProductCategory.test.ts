import { renderHook } from '@testing-library/react-hooks';

import { wrapper } from '../../core/utils/testing-library-utils';
import { useGetProductCategory } from '../useGetProductCategory';

describe('user get one category list', () => {
  it('should fire useGetProductCategory', async () => {
    const categoryId = 'af184f90-4c77-4034-82c7-672f16d325bf';

    const { result, waitFor } = renderHook(
      () => useGetProductCategory({ id: categoryId, params: { page: 1, limit: 1 } }),
      {
        wrapper
      }
    );

    await waitFor(() => result.current.isSuccess, { timeout: 30000 });
    expect(result.current.isSuccess).toBe(true);

    expect(result.current.data?.pages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          data: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              // eslint-disable-next-line camelcase
              selling_price: expect.any(Number),
              // eslint-disable-next-line camelcase
              main_image_link: expect.any(String),
              name: expect.any(String)
            })
          ])
        })
      ])
    );
  });
});
