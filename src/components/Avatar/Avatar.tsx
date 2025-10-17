import { Text } from 'components/Text';
import React from 'react';
import { Image, View } from 'react-native';
import colors from 'styles/colors';

import { AvatarProps } from './Avatar.type';

export const Avatar = ({ borderRadius, size, uri, name }: AvatarProps) => {
  const names = name?.replace(/[^a-zA-Z ]/, '').split(' ');
  let avatarText = '';
  if (names && names.length && names[1]) {
    avatarText = `${names[0].slice(0, 1).toUpperCase()}${names[1].slice(0, 1).toUpperCase()}`;
  } else if (names && names.length && names[0]) {
    avatarText = names[0].slice(0, 1).toUpperCase();
  }
  return (
    <View>
      {uri ? (
        <Image
          style={{ borderRadius: borderRadius || size / 2, width: size, height: size }}
          source={{ uri }}
        />
      ) : (
        <View
          style={{
            backgroundColor: colors.teal.verdigris,
            width: size,
            height: size,
            borderRadius: borderRadius || size / 2,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 2
          }}
        >
          <Text
            label={avatarText}
            color={colors.light.whiteSolid}
            fontWeight="semi-bold"
            variant="large"
          />
        </View>
      )}
    </View>
  );
};
