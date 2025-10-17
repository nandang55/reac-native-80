import { BannerInterface } from 'interfaces/ProductInterface';
import { StyleProp, ViewStyle } from 'react-native';

export interface CollectionSectionProps {
  label: string | React.ReactNode;
  data: Array<BannerInterface>;
  isLoading?: boolean;
  labelStyle?: StyleProp<ViewStyle>;
  borderRadius?: number;
  spacing?: number;
  bannerOnPress: (data: { id: string; title: string }) => void;
}
