import { AnimationConfigProps } from 'hooks/ImageZoom/zoomInterface';
import { StyleProp, ViewStyle } from 'react-native';
import { AnimatableValue, AnimationCallback } from 'react-native-reanimated';

export interface ZoomProps {
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  animationConfig?: AnimationConfigProps;
  doubleTapConfig?: {
    defaultScale?: number;
    minZoomScale?: number;
    maxZoomScale?: number;
  };

  animationFunction?<T extends AnimatableValue>(
    toValue: T,
    userConfig?: AnimationConfigProps,
    callback?: AnimationCallback
  ): T;
}
