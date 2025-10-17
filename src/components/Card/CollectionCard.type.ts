import { BannerInterface } from 'interfaces/ProductInterface';

export interface CollectionCardInterface extends BannerInterface {
  onPress: (data: { id: string; title: string }) => void;
}
