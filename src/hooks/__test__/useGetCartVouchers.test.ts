import { useGetCartVouchers } from '../useGetCartVouchers';

describe('useGetCartVouchers', () => {
  test('should return correct vouchers for numeric price values', () => {
    expect(useGetCartVouchers({ price: 50 })).toEqual({
      currentVoucher: { position: -1, free: false, discount: 0 },
      nextVoucher: { position: 0, free: true, discount: 0 },
      remainingPrice: 50
    });

    expect(useGetCartVouchers({ price: 100 })).toEqual({
      currentVoucher: { position: 0, free: true, discount: 0 },
      nextVoucher: { position: 1, free: true, discount: 10 },
      remainingPrice: 50
    });

    expect(useGetCartVouchers({ price: 150 })).toEqual({
      currentVoucher: { position: 1, free: true, discount: 10 },
      nextVoucher: { position: 2, free: true, discount: 20 },
      remainingPrice: 25
    });

    expect(useGetCartVouchers({ price: 200 })).toEqual({
      currentVoucher: { position: 3, free: true, discount: 50 },
      nextVoucher: null,
      remainingPrice: null
    });
  });

  test('should handle floating point prices correctly', () => {
    expect(useGetCartVouchers({ price: 174.99 })).toEqual({
      currentVoucher: { position: 1, free: true, discount: 10 },
      nextVoucher: { position: 2, free: true, discount: 20 },
      remainingPrice: 0.01
    });
  });
});
