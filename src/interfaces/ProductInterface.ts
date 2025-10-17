export interface ProductItemInterface {
  id: string;
  name: string;
  selling_price: string;
  main_image_link: string;
  is_wishlist: boolean;
}

export interface ProductCardItemInterface extends ProductItemInterface {
  empty: boolean;
}

export interface ResponseGetBannerInterface {
  display_duration: string;
  banners: Array<IBanner>;
}

interface IBanner {
  id: string;
  image_link: string;
  sequence: number;
}

export interface BannerInterface {
  id: string;
  name?: string;
  image_link?: string;
  type?: 'video' | 'photo';
  url?: string;
  thumbnail?: string;
}

export interface VideoImageBannerInterface {
  id: string;
  name?: string;
  type?: 'video' | 'photo';
  url?: string;
  thumbnail?: string;
}

export interface CategoryListInterface extends BannerInterface {
  name: string;
  category_image_link?: string;
}

export interface CategoryDetailInterface extends CategoryListInterface {
  banners: Array<BannerInterface>;
}
