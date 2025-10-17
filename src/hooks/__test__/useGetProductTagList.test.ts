// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import { renderHook } from '@testing-library/react-hooks';

import { wrapper } from '../../core/utils/testing-library-utils';
import useGetProductTagList from '../useGetProductTagList';

describe('user get product tag list', () => {
  it('should fire useGetProductTagList', async () => {
    const { result, waitFor } = renderHook(
      () =>
        useGetProductTagList({
          tag: 'best-of-sricandy',
          params: {
            page: 1,
            limit: 5
          }
        }),
      {
        wrapper
      }
    );

    await waitFor(() => result.current.isSuccess, { timeout: 30000 });

    expect(result.current.data?.pages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          data: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              name: expect.any(String),
              selling_price: expect.any(Number),
              main_image_link: expect.any(String)
            })
          ])
        })
      ])
    );
  });
});
