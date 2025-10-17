import { Icon } from 'components/Icon';
import { Text } from 'components/Text';
import React, { forwardRef } from 'react';
import { Platform, TextInput, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';

import { TextInputInterface } from './Text.type';

const InputContainer = styled(View)`
  display: flex;
  gap: 8px;
  position: relative;
  width: 100%;
`;

const TextInputContainerStyled = styled(View)<{ noBorder?: boolean; borderColor: string }>`
  align-items: center;
  border: ${(props) => (props.noBorder ? '0px' : '1px')} solid ${(props) => props.borderColor};
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const InputSuffix = styled(View)`
  background-color: ${colors.light.whiteSmoke};
  border-radius: 8px 0px 0px 8px;
  margin: 0;
  padding: 14px 16px;
`;

export const InputText = forwardRef<TextInput, TextInputInterface>(
  (
    {
      label,
      value,
      containerStyle,
      inputStyle,
      onChange,
      onBlur,
      onFocus,
      onSubmitEditing,
      placeholder,
      helperText,
      readonly,
      isError,
      errorText,
      suffix,
      maxLength,
      keyboardType,
      inputMode,
      returnKeyType,
      rightIcon,
      rightIconPress,
      center,
      isDisabled,
      isClearable,
      onClear
    },
    ref
    // eslint-disable-next-line sonarjs/cognitive-complexity
  ) => {
    const width = rightIcon && isClearable ? '80%' : rightIcon || isClearable ? '90%' : '100%';
    return (
      <InputContainer>
        {label && <Text label={label} color={colors.dark.gumbo} />}
        <TextInputContainerStyled
          noBorder={readonly}
          borderColor={isError ? colors.red.fireEngineRed : colors.dark.blackCoral}
          style={[
            { backgroundColor: isDisabled ? colors.light.whiteSmoke : colors.light.whiteSolid },
            containerStyle
          ]}
        >
          {suffix && (
            <InputSuffix>
              <Text color={colors.dark.bermudaGrey} label={suffix} />
            </InputSuffix>
          )}
          {readonly ? (
            <Text label={value} color={colors.dark.blackCoral} />
          ) : (
            <>
              <TextInput
                ref={ref}
                value={value}
                underlineColorAndroid="transparent"
                style={[
                  {
                    color: colors.dark.blackCoral,
                    width,
                    paddingHorizontal: 16,
                    height: 40,
                    paddingTop: Platform.OS == 'ios' ? 12 : undefined,
                    paddingBottom: Platform.OS == 'ios' ? 12 : undefined
                  },
                  inputStyle
                ]}
                maxLength={maxLength}
                textAlign={center ? 'center' : 'left'}
                keyboardType={keyboardType}
                inputMode={inputMode}
                returnKeyType={returnKeyType}
                onChangeText={onChange}
                onBlur={onBlur}
                onFocus={onFocus}
                onSubmitEditing={onSubmitEditing}
                placeholder={placeholder}
                placeholderTextColor={colors.dark.gumbo}
                editable={!isDisabled}
                pointerEvents={isDisabled ? 'none' : 'auto'}
              />
              {rightIcon && (
                <TouchableOpacity
                  style={{ position: 'absolute', right: 16 }}
                  onPress={rightIconPress}
                  disabled={!rightIconPress}
                >
                  <Icon name={rightIcon} color={colors.dark.gumbo} size="16" />
                </TouchableOpacity>
              )}
              {isClearable && (
                <TouchableOpacity
                  style={{ position: 'absolute', right: rightIcon ? 42 : 16 }}
                  onPress={onClear}
                >
                  <Icon name={'close'} color={colors.dark.gumbo} size="14" />
                </TouchableOpacity>
              )}
            </>
          )}
        </TextInputContainerStyled>
        {isError && errorText ? (
          <Text label={errorText} color={colors.red.fireEngineRed} />
        ) : (
          helperText && <Text label={helperText} color={colors.dark.bermudaGrey} />
        )}
      </InputContainer>
    );
  }
);

InputText.displayName = 'InputText';
