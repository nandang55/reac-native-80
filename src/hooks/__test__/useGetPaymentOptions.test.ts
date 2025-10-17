// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import { renderHook } from '@testing-library/react-hooks';
import { _removeLocalStorageItem, _storeLocalStorageItem } from 'core/utils/localStorage';

import { wrapper } from '../../core/utils/testing-library-utils';
import useGetPaymentOptions from '../useGetPaymentOptions';
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

describe('user get payment options', () => {
  it('should fire useGetPaymentOptions', async () => {
    const { result, waitFor } = renderHook(() => useGetPaymentOptions({}), {
      wrapper
    });

    await waitFor(() => result.current.isSuccess, { timeout: 30000 });
    expect(result.current.data?.error === undefined || result.current.data.error === false).toBe(
      true
    );

    expect(result.current.data?.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          payment_type: expect.any(String),
          logo: expect.any(String),
          name: expect.any(String)
        })
      ])
    );
  });
});

afterAll(async () => {
  await _removeLocalStorageItem('UserToken');
});
