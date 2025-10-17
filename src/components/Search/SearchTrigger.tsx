import { Icon } from 'components/Icon';
import { Text } from 'components/Text';
import React from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';

import { SearchTriggerInterface } from './SearchTrigger.type';

const SearchTriggerContainer = styled(View)`
  padding: 16px;
`;

export const SearchTrigger: React.FC<SearchTriggerInterface> = ({ value, onPress, withClear }) => {
  return (
    <SearchTriggerContainer>
      <TouchableWithoutFeedback onPress={onPress}>
        <View
          style={{
            borderWidth: 1,
            borderColor: colors.dark.blackCoral,
            paddingHorizontal: 16,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            height: 42,
            width: '100%'
          }}
        >
          <Text
            label={value}
            numberOfLines={1}
            variant="medium"
            color={colors.dark.blackCoral}
            style={{ flex: 1, paddingRight: 4 }}
          />
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            {withClear && (
              <TouchableOpacity onPress={onPress}>
                <Icon name={'close'} color={colors.dark.gumbo} size="14" />
              </TouchableOpacity>
            )}
            <Icon name={'search'} color={colors.dark.gumbo} size="16" />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SearchTriggerContainer>
  );
};
