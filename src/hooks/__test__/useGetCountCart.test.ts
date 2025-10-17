// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import { renderHook } from '@testing-library/react-hooks';
import { _removeLocalStorageItem, _storeLocalStorageItem } from 'core/utils/localStorage';

import { wrapper } from '../../core/utils/testing-library-utils';
import useGetCountCart from '../useGetCountCart';
import { useEmailLogin } from '../usePostLogin';

beforeAll(async () => {
  const { result, waitFor } = renderHook(() => useEmailLogin({}), {
    wrapper
  });

  result.current.mutate({
    email: 'testingmobile@mailinator.com',
    verification_code: '123456',
    lang: 'en'
  });

  await waitFor(() => result.current.isSuccess, { timeout: 30000 });
  await _storeLocalStorageItem({
    storageKey: 'UserToken',
    storageValue: result.current.data?.access_token || ''
  });
});

describe('user get count cart', () => {
  it('should fire useGetCountCart', async () => {
    const { result, waitFor } = renderHook(() => useGetCountCart({}), {
      wrapper
    });

    await waitFor(() => result.current.isSuccess, { timeout: 30000 });
    expect(result.current.data?.error === undefined || result.current.data.error === false).toBe(
      true
    );

    expect(result.current.data?.data).toEqual(
      expect.objectContaining({
        count: expect.any(Number)
      })
    );
  });
});

afterAll(async () => {
  await _removeLocalStorageItem('UserToken');
});
