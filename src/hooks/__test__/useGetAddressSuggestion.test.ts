// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import { renderHook } from '@testing-library/react-hooks';
import { _removeLocalStorageItem, _storeLocalStorageItem } from 'core/utils/localStorage';
import { useGetAddressSuggestion } from 'hooks/useGetAddressSuggestion';

import { wrapper } from '../../core/utils/testing-library-utils';
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

describe('user get address suggestion', () => {
  it('should fire useGetAddressSuggestion and return postal code list', async () => {
    const params = {
      postalCode: '368473'
    };

    const { result, waitFor } = renderHook(() => useGetAddressSuggestion({ params }), {
      wrapper
    });

    await waitFor(() => result.current.isSuccess, { timeout: 30000 });
    expect(result.current.data?.data).toEqual(
      expect.objectContaining({
        address: expect.any(String)
      })
    );
  });
});

afterAll(async () => {
  await _removeLocalStorageItem('UserToken');
});
