export interface PaymentSummarySectionInterface {
  totalQuantity: number;
  totalPrice: number;
  cost: number;
  insurance: number;
  totalPayment: number;
  promoCode?: string;
  discount?: number;
  paymentInformation?: { name: string; logo: string };
  voucher: number;
  free_ongkir: boolean | undefined;
}
