import { BannerInterface } from './ProductInterface';

export interface TagDetailInterface {
  id: string;
  slug: string;
  name: string;
  banners: Array<BannerInterface>;
}
