import { PromoCodeInterface, VoucherInterface } from './CheckoutInterface';

export interface OrderListInterface {
  id: string;
  status: number;
  status_name: string;
  status_color: string;
  payment_due: string;
  order_date: string;
  delivery_date: string;
  cancel_date?: string;
  product_name: string;
  product_image_link: string;
  product_quantity: number;
  total_payment: number;
  total_product: number;
  completed_date: string;
}

export interface PaymentInfoInterface {
  payment_type: string;
  payment_logo: string;
  payment_name: string;
  bank_logo?: string;
  bank_name?: string;
  bank_code?: string;
  va_number?: string;
}

export interface OrderItemsInterface {
  product_name: string;
  product_variant: string;
  quantity: number;
  selling_price: number;
  product_image_link: string;
}

export interface OrderDetailInterface
  extends OrderListInterface,
    PromoCodeInterface,
    VoucherInterface {
  order_id: string;
  total_price: number;
  shipping_method: string;
  shipping_cost: number;
  shipping_insurance: number;
  receipt_name: string;
  receipt_phone: string;
  shipping_address: string;
  total_order_items: number;
  payment_info: PaymentInfoInterface;
  shipping_courier: string;
  receipt_number: string;
  completed_date: string;
  order_inquiries: boolean;
  order_items: Array<OrderItemsInterface>;
}

export interface OrderInquiryInterface {
  phone: string;
  email: string;
  inquiry: string;
  phone_cc: string;
}

export interface PostOrderInquiryInterface {
  phone: string;
  email: string;
  inquiry: string;
}

export interface PostCaptureOrderInterface {
  orderId: string;
  failed?: boolean;
}
