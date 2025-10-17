import React from 'react';
import { FlatList, StyleProp, ViewStyle } from 'react-native';

import { ProductCardSkeleton } from './ProductCardSkeleton';

export const ProductFlatListSkeleton = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const data = Array.from({ length: 4 });

  return (
    <FlatList
      data={data}
      keyExtractor={(_, index) => index.toString()}
      renderItem={() => <ProductCardSkeleton style={style} />}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 12,
        gap: 8,
        paddingBottom: 8
      }}
    />
  );
};
