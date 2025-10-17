import { Text } from 'components/Text';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';

import { InputPhoneNumberInterface } from './PhoneNumber.type';
import { InputText } from './Text';

const Container = styled(View)`
  gap: 8px;
  position: relative;
  width: 100%;
`;

const InputContainer = styled(View)`
  flex-direction: row;
  gap: 12px;
`;

export const InputPhoneNumber = ({
  label,
  isError,
  helperText,
  errorText,
  onChangeCode,
  onChangePhone,
  onBlurCode,
  onBlurPhone,
  onFocusCode,
  onFocusPhone,
  valueCode,
  valuePhone,
  isDisabled
}: InputPhoneNumberInterface) => {
  const { t } = useTranslation(['register']);

  const handleChangeNumberOnly = (type: 'code' | 'phone', value: string) => {
    const filteredText = value.replace(/[^0-9]/g, '');

    if (type === 'code') {
      if (onChangeCode) {
        onChangeCode(filteredText);
      }
    } else {
      if (onChangePhone) {
        onChangePhone(filteredText);
      }
    }
  };
  return (
    <Container>
      {label && <Text label={label} color={colors.dark.gumbo} />}
      <InputContainer>
        <View style={{ flex: 1 }}>
          <InputText
            value={valueCode}
            placeholder="Code"
            center
            keyboardType="phone-pad"
            maxLength={4}
            onChange={(value) => handleChangeNumberOnly('code', value)}
            onBlur={onBlurCode}
            onFocus={onFocusCode}
            isError={isError}
            isDisabled={isDisabled}
          />
        </View>
        <View style={{ flex: 3 }}>
          <InputText
            value={valuePhone}
            keyboardType="phone-pad"
            placeholder={t('register:phonePlaceholder')}
            maxLength={16}
            onChange={(value) => handleChangeNumberOnly('phone', value)}
            onBlur={onBlurPhone}
            onFocus={onFocusPhone}
            isError={isError}
            isDisabled={isDisabled}
          />
        </View>
      </InputContainer>
      {isError ? (
        <Text label={errorText} color={colors.red.fireEngineRed} />
      ) : (
        helperText && <Text label={helperText} color={colors.dark.bermudaGrey} />
      )}
    </Container>
  );
};
