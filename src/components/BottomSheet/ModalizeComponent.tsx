import { useFocusEffect } from '@react-navigation/native';
import { Button } from 'components/Button';
import { Loading } from 'components/Loading';
import { Text } from 'components/Text';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  Keyboard,
  Platform,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutDown,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import colors from 'styles/colors';

import { InputComponent } from '.';
import { TModalBottomSheetProps } from './ModalBottomSheet.d';

const ModalizeComponent = ({
  isVisible,
  label,
  type,
  value,
  onChange,
  maxLength,
  isError,
  onClear,
  errorMessage,
  isClearable,
  helperText,
  isAutofocus,
  isLoading,
  render,
  footerRender,
  isShowButtonAction,
  onCancel,
  onCloseModal,
  onSubmit
}: TModalBottomSheetProps) => {
  const translateY = useSharedValue(0);
  const inputRef = useRef<TextInput>(null);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withSpring(translateY.value, {
          duration: 400,
          dampingRatio: 1.2,
          stiffness: 382,
          overshootClamping: false,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 2,
          reduceMotion: ReduceMotion.System
        })
      }
    ]
  }));

  useEffect(() => {
    const typesKeyboardEventShow = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const typesKeyboardEventHide = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(typesKeyboardEventShow, (event) => {
      translateY.value = -event.endCoordinates.height;
    });

    const hideSubscription = Keyboard.addListener(typesKeyboardEventHide, () => {
      translateY.value = 0;
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [translateY]);

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        if (isVisible) {
          inputRef.current?.focus();
        }
      }, 300);
    }, [isVisible])
  );

  const handleRenderByType = () => {
    switch (type) {
      case 'input':
        return (
          <InputComponent
            ref={inputRef}
            value={value}
            onChange={onChange}
            maxLength={maxLength}
            isError={isError}
            onClear={onClear}
            errorMessage={errorMessage}
            isClearable={isClearable}
            helperText={helperText}
            isAutofocus={isAutofocus}
          />
        );
      case 'normal':
        return <View>{render}</View>;

      default:
        return;
    }
  };

  return (
    isVisible && (
      <>
        <TouchableWithoutFeedback onPress={onCloseModal}>
          <Animated.View
            entering={FadeIn.duration(100)}
            exiting={FadeOut.duration(100)}
            style={styles.overlay}
          >
            <Animated.View
              entering={FadeInDown.duration(300)}
              exiting={FadeOutDown.duration(100)}
              style={[styles.bottomSheet, animatedStyle]}
            >
              <View style={{ paddingVertical: 16, paddingHorizontal: 24 }}>
                <Text label={label} style={styles.title} fontWeight="semi-bold" />
              </View>
              <View style={styles.divider} />
              {handleRenderByType()}
              {footerRender
                ? footerRender
                : isShowButtonAction && (
                    <View style={[styles.btnContainer, { paddingBottom: 16 }]}>
                      <View style={{ flex: 1 }}>
                        <Button
                          label="Cancel"
                          variant="plain"
                          onPress={() => {
                            setTimeout(() => {
                              onCancel && onCancel();
                            }, 1);
                          }}
                          height={40}
                          borderRadius="88px"
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Button
                          label="Apply"
                          variant="background"
                          color={colors.secondary}
                          onPress={() => {
                            setTimeout(() => {
                              onSubmit && onSubmit();
                            }, 1);
                          }}
                          height={40}
                          borderRadius="88px"
                          isDisable={!value || !!errorMessage}
                        />
                      </View>
                    </View>
                  )}
            </Animated.View>
          </Animated.View>
        </TouchableWithoutFeedback>
        {isLoading && <Loading visible />}
      </>
    )
  );
};

export default ModalizeComponent;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    flex: 1,
    width: '100%'
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    color: 'rgba(82, 97, 107, 1)'
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.dark.solitude,
    marginBottom: 16
  },
  btnContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 16
  }
});
