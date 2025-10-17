import { BannerInterface } from 'interfaces/ProductInterface';
import { LayoutChangeEvent } from 'react-native';

export interface VideoImageSliderProps {
  data: Array<BannerInterface>;
  withIndicator?: boolean;
  absoluteIndicator?: boolean;
  autoplay?: boolean;
  height: number;
  spacing?: number;
  borderRadius?: number;
  isLoading?: boolean;
  onPress?: (data: { id: string; title: string; currentIndex?: number; isMuted?: boolean }) => void;
  isFocused?: boolean;
  initialMuted?: boolean;
  initialShowThumbnail?: boolean;
  onLayout?: ((event: LayoutChangeEvent) => void) | undefined;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  currentTime?: number;
  onEnd?: () => void;
}
