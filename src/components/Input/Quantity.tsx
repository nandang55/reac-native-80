import { Icon } from 'components/Icon';
import { Text } from 'components/Text';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';

import { InputQuantityInterface } from './Quantity.type';

const StyledWrapper = styled(View)`
  display: flex;
  gap: 12px;
`;

const StyledInput = styled(View)`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: 18px;
`;

const StyledButton = styled(TouchableOpacity)<{ disabled?: boolean }>`
  background-color: ${(props) => (props.disabled ? colors.light.whiteSmoke : colors.secondary)};
  border: 1px solid;
  border-color: ${(props) => (props.disabled ? colors.dark.silver : colors.secondary)};
  border-radius: 28px;
  padding: 4px;
`;

export const InputQuantity = ({ value, setValue, label, min, max }: InputQuantityInterface) => {
  const handleSubstract = () => {
    if (value === min) return;
    setValue(value - 1);
  };

  const handleAdd = () => {
    if (value === max) return;
    setValue(value + 1);
  };

  return (
    <StyledWrapper>
      {label && <Text label={label} color={colors.dark.blackCoral} variant="small" />}
      <StyledInput>
        <StyledButton onPress={handleSubstract} disabled={value === min}>
          <Icon
            name="substract"
            size="16"
            color={value === min ? colors.dark.solitude : colors.light.whiteSolid}
          />
        </StyledButton>
        <Text
          label={value.toString()}
          color={colors.dark.blackCoral}
          variant="small"
          style={{ marginTop: 4.5 }}
        />
        <StyledButton onPress={handleAdd} disabled={value === max}>
          <Icon
            name="add"
            size="16"
            color={value === max ? colors.dark.solitude : colors.light.whiteSolid}
          />
        </StyledButton>
      </StyledInput>
    </StyledWrapper>
  );
};
