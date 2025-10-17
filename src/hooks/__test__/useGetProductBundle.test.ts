import { renderHook } from '@testing-library/react-hooks';
import { useGetProductBundle } from 'hooks/useGetProductBundle';

import { wrapper } from '../../core/utils/testing-library-utils';

describe('user get product collections', () => {
  it('should fire useGetProductBundle', async () => {
    const { result, waitFor } = renderHook(() => useGetProductBundle({}), {
      wrapper
    });

    await waitFor(() => result.current.isSuccess, { timeout: 30000 });
    expect(result.current.isSuccess).toBe(true);

    expect(result.current.data).toEqual(
      expect.objectContaining({
        data: expect.arrayContaining([])
      })
    );
  });
});
