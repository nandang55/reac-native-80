import { renderHook } from '@testing-library/react-hooks';
import { useGetProductCollections } from 'hooks/useGetProductCollections';

import { wrapper } from '../../core/utils/testing-library-utils';

describe('user get product collections', () => {
  it('should fire useGetProductCollections', async () => {
    const { result, waitFor } = renderHook(
      () =>
        useGetProductCollections({
          id: '9c3887b7-96af-4cba-8566-3462a8a561db',
          params: { page: 1, limit: 10 }
        }),
      {
        wrapper
      }
    );

    await waitFor(() => result.current.isSuccess, { timeout: 30000 });
    expect(result.current.isSuccess).toBe(true);

    expect(result.current.data?.pages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          data: expect.arrayContaining([])
        })
      ])
    );
  });
});
