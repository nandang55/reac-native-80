import { Avatar } from 'components/Avatar';
import { Icon } from 'components/Icon';
import { Text } from 'components/Text';
import React from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styled from 'styled-components';
import colors from 'styles/colors';

import { ProfileHeaderCardInterface } from './ProfileHeaderCard.type';

const UserCard = styled(View)`
  align-items: center;
  background-color: white;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px;
  width: 100%;
`;

export const ProfileHeaderCard = ({
  avatarImageUri,
  avatarSize,
  name,
  phoneNumber,
  editOnPress
}: ProfileHeaderCardInterface) => {
  return (
    <UserCard
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5
      }}
    >
      <View style={{ display: 'flex', flexDirection: 'row', gap: 12 }}>
        <Avatar size={avatarSize} uri={avatarImageUri} name={name} borderRadius={8} />
        <View style={{ display: 'flex', gap: 2 }}>
          <Text label={name} color={colors.dark.blackCoral} variant="large" />
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <Icon name="link" fill={colors.primary} size="12" />
            <Text label={phoneNumber} color={colors.dark.gumbo} variant="small" />
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={editOnPress}>
        <Icon name="edit" fill={colors.dark.gumbo} />
      </TouchableOpacity>
    </UserCard>
  );
};
