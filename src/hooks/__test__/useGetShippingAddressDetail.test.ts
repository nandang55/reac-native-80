import { renderHook } from '@testing-library/react-hooks';
import { _removeLocalStorageItem, _storeLocalStorageItem } from 'core/utils/localStorage';

import { wrapper } from '../../core/utils/testing-library-utils';
import useGetShippingAddressDetail from '../useGetShippingAddressDetail';
import useGetShippingAddressList from '../useGetShippingAddressList';
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

describe('user get shipping address detail', () => {
  it('should fire useGetShippingAddressList and useGetShippingAddressDetail', async () => {
    const { result: shippingAddressListResult, waitFor: waitForShippingAddressList } = renderHook(
      () => useGetShippingAddressList({}),
      {
        wrapper
      }
    );

    await waitForShippingAddressList(() => shippingAddressListResult.current.isSuccess, {
      timeout: 30000
    });

    const { result: shippingAddressDetailResult, waitFor: waitForShippingAddressDetail } =
      renderHook(
        () =>
          useGetShippingAddressDetail({
            id: shippingAddressListResult.current.data?.data[0].id as string
          }),
        {
          wrapper
        }
      );

    await waitForShippingAddressDetail(() => shippingAddressDetailResult.current.isSuccess, {
      timeout: 30000
    });

    expect(shippingAddressDetailResult.current.isSuccess).toBe(true);
  });
});

afterAll(async () => {
  await _removeLocalStorageItem('UserToken');
});
