export type Variants = 'color' | 'size' | 'weight' | 'material';

interface VariantStockKey {
  [key: string]: {
    qty: number;
    price: number;
    variant_id: string;
  };
}

export interface VariantOption {
  id: string;
  name: string;
  image_link: string | null;
  disabled: boolean;
  [key: string]: string | boolean | null;
}

export type DynamicOptions<V extends Variants = Variants> = {
  [key in V]: Array<VariantOption>;
};

export interface SizeGuideSectionInterface {
  title: string;
  description?: string;
  image?: string;
  list_items?: Array<{ text: string; image?: string }>;
}
export interface SizeGuideInterface {
  main_title: string;
  sections: Array<SizeGuideSectionInterface>;
}

export interface MediaInterface {
  thumbnail: string;
  type: 'video' | 'photo';
  url?: string;
}

export interface ProductDetailInterface {
  id: string;
  category_id: string;
  category_name: string;
  main_image_link: string;
  name: string;
  description: string;
  photos: Array<string>;
  option_sequence: Array<Variants>;
  is_sold_out: boolean;
  lowest_price: number;
  is_wishlist: boolean;
  highest_price: number;
  variant_stock_keys: {
    stocks: VariantStockKey;
    options: DynamicOptions;
    default_selected: VariantActiveState;
    option_no_stocks: { [key in string]: Array<string> };
  };
  size_guide?: SizeGuideInterface;
  media: Array<MediaInterface>;
  dynamic_link?: string;
}

export type VariantActiveState<V extends Variants = Variants> = {
  [key in V]?: string;
};

export type VariantAvailableState<V extends Variants = Variants> = {
  [key in V]?: { [key: string]: Array<string> };
};
