export interface PaypalItemsInterface {
  name: string;
  quantity: number;
  description?: string;
  sku?: string;
  url?: string;
  category?: string;
  image_url?: string;
  unit_amount: {
    currency_code: string;
    value: number;
  };
  tax?: string;
  upc?: string;
}
