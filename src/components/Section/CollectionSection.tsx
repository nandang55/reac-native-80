import { Skeleton } from 'components/Skeleton';
import { ImageSlider } from 'components/Slider';
import { Text } from 'components/Text';
import React, { isValidElement } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';

import { CollectionSectionProps } from './CollectionSection.type';

const StyledContainer = styled(View)`
  gap: 16px;
  padding: 16px 0;
`;

export const CollectionSection = ({
  data,
  label,
  isLoading,
  labelStyle,
  borderRadius,
  spacing,
  bannerOnPress
}: CollectionSectionProps) => {
  return (
    <StyledContainer>
      <View style={labelStyle}>
        {isLoading ? (
          <Skeleton width={88} height={14} style={{ borderRadius: 2 }} />
        ) : isValidElement(label) ? (
          label
        ) : (
          <Text label={label as string} color={colors.dark.blackCoral} variant="small" />
        )}
      </View>
      <ImageSlider
        data={data || []}
        height={162}
        onPress={bannerOnPress}
        isLoading={isLoading}
        borderRadius={borderRadius}
        spacing={spacing}
      />
    </StyledContainer>
  );
};
