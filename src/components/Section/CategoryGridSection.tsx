import { Skeleton } from 'components/Skeleton';
import { Spacer } from 'components/Spacer';
import { Text } from 'components/Text';
import { CategoryListInterface } from 'interfaces/ProductInterface';
import React from 'react';
import { FlatList, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import colors from 'styles/colors';

import { CategoryGridSectionProps } from './CategoryGridSection.type';

const GridContainer = styled(TouchableOpacity)`
  display: flex;
  gap: 8px;
`;

export const CategoryGridSection = ({
  data,
  isLoading,
  productOnPress,
  wrapperStyle
}: CategoryGridSectionProps) => {
  const renderItem = ({ item, index }: { item: CategoryListInterface; index: number }) => {
    return (
      <GridContainer
        style={[
          {
            marginLeft: index === 0 ? 12 : 0,
            marginRight: index === data.length - 1 ? 12 : 0
          },
          wrapperStyle
        ]}
        onPress={() => productOnPress({ id: item?.id, title: item?.name })}
      >
        {isLoading ? (
          <>
            <Skeleton width={88} height={88} rounded />
            <Skeleton width={88} height={14} rounded />
          </>
        ) : (
          <>
            <Image
              source={{ uri: item.image_link }}
              style={{ width: 88, height: 88, borderRadius: 8.5 }}
            />
            <Text
              label={item.name}
              color={colors.dark.blackCoral}
              variant="small"
              fontWeight="semi-bold"
              textAlign="center"
            />
          </>
        )}
      </GridContainer>
    );
  };

  return (
    <SafeAreaView style={{ paddingTop: 12 }}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        ItemSeparatorComponent={() => <Spacer w={12} />}
        showsHorizontalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};
