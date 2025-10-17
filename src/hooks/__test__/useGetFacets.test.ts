import { renderHook } from '@testing-library/react-hooks';

import { wrapper } from '../../core/utils/testing-library-utils';
import useGetFacets from '../useGetFacets';

describe('user get facet tag list', () => {
  it('should fire useGetFacets', async () => {
    const { result, waitFor } = renderHook(() => useGetFacets({}), {
      wrapper
    });

    await waitFor(() => result.current.isSuccess, { timeout: 30000 });

    expect(result.current.data?.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: expect.any(String),
          label: expect.any(String),
          position: expect.any(Number)
        })
      ])
    );
  });
});
