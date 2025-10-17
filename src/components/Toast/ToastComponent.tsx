/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable react-hooks/exhaustive-deps */
import { Icon, IconType } from 'components/Icon';
import { ModalToastType } from 'components/Modal/ModalToast.type';
import { Text } from 'components/Text';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import colors from 'styles/colors';

const { width } = Dimensions.get('window');

interface AnimatedToastProps {
  visible: boolean;
  message: string;
  duration?: number;
  type?: 'success' | 'error';
  icon?: IconType;
  onClose?: () => void;
}

const ToastComponent = ({
  visible,
  message,
  duration = 2000,
  onClose,
  type = 'success',
  icon = 'infoCircle'
}: AnimatedToastProps) => {
  const translateY = useSharedValue(-100);

  const modalBackgroundMapper: Record<ModalToastType, string> = {
    success: colors.secondary,
    error: colors.red.deepRed
  };

  const modalIconMapper: Record<ModalToastType, IconType> = {
    success: 'checkCircleOutline',
    error: 'infoCircle'
  };
  useEffect(() => {
    if (visible) {
      // Slide in
      translateY.value = withTiming(0, { duration: 300 });

      // Slide out
      setTimeout(() => {
        translateY.value = withTiming(-100, { duration: 300 }, (finished) => {
          if (finished && onClose) {
            runOnJS(onClose)();
          }
        });
      }, duration);
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }));

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        animatedStyle,
        { backgroundColor: modalBackgroundMapper[type] }
      ]}
    >
      <Icon name={icon || modalIconMapper[type]} color={colors.light.whiteSolid} size={'16px'} />
      <Text
        style={{ marginRight: 16 }}
        color={colors.light.whiteSolid}
        label={message}
        fontWeight="bold"
      />
    </Animated.View>
  );
};

export default ToastComponent;

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    zIndex: 999,
    width: width - 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  }
});
