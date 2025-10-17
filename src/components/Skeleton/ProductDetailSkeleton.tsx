import { Spacer } from 'components/Spacer';
import React from 'react';
import { View } from 'react-native';
import colors from 'styles/colors';

import { Skeleton } from './Skeleton';

export const ProductDetailSkeleton = () => {
  return (
    <>
      <Skeleton height={360} width={'100%'} />
      <View style={{ paddingHorizontal: 12 }}>
        <Spacer h={24} />
        <Skeleton height={14} width={'100%'} />
        <Spacer h={8} />
        <Skeleton height={18} width={122} />
        <Spacer h={16} />
        <View style={{ borderWidth: 0.6, borderColor: colors.dark.bermudaGrey }} />
        <Spacer h={16} />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Skeleton height={18} width={114} />
          <Skeleton height={18} width={114} />
        </View>
        <Spacer h={24} />
        <Skeleton height={18} width={114} />
        <Spacer h={24} />
        <Skeleton height={36} width={'100%'} />
        <Spacer h={16} />
        <View style={{ borderWidth: 0.6, borderColor: colors.dark.bermudaGrey }} />
      </View>
    </>
  );
};
