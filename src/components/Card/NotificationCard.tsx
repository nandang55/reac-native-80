// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import { Icon, IconType } from 'components/Icon';
import { Text } from 'components/Text';
import React, { memo } from 'react';
import { TouchableOpacity, useWindowDimensions, View } from 'react-native';
import RenderHtml, { defaultSystemFonts } from 'react-native-render-html';
import styled from 'styled-components';
import colors from 'styles/colors';
import { replaceBracketsWithTag } from 'utils/replaceBracketsWithTag';

import { NotificationCardInterface } from './NotificationCard.type';

const CardContainer = styled(TouchableOpacity)`
  border-bottom-width: 0.8px;
  gap: 12px;
  padding: 12px 16px;
`;

const iconName = {
  '0': 'creditCard',
  '25': 'creditScore',
  '50': 'localShipping'
};

type KeyIconName = keyof typeof iconName;

export const NotificationCard = ({
  title,
  description,
  is_read,
  order_number,
  order_status,
  created_at_display,
  onPress
}: NotificationCardInterface) => {
  const { width } = useWindowDimensions();

  const systemFonts = [...defaultSystemFonts, 'Poppins-Regular', 'Poppins-SemiBold'];

  // eslint-disable-next-line react/display-name
  const MemoizedRenderHtml = memo(() => {
    const processedDescription = replaceBracketsWithTag(description, 'span');

    return (
      <RenderHtml
        source={{
          html: processedDescription
        }}
        contentWidth={width}
        tagsStyles={{ span: { fontFamily: 'Poppins-SemiBold' } }}
        baseStyle={{ fontSize: 12, color: colors.dark.gumbo, fontFamily: 'Poppins-Regular' }}
        systemFonts={systemFonts}
      />
    );
  });

  return (
    <CardContainer
      style={{
        backgroundColor: !is_read ? '#FF83AF0D' : colors.light.whiteSolid,
        borderBottomColor: !is_read ? colors.secondary : colors.dark.solitude
      }}
      onPress={onPress}
    >
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View
          style={{
            height: 28,
            padding: 6,
            borderRadius: 100,
            borderColor: colors.dark.silver,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Icon
            name={iconName[(order_status?.toString() ?? '0') as KeyIconName] as IconType}
            size="16"
            color={colors.dark.blackCoral}
          />
        </View>
        <View style={{ flex: 1, gap: 8 }}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ gap: 4 }}>
              <Text
                label={title}
                color={colors.dark.blackCoral}
                variant="medium"
                fontWeight={!is_read ? 'semi-bold' : 'regular'}
              />
              <Text
                label={`Order ID #${order_number ?? ''}`}
                color={colors.dark.blackCoral}
                variant="medium"
                fontWeight={!is_read ? 'semi-bold' : 'regular'}
              />
            </View>
            <Text label={created_at_display} color={colors.dark.gumbo} variant="extra-small" />
          </View>
          <MemoizedRenderHtml />
        </View>
      </View>
    </CardContainer>
  );
};
