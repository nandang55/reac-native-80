import { renderHook } from '@testing-library/react-hooks';
import { _removeLocalStorageItem, _storeLocalStorageItem } from 'core/utils/localStorage';
import { useGetWishlists } from 'hooks/useGetWishlists';
import { useEmailLogin } from 'hooks/usePostLogin';

import { wrapper } from '../../core/utils/testing-library-utils';

beforeAll(async () => {
  const { result, waitFor } = renderHook(() => useEmailLogin({}), {
    wrapper
  });

  result.current.mutate({
    email: 'testingmobile@mailinator.com',
    // eslint-disable-next-line camelcase
    verification_code: '123456',
    lang: 'en'
  });

  await waitFor(() => result.current.isSuccess, { timeout: 30000 });
  await _storeLocalStorageItem({
    storageKey: 'UserToken',
    storageValue: result.current.data?.access_token || ''
  });
});

describe('user get wishlists', () => {
  it('should fire useGetWishlists', async () => {
    const { result, waitFor } = renderHook(
      () =>
        useGetWishlists({
          // eslint-disable-next-line camelcase
          params: { page: 1, per_page: 10 }
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

afterAll(async () => {
  await _removeLocalStorageItem('UserToken');
});
