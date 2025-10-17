// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import { renderHook } from '@testing-library/react-hooks';
import { _removeLocalStorageItem, _storeLocalStorageItem } from 'core/utils/localStorage';

import { wrapper } from '../../core/utils/testing-library-utils';
import useGetOrderDetail from '../useGetOrderDetail';
import { useGetOrderList } from '../useGetOrderList';
import { useEmailLogin } from '../usePostLogin';

beforeAll(async () => {
  const { result: loginResult, waitFor: waitForLogin } = renderHook(() => useEmailLogin({}), {
    wrapper
  });

  loginResult.current.mutate({
    email: 'testingmobile@mailinator.com',
    verification_code: '123456',
    lang: 'en'
  });

  await waitForLogin(() => loginResult.current.isSuccess, { timeout: 30000 });
  const accessToken = loginResult.current.data?.access_token;

  if (accessToken) {
    await _storeLocalStorageItem({
      storageKey: 'UserToken',
      storageValue: accessToken
    });
  }
});

describe('user get order detail', () => {
  it('should fire useGetOrderList and useGetOrderDetail', async () => {
    const { result: orderListResult, waitFor: waitForOrderList } = renderHook(
      () =>
        useGetOrderList({
          params: {
            page: 1,
            per_page: 30
          }
        }),
      {
        wrapper
      }
    );

    await waitForOrderList(() => orderListResult.current.isSuccess, { timeout: 30000 });

    const orders = orderListResult.current.data?.pages.flatMap((item) => item.data) || [];

    if (orders.length > 0) {
      const { result: orderDetailResult, waitFor: waitForOrderDetail } = renderHook(
        () => useGetOrderDetail({ id: orders[0].id }),
        {
          wrapper
        }
      );

      await waitForOrderDetail(() => orderDetailResult.current.isSuccess, { timeout: 30000 });
      expect(orderDetailResult.current.isSuccess).toBe(true);

      expect(orderDetailResult.current.data?.data).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          status: expect.any(Number),
          status_name: expect.any(String),
          status_color: expect.any(String),
          order_id: expect.any(String),
          order_date: expect.any(String),
          total_payment: expect.any(Number),
          total_price: expect.any(Number),
          shipping_method: expect.any(String),
          shipping_cost: expect.any(Number),
          shipping_insurance: expect.any(Number),
          receipt_name: expect.any(String),
          receipt_phone: expect.any(String),
          shipping_address: expect.any(String),
          total_order_items: expect.any(Number),
          payment_info: expect.any(Object),
          order_inquiries: expect.any(Boolean),
          order_items: expect.any(Array)
        })
      );
    }
  });
});

afterAll(async () => {
  await _removeLocalStorageItem('UserToken');
});
