import { renderHook } from '@testing-library/react-hooks';

import { wrapper } from '../../core/utils/testing-library-utils';
import useGetCollectionById from '../useGetCollectionById';

describe('user get collection detail', () => {
  it('should fire useGetCollectionById', async () => {
    const collectionId = '9c3887b7-96af-4cba-8566-3462a8a561db';

    const { result, waitFor } = renderHook(() => useGetCollectionById({ id: collectionId }), {
      wrapper
    });

    await waitFor(() => result.current.isSuccess, { timeout: 30000 });
    expect(result.current.data?.error === undefined || result.current.data?.error === false).toBe(
      true
    );

    expect(result.current.data?.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        // eslint-disable-next-line camelcase
        image_link: expect.any(String)
      })
    );
  });
});
