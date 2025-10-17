import React from 'react';
import { Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

type AnimatedInterpolation = ReturnType<Animated.Value['interpolate']>;

export interface CardSwipeableInterface {
  children: React.ReactNode;
  renderRightActions?: (
    progressAnimatedValue: AnimatedInterpolation,
    dragAnimatedValue: AnimatedInterpolation,
    swipeable: Swipeable
  ) => React.ReactNode;
  leftRightActions?: (
    progressAnimatedValue: AnimatedInterpolation,
    dragAnimatedValue: AnimatedInterpolation,
    swipeable: Swipeable
  ) => React.ReactNode;
}
