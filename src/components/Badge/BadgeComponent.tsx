import { Icon } from 'components/Icon';
import { Text } from 'components/Text';
import React from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { styled } from 'styled-components';
import colors from 'styles/colors';

import { BadgeComponentProps } from './BadgeInterface';

const MAX_NOTIFICATION = 99;

const CountContainerStyled = styled(View)`
  background-color: ${colors.secondary};
  border-radius: 10px;
  padding: 0px 4px;
  position: absolute;
  right: -4px;
  top: -6px;
`;

const CountContainer = ({
  count,
  children,
  style
}: {
  count: number;
  children: React.ReactNode;
  style: StyleProp<ViewStyle>;
}) => {
  return count > 0 ? <CountContainerStyled style={style}>{children}</CountContainerStyled> : null;
};

export const BadgeComponent = ({
  isSuccess,
  total,
  name,
  size,
  color,
  onPress,
  style,
  countStyle,
  stroke
}: BadgeComponentProps) => {
  const handleCountingBadge = () => {
    let tempCount: number = 0;

    if (isSuccess && total >= 100) {
      tempCount = MAX_NOTIFICATION;
    } else {
      if (total && total >= 1) return (tempCount = total);
    }

    return tempCount;
  };
  return (
    <TouchableOpacity onPress={onPress} style={[{ position: 'relative' }, style]}>
      <Icon name={name} size={size} color={color} stroke={stroke} />
      <CountContainer count={handleCountingBadge()} style={countStyle}>
        <Text
          label={handleCountingBadge().toString()}
          color={colors.light.whiteSolid}
          variant="extra-small"
          fontWeight="regular"
        />
      </CountContainer>
    </TouchableOpacity>
  );
};
