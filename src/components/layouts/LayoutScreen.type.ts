import React from 'react';
import { ViewStyle } from 'react-native';

export interface LayoutStyledProps {
  backgroundColor?: string;
  isNoPadding?: boolean;
}

export interface LayoutScreenProps extends LayoutStyledProps {
  statusBarColor?: string;
  isScrollable?: boolean;
  children: React.ReactNode;
  padding?: number;
  isRefreshing?: boolean;
  scrollViewContentStyle?: ViewStyle;
  onRefresh?: () => void;
  bottomSafeAreaColor?: string;
  isFooter?: boolean;
  footerText?: string;
  hasForm?: boolean;
}
