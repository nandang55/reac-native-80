const vouchers = [
  { min: 0, max: 99.99, position: -1, free: false, discount: 0 },
  { min: 100, max: 149.99, position: 0, free: true, discount: 0 },
  { min: 150, max: 174.99, position: 1, free: true, discount: 10 },
  { min: 175, max: 199.99, position: 2, free: true, discount: 20 },
  { min: 200, max: Infinity, position: 3, free: true, discount: 50 }
];

export const useGetCartVouchers = ({ price }: { price: number }) => {
  const roundPrice = (num: number): number => {
    return Math.round(num * 100) / 100;
  };

  const roundedPrice = roundPrice(price);

  const getCurrentVoucher = () => {
    const voucher = vouchers.find((r) => roundedPrice >= r.min && roundedPrice <= r.max);

    return voucher
      ? { position: voucher.position, free: voucher.free, discount: voucher.discount }
      : null;
  };

  const getNextVoucher = () => {
    const index = vouchers.findIndex((r) => roundedPrice >= r.min && roundedPrice <= r.max);

    const nextVoucher = index !== -1 && index < vouchers.length - 1 ? vouchers[index + 1] : null;

    return nextVoucher
      ? {
          position: nextVoucher.position,
          free: nextVoucher.free,
          discount: nextVoucher.discount
        }
      : null;
  };

  const getRemainingPriceForNextDiscount = () => {
    const index = vouchers.findIndex((r) => roundedPrice >= r.min && roundedPrice <= r.max);

    const nextVoucher = index !== -1 && index < vouchers.length - 1 ? vouchers[index + 1] : null;

    return nextVoucher ? roundPrice(nextVoucher.min - price) : null;
  };

  const currentVoucher = getCurrentVoucher();
  const nextVoucher = getNextVoucher();
  const remainingPrice = getRemainingPriceForNextDiscount();

  return { currentVoucher, nextVoucher, remainingPrice };
};
