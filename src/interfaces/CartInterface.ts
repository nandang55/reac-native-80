export interface CartInterface {
  id: string;
  quantity: number;
  stock: number;
  selling_price: number;
  product_id: string;
  product_name: string;
  variant_id: string;
  variant_name: string;
  main_image_link: string;
  is_wishlist: boolean;
}

export interface CountCartInterface {
  count: number;
}

export interface ValidateCartInterface {
  id: string;
  quantity: number;
  selling_price: number;
}

export interface BodyValidateCartInterface {
  cart: Array<ValidateCartInterface>;
}

export interface PostBodyCartInterface {
  product_id: string;
  quantity: number;
  variant_id: string;
  wishlist_id?: string;
}
