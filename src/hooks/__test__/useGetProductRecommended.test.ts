import { renderHook } from '@testing-library/react-hooks';

import { wrapper } from '../../core/utils/testing-library-utils';
import useGetProductRecommended from '../useGetProductRecommended';

describe('user get product recommended', () => {
  it('should fire useGetProductRecommended', async () => {
    const { result, waitFor } = renderHook(
      () => useGetProductRecommended({ id: 'ef3e83f1-963f-4c26-8173-0a64eda257e8' }),
      {
        wrapper
      }
    );

    await waitFor(() => result.current.isSuccess, { timeout: 30000 });
    expect(result.current.data?.error === undefined || result.current.data.error === false).toBe(
      true
    );

    expect(result.current.data?.data).toEqual(expect.arrayContaining([]));
  });
});
