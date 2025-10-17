import { renderHook } from '@testing-library/react-hooks';

import { wrapper } from '../../core/utils/testing-library-utils';
import useGetNewArrivals from '../useGetNewArrivals';

describe('user get new arrival list', () => {
  it('should fire useGetNewArrivals', async () => {
    const { result, waitFor } = renderHook(() => useGetNewArrivals({}), {
      wrapper
    });

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
