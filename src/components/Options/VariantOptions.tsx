import { Spacer } from 'components/Spacer';
import { Text } from 'components/Text';
import type {
  VariantActiveState,
  VariantOption,
  Variants
} from 'interfaces/ProductDetailInterface';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import colors from 'styles/colors';

import { VariantOptionsInterface } from './VariantOptions.type';

const StyledWrapper = styled(View)`
  display: flex;
  gap: 12px;
`;

const StyledOption = styled(TouchableOpacity)<{ isActive: boolean; disabled?: boolean }>`
  align-items: center;
  background-color: ${(props) => (props.disabled ? colors.dark.solitude + '1A' : 'transparent')};
  border-color: ${(props) => (props.isActive ? colors.secondary : colors.dark.silver)};
  border-radius: 24px;
  border-width: 1.5px;
  display: flex;
  flex-direction: row;
  gap: 6px;
  padding: 6px 8px 6px 8px;
`;

export const VariantOptions = ({
  data,
  label,
  sequence,
  active,
  setActive
}: VariantOptionsInterface) => {
  const renderItem = ({ item }: { item: VariantOption }) => {
    return (
      <StyledOption
        isActive={active === item.id}
        onPress={() =>
          setActive((prev: VariantActiveState) => {
            const nextState = { ...prev };

            nextState[sequence] = item.id;

            Object.keys(nextState).forEach((key) => {
              if (nextState[key as Variants] === active) {
                delete nextState[key as Variants];
              }
            });

            return nextState;
          })
        }
        disabled={item.disabled}
      >
        {item.image_link && (
          <Image
            source={{ uri: item.image_link }}
            style={{
              aspectRatio: 1,
              objectFit: 'cover',
              borderRadius: 24,
              opacity: item.disabled ? 0.75 : 1
            }}
            width={24}
          />
        )}

        <Text
          label={item.name}
          color={colors.dark.blackCoral}
          variant={item.image_link ? 'extra-small' : 'small'}
          style={{ paddingHorizontal: 6, paddingVertical: 3, opacity: item.disabled ? 0.4 : 1 }}
        />
      </StyledOption>
    );
  };

  return (
    <StyledWrapper>
      <Text
        label={label}
        color={colors.dark.blackCoral}
        variant="small"
        textTransform="capitalize"
      />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item: VariantOption) => item.id}
        key={'variant'}
        horizontal
        scrollEnabled
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <Spacer w={8} />}
        contentContainerStyle={{
          paddingBottom: 20
        }}
      />
    </StyledWrapper>
  );
};
