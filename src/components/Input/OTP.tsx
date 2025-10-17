import React from 'react';
import { Platform, Text, View } from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell
} from 'react-native-confirmation-code-field';
import styled from 'styled-components/native';
import colors from 'styles/colors';

import { InputOTPProps } from './OTP.type';

const OTPContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
`;

const OTPInput = styled(Text)<{ borderColor: string }>`
  border-bottom-color: ${(props) => props.borderColor};
  border-bottom-width: 2px;
  color: ${colors.dark.blackCoral};
  font-size: 32px;
  height: 50px;
  line-height: 34px;
  text-align: center;
  width: 40px;
`;

export const InputOTP: React.FC<InputOTPProps> = ({ length, value, onOTPChange }) => {
  const isIos = Platform.OS === 'ios';
  const ref = useBlurOnFulfill({ value, cellCount: length });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue: onOTPChange
  });

  return (
    <OTPContainer>
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={onOTPChange}
        cellCount={length}
        rootStyle={{ display: 'flex', gap: 12 }}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <View
            style={{
              borderBottomWidth: isIos ? 2 : 0,
              borderBottomColor: isFocused ? colors.secondary : colors.dark.bermudaGrey
            }}
          >
            <OTPInput
              key={index}
              onLayout={getCellOnLayoutHandler(index)}
              borderColor={isFocused ? colors.secondary : colors.dark.bermudaGrey}
            >
              {symbol || (isFocused ? <Cursor /> : null)}
            </OTPInput>
          </View>
        )}
      />
    </OTPContainer>
  );
};
