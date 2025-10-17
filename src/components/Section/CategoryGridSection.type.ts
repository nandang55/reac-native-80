import { CategoryListInterface } from 'interfaces/ProductInterface';
import { StyleProp, ViewStyle } from 'react-native';

export interface CategoryGridSectionProps {
  data: Array<CategoryListInterface>;
  isLoading?: boolean;
  productOnPress: (item: { id: string; title: string }) => void;
  wrapperStyle?: StyleProp<ViewStyle>;
}
