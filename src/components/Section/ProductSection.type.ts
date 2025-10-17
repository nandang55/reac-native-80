import { ProductCardBaseInterface, ProductCardVariantType } from 'components/Card/ProductCard.type';

export interface ProductSectionProps {
  label: string;
  data: Array<ProductCardBaseInterface>;
  cardVariant: ProductCardVariantType;
  isLoading?: boolean;
  hideLabel?: boolean;
  withCta?: boolean;
  ctaLabel?: string;
  ctaOnPress?: () => void;
  productOnPress: (item: { id: string; title: string }) => void;
  wishlistOnPress: (item: { id: string; isWishlist: boolean }) => void;
}
