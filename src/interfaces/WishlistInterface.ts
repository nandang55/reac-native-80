export interface WishlistInterface {
  id: string;
  is_sold_out: boolean;
  main_image_link: string;
  product_id: string;
  product_name: string;
  selling_price: number;
}

export interface CountWishlistInterface {
  count: number;
}
