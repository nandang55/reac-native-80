import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import colors from 'styles/colors';

const LoadingComponent = ({
  visible,
  size,
  color = colors.secondary
}: {
  visible: boolean | undefined;
  size?: number | 'small' | 'large' | undefined;
  color?: string;
}) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = visible
      ? withTiming(1, { duration: 500, easing: Easing.out(Easing.exp) })
      : withTiming(0, { duration: 500, easing: Easing.in(Easing.exp) });
  }, [opacity, visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      {
        scale: withTiming(visible ? 1 : 0.95, {
          duration: 500,
          easing: Easing.out(Easing.exp)
        })
      }
    ]
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, animatedStyle]}>
      <View style={styles.loadingWrapper}>
        <ActivityIndicator size={size} color={color} />
      </View>
    </Animated.View>
  );
};

export default LoadingComponent;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    zIndex: 999999
  },
  loadingWrapper: {
    backgroundColor: colors.light.whiteSolid,
    width: 64,
    height: 64,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3
  }
});
