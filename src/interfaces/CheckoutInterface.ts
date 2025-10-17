import { ValidateCartInterface } from './CartInterface';

export interface ShippingMethodListInterface {
  id: string;
  name: string;
  cost: number;
  estimate_delivery: string;
  insurance: number;
}

export interface BanklistInterface {
  id: string;
  logo: string;
  name: string;
  code: string;
  active: boolean;
}

export interface PaymentOptionInterface {
  payment_type: string;
  name: string;
  logo: string;
}

export type PaymentType = 'PAYPAL' | 'VA' | 'PAYPAL_FAILED';

export interface CheckoutPayloadInterface extends VoucherInterface {
  shipping_address_id: string;
  va_bank_code: string | null;
  shipping_method: string;
  shipping_cost: number;
  shipping_insurance: number;
  payment_type: PaymentType;
  discount_code: string | null;
  cart: Array<ValidateCartInterface>;
}

export interface CheckoutResponse {
  id: string;
  paypal_access_token: string;
  order_payment_id: string;
  paypal_url: string;
}

export interface ValidatePromoPayloadInterface {
  discount_code: string;
  cart_ids: Array<string>;
}

export interface PromoCodeInterface {
  discount_code: string;
  discount_amount: number;
}

export interface VoucherInterface {
  voucher_amount: number;
  voucher_shipping_amount?: number;
  free_ongkir?: boolean;
}
