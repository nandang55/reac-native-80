import { renderHook } from '@testing-library/react-hooks';

import { wrapper } from '../../core/utils/testing-library-utils';
import useGetCategoryDetail from '../useGetCategoryDetail';

describe('user get category detail', () => {
  it('should fire useGetCategoryDetail', async () => {
    const categoryId = 'af184f90-4c77-4034-82c7-672f16d325bf';

    const { result, waitFor } = renderHook(() => useGetCategoryDetail({ id: categoryId }), {
      wrapper
    });

    await waitFor(() => result.current.isSuccess, { timeout: 30000 });
    expect(result.current.data?.error === undefined || result.current.data?.error === false).toBe(
      true
    );

    expect(result.current.data?.data).toEqual(
      expect.objectContaining({
        banners: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            // eslint-disable-next-line camelcase
            image_link: expect.any(String)
          })
        ])
      })
    );
  });
});
