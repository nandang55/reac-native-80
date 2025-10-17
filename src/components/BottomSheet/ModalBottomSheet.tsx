import { Button } from 'components/Button';
import { Loading } from 'components/Loading';
import { Text } from 'components/Text';
import { Toast } from 'components/Toast';
import React, { forwardRef, useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import colors from 'styles/colors';

import { InputComponent } from '.';
import { TModalBottomSheetProps } from './ModalBottomSheet.d';

const ModalBottomSheet = forwardRef<TextInput, TModalBottomSheetProps>(
  (
    {
      isVisible,
      onCloseModal,
      render,
      type = 'normal',
      value,
      onChange,
      maxLength,
      footerRender,
      isShowButtonAction,
      label,
      errorMessage,
      isClearable,
      onClear,
      helperText,
      isError,
      isAutofocus,
      onCancel,
      onSubmit,
      isLoading,
      isShowToast,
      onClosedToast,
      messageToast,
      typeToast,
      iconToast
    },
    ref
  ) => {
    const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);

    const handleRenderByType = () => {
      switch (type) {
        case 'input':
          return (
            <InputComponent
              ref={ref}
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

    useEffect(() => {
      const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
        setIsKeyboardVisible(true);
      });
      const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        setIsKeyboardVisible(false);
      });

      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, []);

    return (
      <Modal animationType="slide" transparent visible={isVisible} onRequestClose={onCloseModal}>
        <TouchableWithoutFeedback onPress={onCloseModal}>
          <View style={[styles.overlay]}>
            {isShowToast && (
              <Toast
                visible={isShowToast}
                type={typeToast}
                icon={iconToast}
                message={messageToast || ''}
                onClose={onClosedToast}
              />
            )}
            <KeyboardAvoidingView
              behavior="padding"
              style={[
                styles.bottomSheet,
                Platform.OS === 'android' && isKeyboardVisible && { marginBottom: '16%' }
              ]}
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
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
        <Loading visible={isLoading} size={'large'} />
      </Modal>
    );
  }
);

ModalBottomSheet.displayName = 'ModalBottomSheet';
export default ModalBottomSheet;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 5
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    color: '#52616B'
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.dark.bermudaGrey,
    marginBottom: 16
  },
  btnContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 16
  }
});
