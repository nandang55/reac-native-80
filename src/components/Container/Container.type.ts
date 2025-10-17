import React from 'react';

export interface ContainerStyledProps {
  backgroundColor?: string;
  borderRadius?: string;
  isHeightFull?: boolean;
  isNoPadding?: boolean;
  isNoElevation?: boolean;
}

export interface ContainerProps extends ContainerStyledProps {
  children: React.ReactNode;
}
