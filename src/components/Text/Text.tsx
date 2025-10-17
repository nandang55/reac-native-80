import React from 'react';
import { Text as RNText } from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';

import { FontFamilyType, FontWeightType, TextProps, TextVariantType } from './Text.type';

type TextFontSizeType =
  | '28px'
  | '24px'
  | '20px'
  | '18px'
  | '16px'
  | '14px'
  | '12px'
  | '10px'
  | '6px';

export const fontFamilyMapper: Record<FontWeightType, FontFamilyType> = {
  'extra-bold': 'Poppins-ExtraBold',
  bold: 'Poppins-Bold',
  'semi-bold': 'Poppins-SemiBold',
  regular: 'Poppins-Regular',
  light: 'Poppins-Light',
  thin: 'Poppins-Thin',
  heading: 'DMSerifDisplay-Regular'
};

const fontSizeMapper: Record<TextVariantType, TextFontSizeType> = {
  collosal: '28px',
  'ultra-large': '24px',
  'extra-larger': '20px',
  'extra-large': '18px',
  large: '16px',
  medium: '14px',
  small: '12px',
  'extra-small': '10px',
  'ultra-small': '6px'
};

const StyledText = styled(RNText)<TextProps>`
  color: ${(props) => props.color || colors.dark.bermudaGrey};
  font-family: ${(props) => fontFamilyMapper[props.fontWeight || 'regular']};
  font-size: ${(props) => fontSizeMapper[props.variant || 'medium']};
  font-style: ${({ fontStyle = 'normal' }) => fontStyle};
  text-align: ${({ textAlign }) => textAlign || 'left'};
  text-decoration: ${({ textDecoration }) => textDecoration || 'none'};
  text-transform: ${({ textTransform }) => textTransform || 'none'};
`;

const Text = (props: TextProps) => {
  //FIXME: fix eslint for destructuring-assignmen
  const { style, ...restProps } = props;
  return (
    <StyledText
      allowFontScaling={false}
      {...restProps}
      style={{
        ...(style as Record<string, unknown>),
        includeFontPadding: false
      }}
    >
      {/* eslint-disable-next-line react/destructuring-assignment */}
      {props.label}
    </StyledText>
  );
};

export default Text;
