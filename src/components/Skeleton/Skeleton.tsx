import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import colors from 'styles/colors';

const styles = StyleSheet.create({
  LoadingRect: {
    backgroundColor: colors.dark.solitude
  }
});

export const Skeleton = ({
  width,
  height,
  style,
  rounded
}: {
  width: number | `${number}%` | 'auto' | null | undefined;
  height: number | `${number}%` | 'auto' | null | undefined;
  style?: StyleProp<ViewStyle>;
  rounded?: boolean;
}) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  const sharedAnimationConfig = {
    duration: 1000,
    useNativeDriver: true
  };

  //TODO: create better animation
  const runAnimation = useCallback(
    () =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            ...sharedAnimationConfig,
            toValue: 1,
            easing: Easing.out(Easing.ease)
          }),
          Animated.timing(pulseAnim, {
            ...sharedAnimationConfig,
            toValue: 0.5,
            easing: Easing.in(Easing.ease)
          }),
          Animated.timing(pulseAnim, {
            ...sharedAnimationConfig,
            toValue: 1,
            easing: Easing.out(Easing.ease)
          })
        ])
      ).start(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    runAnimation();

    return () => pulseAnim.stopAnimation();
  }, [pulseAnim, runAnimation]);

  const opacityAnim = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.05, 0.5]
  });

  return (
    <Animated.View
      style={[
        styles.LoadingRect,
        { width, height, opacity: opacityAnim, borderRadius: rounded ? 8.5 : 0 },
        style
      ]}
    />
  );
};
