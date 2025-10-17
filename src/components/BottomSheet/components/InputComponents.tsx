import { Icon } from 'components/Icon';
import { Text } from 'components/Text';
import React, { forwardRef } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import colors from 'styles/colors';

import { TModalBottomSheetInputProps } from '../ModalBottomSheet.d';

const InputComponent = forwardRef<TextInput, TModalBottomSheetInputProps>(
  (
    {
      value,
      onChange,
      isError,
      onClear,
      isClearable,
      errorMessage,
      helperText,
      isAutofocus,
      maxLength
    },
    ref
  ) => {
    return (
      <View style={{ paddingHorizontal: 16 }}>
        <View
          style={[styles.wrapperTextInput, isError && { borderColor: colors.red.fireEngineRed }]}
        >
          <TextInput
            ref={ref}
            style={[styles.input, isError && { width: '90%' }]}
            value={value}
            onChangeText={onChange}
            autoFocus={isAutofocus}
            maxLength={maxLength}
          />
          {(isClearable || isError) && (
            <TouchableOpacity
              style={{
                width: 30,
                height: 30,
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onPress={onClear}
            >
              <Icon name="close" size="16px" />
            </TouchableOpacity>
          )}
        </View>
        {(isError || errorMessage || helperText) && (
          <View style={{ marginTop: 8, marginBottom: 16 }}>
            {isError || errorMessage ? (
              <Text
                label={errorMessage}
                style={{
                  color: colors.red.fireEngineRed,
                  fontSize: 12,
                  fontWeight: '400'
                }}
              />
            ) : (
              helperText && (
                <Text
                  label={helperText}
                  style={{
                    color: colors.dark.bermudaGrey,
                    fontSize: 12,
                    fontWeight: '400'
                  }}
                />
              )
            )}
          </View>
        )}
      </View>
    );
  }
);

InputComponent.displayName = 'InputComponent';

export default InputComponent;
const styles = StyleSheet.create({
  wrapperTextInput: {
    borderWidth: 1,
    borderRadius: 10,
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.dark.charcoal
  },
  input: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    width: '100%',
    color: colors.dark.blackCoral
  }
});
