import { Icon, IconType } from 'components/Icon';
import { ImageStatic, ImageStaticType } from 'components/Image';
import { Text } from 'components/Text';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';

import type { FontWeightType, TextVariantType } from '../Text/Text.type';

interface ButtonIconInterface {
  leftIcon?: IconType;
  rightIcon?: IconType;
  iconColor?: string;
  size?: string;
}
interface ButtonProps extends ButtonIconInterface {
  children: React.ReactNode;
}

const ButtonIcon = ({ leftIcon, rightIcon, iconColor, children, size }: ButtonProps) => {
  return (
    <>
      {leftIcon && <Icon name={leftIcon} size={size || '18px'} color={iconColor} />}
      <View style={{ marginLeft: leftIcon ? 4 : 0, marginRight: rightIcon ? 4 : 0 }}>
        {children}
      </View>
      {rightIcon && <Icon name={rightIcon} size={size || '18px'} color={iconColor} />}
    </>
  );
};

type ButtonSizeType = 'small' | 'regular';

interface ButtonBaseInterface extends ButtonIconInterface {
  onPress: () => void;
  color?: string;
  label: string;
  isDisable?: boolean;
  isDisableColor?: string;
  size?: ButtonSizeType;
  fontWeight?: FontWeightType;
  fontSize?: TextVariantType;
  iconSize?: string;
  width?: number;
  height?: number;
  borderRadius?: string;
  borderColor?: string;
  isDisableBorderColor?: string;
  borderWidth?: string;
  textColor?: string;
  isDisableTextColor?: string;
  image?: ImageStaticType;
}

interface ButtonStyledProps {
  backgroundColor: string;
  borderWidth?: string;
  borderRadius?: string;
  size?: ButtonSizeType;
  borderColor?: string;
  width?: number;
  height?: number;
}

const buttonSizeMapper: Record<ButtonSizeType, string> = {
  small: '8px 16px',
  regular: '12px 24px'
};

const ButtonStyled = styled(TouchableOpacity)<ButtonStyledProps>`
  align-items: center;
  background-color: ${(props) => props.backgroundColor};
  border-color: ${({ borderColor = colors.dark.gumbo }) => borderColor};
  border-radius: ${(props) => props.borderRadius ?? '4px'};
  border-width: ${(props) => props.borderWidth ?? '0px'};
  flex-direction: row;
  justify-content: center;
  padding: ${(props) =>
    props.height || props.width ? '0px' : buttonSizeMapper[props.size ?? 'regular']};
  ${(props) => props.width && { width: props.width }};
  ${(props) => props.height && { height: props.height }};
`;

const ButtonPlain = ({
  onPress,
  fontWeight,
  fontSize,
  iconSize,
  label,
  leftIcon,
  rightIcon,
  iconColor,
  isDisable,
  height,
  size,
  width,
  borderRadius
}: ButtonBaseInterface) => (
  <ButtonStyled
    onPress={isDisable ? undefined : onPress}
    borderWidth="1px"
    backgroundColor={colors.light.whiteSolid}
    size={size}
    width={width}
    height={height}
    borderRadius={borderRadius}
  >
    <ButtonIcon leftIcon={leftIcon} rightIcon={rightIcon} iconColor={iconColor} size={iconSize}>
      <Text
        label={label}
        fontWeight={fontWeight || 'bold'}
        textTransform="capitalize"
        variant={fontSize ? fontSize : size === 'small' ? 'small' : 'medium'}
        color={isDisable ? '#f3f3f3' : colors.dark.gumbo}
      />
    </ButtonIcon>
  </ButtonStyled>
);

const ButtonBackground = ({
  onPress,
  color,
  fontWeight,
  fontSize,
  iconSize,
  label,
  leftIcon,
  rightIcon,
  iconColor,
  isDisable,
  isDisableColor,
  height,
  size,
  width,
  borderRadius,
  borderColor,
  isDisableBorderColor,
  borderWidth,
  textColor,
  isDisableTextColor,
  image
}: ButtonBaseInterface) => (
  <ButtonStyled
    size={size}
    onPress={isDisable ? undefined : onPress}
    disabled={isDisable}
    backgroundColor={
      isDisable ? isDisableColor || colors.light.whiteSmoke : color || colors.primary
    }
    height={height}
    width={width}
    borderRadius={borderRadius}
    borderColor={isDisable ? isDisableBorderColor : borderColor}
    borderWidth={borderWidth}
  >
    {image ? (
      <ImageStatic name="paypal" />
    ) : (
      <ButtonIcon leftIcon={leftIcon} rightIcon={rightIcon} iconColor={iconColor} size={iconSize}>
        <Text
          label={label}
          fontWeight={fontWeight || 'bold'}
          variant={fontSize ? fontSize : size === 'small' ? 'small' : 'medium'}
          color={
            isDisable
              ? isDisableTextColor || colors.dark.solitude
              : textColor || colors.light.whiteSolid
          }
        />
      </ButtonIcon>
    )}
  </ButtonStyled>
);

const ButtonSecondary = ({
  onPress,
  color,
  fontWeight,
  fontSize,
  iconSize,
  label,
  leftIcon,
  rightIcon,
  iconColor,
  isDisable,
  isDisableColor,
  height,
  size,
  width,
  borderRadius,
  borderColor,
  isDisableBorderColor,
  borderWidth = '1px',
  textColor,
  isDisableTextColor
}: ButtonBaseInterface) => (
  <ButtonStyled
    borderWidth={borderWidth}
    size={size}
    onPress={isDisable ? undefined : onPress}
    disabled={isDisable}
    backgroundColor={
      isDisable ? isDisableColor || colors.dark.bermudaGrey : color || colors.light.whiteSolid
    }
    height={height}
    width={width}
    borderRadius={borderRadius}
    borderColor={isDisable ? isDisableBorderColor : borderColor}
  >
    <ButtonIcon leftIcon={leftIcon} rightIcon={rightIcon} iconColor={iconColor} size={iconSize}>
      <Text
        label={label}
        fontWeight={fontWeight || 'bold'}
        variant={fontSize ? fontSize : size === 'small' ? 'small' : 'medium'}
        color={
          isDisable
            ? isDisableTextColor || colors.light.whiteSmoke
            : textColor || colors.dark.blackCoral
        }
      />
    </ButtonIcon>
  </ButtonStyled>
);

type ButtonVariantType = 'plain' | 'background' | 'secondary';

interface ButtonInterface extends ButtonBaseInterface {
  variant: ButtonVariantType;
}

export const Button = (props: ButtonInterface) => {
  const buttonVariantMapper: Record<ButtonVariantType, JSX.Element> = {
    plain: <ButtonPlain {...props} />,
    background: <ButtonBackground {...props} />,
    secondary: <ButtonSecondary {...props} />
  };

  return buttonVariantMapper[props.variant];
};
