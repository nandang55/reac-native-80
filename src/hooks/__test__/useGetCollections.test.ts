import { renderHook } from '@testing-library/react-hooks';

import { wrapper } from '../../core/utils/testing-library-utils';
import useGetCollections from '../useGetCollections';

describe('user get collections', () => {
  it.only('should fire useGetCollections', async () => {
    const { result, waitFor } = renderHook(() => useGetCollections({}), {
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
          image_link: expect.any(String),
          name: expect.any(String)
        })
      ])
    );
  });
});
