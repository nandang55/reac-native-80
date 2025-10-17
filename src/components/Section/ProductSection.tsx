import { ProductCard } from 'components/Card';
import { ProductCardBaseInterface } from 'components/Card/ProductCard.type';
import { Skeleton } from 'components/Skeleton';
import { ProductFlatListSkeleton } from 'components/Skeleton/ProductFlatlistSkeleton';
import { Spacer } from 'components/Spacer';
import { Text } from 'components/Text';
import { gap } from 'constant';
import React from 'react';
import { Dimensions, FlatList, ScrollView, TouchableOpacity, View } from 'react-native';
import colors from 'styles/colors';

import { ProductSectionProps } from './ProductSection.type';

export const ProductSection = ({
  data,
  label,
  cardVariant,
  isLoading,
  hideLabel,
  withCta,
  ctaLabel,
  ctaOnPress,
  productOnPress,
  wishlistOnPress
}: ProductSectionProps) => {
  const numColumn = cardVariant === 'primary' ? 2.7 : 2.9;
  const margin = 0;

  const availableSpace = Dimensions.get('window').width - (numColumn - 1) * gap - margin;
  const widthCard = availableSpace / numColumn;
  const heightCard = availableSpace / numColumn;

  const renderItem = ({ item, index }: { item: ProductCardBaseInterface; index: number }) => {
    if (item.empty) {
      return <View style={{ width: widthCard, height: heightCard }} />;
    }
    return (
      <ProductCard
        {...item}
        variant={cardVariant}
        isWishlist={item.is_wishlist || false}
        productOnPress={productOnPress}
        buttonOnPress={productOnPress}
        wishlistOnPress={wishlistOnPress}
        cardStyle={{
          marginLeft: index === 0 ? 12 : 0,
          marginRight: index === data.length - 1 ? 12 : 0,
          width: widthCard,
          minHeight: heightCard
        }}
      />
    );
  };

  const ProductFlatList = () => (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item: ProductCardBaseInterface) => item.id}
      key={'v'}
      horizontal
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      ItemSeparatorComponent={() => <Spacer w={8} />}
      contentContainerStyle={{
        paddingBottom: 20
      }}
      extraData={data}
    />
  );

  return (
    <>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 16,
          padding: hideLabel ? 0 : 12
        }}
      >
        {!hideLabel && (
          <>
            {isLoading ? (
              <Skeleton width={88} height={14} style={{ borderRadius: 2 }} />
            ) : (
              <Text label={label} color={colors.dark.blackCoral} />
            )}
            {withCta && (
              <>
                {isLoading ? (
                  <Skeleton width={41} height={14} style={{ borderRadius: 2 }} />
                ) : (
                  <TouchableOpacity onPress={ctaOnPress}>
                    <Text label={ctaLabel} color={colors.blue.maastrichtBlue} />
                  </TouchableOpacity>
                )}
              </>
            )}
          </>
        )}
      </View>
      <>
        {isLoading ? (
          <ProductFlatListSkeleton style={{ width: widthCard, minHeight: heightCard }} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <ProductFlatList />
          </ScrollView>
        )}
      </>
    </>
  );
};
