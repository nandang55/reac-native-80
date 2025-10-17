import { renderHook } from '@testing-library/react-hooks';
import useGetProductRelated from 'hooks/useGetProductRelated';

import { wrapper } from '../../core/utils/testing-library-utils';

describe('user get product related', () => {
  it('should fire useGetProductRelated', async () => {
    const { result, waitFor } = renderHook(
      () => useGetProductRelated({ id: '9b6f0795-a746-466f-afd7-a5e72d7b6f8a' }),
      {
        wrapper
      }
    );

    await waitFor(() => result.current.isSuccess, { timeout: 30000 });
    expect(result.current.data?.error === undefined || result.current.data.error === false).toBe(
      true
    );

    expect(result.current.data?.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          // eslint-disable-next-line camelcase
          selling_price: expect.any(Number),
          // eslint-disable-next-line camelcase
          main_image_link: expect.any(String),
          name: expect.any(String)
        })
      ])
    );
  });
});
