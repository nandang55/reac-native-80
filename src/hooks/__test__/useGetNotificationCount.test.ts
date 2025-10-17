import { renderHook } from '@testing-library/react-hooks';
import { _removeLocalStorageItem, _storeLocalStorageItem } from 'core/utils/localStorage';

import { wrapper } from '../../core/utils/testing-library-utils';
import { useGetNotificationCount } from '../useGetNotificationCount';
import { useEmailLogin } from '../usePostLogin';

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

describe('user get notification count', () => {
  it('should fire useGetNotificationCount', async () => {
    const { result, waitFor } = renderHook(() => useGetNotificationCount(), {
      wrapper
    });

    await waitFor(() => result.current.isSuccess, { timeout: 30000 });
    expect(result.current.isSuccess).toBe(true);

    expect(result.current.data).toEqual(
      expect.objectContaining({
        count: expect.any(Number)
      })
    );
  });
});

afterAll(async () => {
  await _removeLocalStorageItem('UserToken');
});
