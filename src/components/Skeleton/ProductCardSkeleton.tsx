import { Skeleton } from 'components/Skeleton';
import React from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import styled from 'styled-components';

const CardContainer = styled(TouchableOpacity)`
  background-color: white;
  border-radius: 7px;
  height: 100%;
  padding: 8px;
`;

const CardContent = styled(View)`
  display: flex;
  flex: 1;
  gap: 12px;
  justify-content: space-between;
  padding-top: 12px;
`;

export const ProductCardSkeleton = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  return (
    <CardContainer
      style={[
        style,
        {
          shadowColor: '#171717',
          shadowOffset: { width: -2, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 5
        }
      ]}
    >
      <Skeleton width={'100%'} height={'auto'} style={{ aspectRatio: 1 }} rounded />

      <CardContent>
        <Skeleton height={14} width={'100%'} />
        <Skeleton height={14} width={'50%'} />
        <Skeleton height={36} width={'100%'} style={{ borderRadius: 4 }} />
      </CardContent>
    </CardContainer>
  );
};
