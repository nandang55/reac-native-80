// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import { Text } from 'components/Text';
import React from 'react';
import { Dimensions, Image, TouchableOpacity } from 'react-native';
import colors from 'styles/colors';

import { CollectionCardInterface } from './CollectionCard.type';

const { width } = Dimensions.get('screen');

export const CollectionCard = ({ id, image_link, name, onPress }: CollectionCardInterface) => {
  return (
    <TouchableOpacity
      onPress={() => onPress({ id, title: name as string })}
      style={{ gap: 12, width: width, paddingHorizontal: 16, paddingVertical: 8 }}
    >
      <Text
        label={name}
        fontWeight="semi-bold"
        variant="small"
        color={colors.dark.blackCoral}
        textAlign="left"
      />
      <Image
        source={{
          uri: image_link
        }}
        style={{
          width: '100%',
          height: 150,
          borderRadius: 12
        }}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
};
