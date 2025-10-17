// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import { renderHook } from '@testing-library/react-hooks';

import { wrapper } from '../../core/utils/testing-library-utils';
import useGetAppVersion from '../useGetAppVersion';

describe('user get app version', () => {
  it('should fire useGetAppVersion', async () => {
    const platform = 'android';

    const { result, waitFor } = renderHook(
      () => useGetAppVersion({ platform: platform, params: { current_version: '1.14.0' } }),
      {
        wrapper
      }
    );

    await waitFor(() => result.current.isSuccess, { timeout: 30000 });
    expect(result.current.data?.error === undefined || result.current.data?.error === false).toBe(
      true
    );

    expect(result.current.data?.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        version: expect.any(String),
        link: expect.any(String)
      })
    );
  });
});
