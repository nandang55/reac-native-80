// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import { renderHook } from '@testing-library/react-hooks';
import useGetProductDetail from 'hooks/useGetProductDetail';

import { wrapper } from '../../core/utils/testing-library-utils';

describe('user get product detail', () => {
  it('should fire useGetProductDetail', async () => {
    const { result, waitFor } = renderHook(
      () => useGetProductDetail({ id: '9b6f0795-a746-466f-afd7-a5e72d7b6f8a' }),
      {
        wrapper
      }
    );

    await waitFor(() => result.current.isSuccess, { timeout: 30000 });
    expect(result.current.data?.error === undefined || result.current.data.error === false).toBe(
      true
    );

    expect(result.current.data?.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        category_id: expect.any(String),
        main_image_link: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        is_sold_out: expect.any(Boolean),
        lowest_price: expect.any(Number),
        highest_price: expect.any(Number),
        photos: expect.any(Array),
        option_sequence: expect.any(Array),
        variant_stock_keys: expect.any(Object)
      })
    );
  });
});
