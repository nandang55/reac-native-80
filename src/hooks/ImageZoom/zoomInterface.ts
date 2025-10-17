import { withTiming } from 'react-native-reanimated';

export type AnimationConfigProps = Parameters<typeof withTiming>[1];

export interface UseZoomGestureProps {
  animationFunction?: typeof withTiming;
  animationConfig?: AnimationConfigProps;
  doubleTapConfig?: {
    defaultScale?: number;
    minZoomScale?: number;
    maxZoomScale?: number;
  };
}
