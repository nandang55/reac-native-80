import { renderHook } from '@testing-library/react-hooks';

import { wrapper } from '../../core/utils/testing-library-utils';
import useGetBanners from '../useGetBanners';

describe('user get banners list', () => {
  it('should fire useGetBanners', async () => {
    const { result, waitFor } = renderHook(() => useGetBanners({}), {
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
          image_link: expect.any(String)
        })
      ])
    );
  });
});
