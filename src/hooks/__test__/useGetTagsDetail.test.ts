import { renderHook } from '@testing-library/react-hooks';

import { wrapper } from '../../core/utils/testing-library-utils';
import useGetTagsDetail from '../useGetTagsDetail';

describe('user get tags detail', () => {
  it('should fire useGetTagsDetail', async () => {
    const { result, waitFor } = renderHook(
      () =>
        useGetTagsDetail({
          tag: 'best-of-sricandy'
        }),
      {
        wrapper
      }
    );

    await waitFor(() => result.current.isSuccess, { timeout: 30000 });
  });
});
