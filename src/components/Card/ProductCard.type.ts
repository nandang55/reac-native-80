import { ProductCardItemInterface } from 'interfaces/ProductInterface';
import { StyleProp, ViewStyle } from 'react-native';

export interface ProductCardBaseInterface extends ProductCardItemInterface {
  cardStyle?: StyleProp<ViewStyle>;
  isWishlist: boolean;
  productOnPress: (item: { id: string; title: string }) => void;
  buttonOnPress: (item: { id: string; title: string }) => void;
  wishlistOnPress: (item: { id: string; isWishlist: boolean }) => void;
}

export type ProductCardVariantType = 'primary' | 'secondary';
