import { gap } from 'constant';
import React from 'react';
import { FlatList, StyleProp, ViewStyle } from 'react-native';

import { ProductCardSkeleton } from './ProductCardSkeleton';

export const ProductInfiniteFlatListSkeleton = ({
  numColumn,
  style
}: {
  numColumn: number;
  style?: StyleProp<ViewStyle>;
}) => {
  const data = Array.from({ length: 4 });

  return (
    <FlatList
      data={data}
      keyExtractor={(_, index) => index.toString()}
      renderItem={() => <ProductCardSkeleton style={style} />}
      numColumns={numColumn}
      scrollEnabled={false}
      contentContainerStyle={{
        gap,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 12
      }}
      columnWrapperStyle={{ gap }}
    />
  );
};
