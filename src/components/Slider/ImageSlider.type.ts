import { BannerInterface } from 'interfaces/ProductInterface';

export interface ImageSliderProps {
  data: Array<BannerInterface>;
  withIndicator?: boolean;
  absoluteIndicator?: boolean;
  autoplay?: boolean;
  height: number;
  spacing?: number;
  borderRadius?: number;
  isLoading?: boolean;
  displayDuration?: number;
  onPress?: (data: { id: string; title: string; currentIndex?: number }) => void;
}
