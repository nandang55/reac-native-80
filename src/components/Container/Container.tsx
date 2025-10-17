import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';

import { ContainerProps, ContainerStyledProps } from './Container.type';

const ContainerStyled = styled(View)<ContainerStyledProps>`
  background-color: ${colors.light.whiteSolid};
  border-radius: ${(props) => (props.borderRadius ? props.borderRadius : '10px')};
  display: flex;
  elevation: ${(props) => (props.isNoElevation ? 0 : 2)};
  height: ${(props) => (props.isHeightFull ? '100%' : 'auto')};
  padding: ${(props) => (props.isNoPadding ? '0' : '16px')};
  position: relative;
`;

export const Container = ({
  children,
  backgroundColor,
  borderRadius,
  isHeightFull,
  isNoPadding,
  isNoElevation
}: ContainerProps) => {
  return (
    <ContainerStyled
      backgroundColor={backgroundColor}
      borderRadius={borderRadius}
      isHeightFull={isHeightFull}
      isNoPadding={isNoPadding}
      isNoElevation={isNoElevation}
    >
      {children}
    </ContainerStyled>
  );
};
