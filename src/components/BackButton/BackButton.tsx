import { HeaderBackButton, HeaderBackButtonProps } from '@react-navigation/elements';
import Back from 'assets/images/back-button.svg';
import React from 'react';

const DEFAULT_TINT_COLOR = 'white';
const DEFAULT_STYLE = { margin: 12 };

export const BackButton = ({
  onPress,
  tintColor = DEFAULT_TINT_COLOR,
  style = DEFAULT_STYLE,
  ...rest
}: HeaderBackButtonProps) => (
  <HeaderBackButton
    onPress={onPress}
    labelVisible={false}
    backImage={() => <Back />}
    tintColor={tintColor}
    style={style}
    {...rest}
  />
);
