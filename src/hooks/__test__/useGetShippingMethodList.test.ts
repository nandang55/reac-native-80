import { renderHook } from '@testing-library/react-hooks';
import { _removeLocalStorageItem, _storeLocalStorageItem } from 'core/utils/localStorage';

import { wrapper } from '../../core/utils/testing-library-utils';
import useGetShippingMethodList from '../useGetShippingMethodList';
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

describe('user get shipping address method list', () => {
  it('should fire useGetShippingMethodList and return address method list', async () => {
    const { result, waitFor } = renderHook(
      () =>
        useGetShippingMethodList({
          id: ''
        }),
      {
        wrapper
      }
    );

    await waitFor(() => result.current.isSuccess, { timeout: 30000 });
    expect(result.current.isSuccess).toBe(true);
  });
});

afterAll(async () => {
  await _removeLocalStorageItem('UserToken');
});
