import { Icon, IconType } from 'components/Icon';
import { Text } from 'components/Text';
import React from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import colors from 'styles/colors';

import { MenuListInterface } from './MenuList.type';

const MenuListItem = styled(TouchableOpacity)`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px;
  width: 100%;
`;

const IconCard = styled(View)<{ backgroundColor: string }>`
  background-color: ${(props) => props.backgroundColor || colors.light.whiteSmoke};
  border-radius: 8px;
  padding: 4px;
`;

const TextContainer = styled(View)`
  display: flex;
  gap: 2px;
`;

export const MenuList = ({
  type,
  icon,
  iconProps,
  iconCard,
  iconCardBackground,
  label,
  description,
  onPress,
  selected,
  noBorder,
  rightIcon,
  rightIconProps
}: MenuListInterface) => {
  const IconContainer = iconCard ? IconCard : View;
  return (
    <View style={{ borderBottomWidth: noBorder ? 0 : 1, borderBottomColor: colors.dark.solitude }}>
      <MenuListItem
        style={{ backgroundColor: selected ? colors.light.whiteSmoke : colors.light.whiteSolid }}
        onPress={onPress}
      >
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          {icon && (
            <IconContainer backgroundColor={iconCardBackground as string}>
              <Icon name={icon} {...iconProps} />
            </IconContainer>
          )}
          <TextContainer>
            <Text
              label={label}
              color={type === 'primary' && description ? colors.dark.blackCoral : colors.dark.gumbo}
              variant={description ? (type === 'primary' ? 'large' : 'extra-small') : 'medium'}
              fontWeight={selected ? 'semi-bold' : 'regular'}
            />
            {description && (
              <Text
                label={description}
                color={type === 'primary' ? colors.dark.gumbo : colors.dark.blackCoral}
              />
            )}
          </TextContainer>
        </View>
        {rightIcon && <Icon name={rightIcon as IconType} {...rightIconProps} />}
      </MenuListItem>
    </View>
  );
};
