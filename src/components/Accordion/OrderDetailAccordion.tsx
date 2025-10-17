import { Icon } from 'components/Icon';
import { Text } from 'components/Text';
import { OrderItemsInterface } from 'interfaces/OrderInterface';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Image, LayoutAnimation, Platform, UIManager, View } from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';
import { currencyFormatter } from 'utils/currencyFormatter';

import { OrderDetailAccordionListInterface } from './OrderDetailAccordion.type';

const renderListItem = (item: OrderItemsInterface, index: number) => (
  <View key={index} style={{ flexDirection: 'row', gap: 12 }}>
    <Image
      source={{ uri: item?.product_image_link }}
      style={{ aspectRatio: 1, width: 90, borderRadius: 18 }}
    />
    <View style={{ gap: 4, flex: 1 }}>
      <Text label={item?.product_name} variant="small" color={colors.dark.blackCoral} />
      <Text label={item?.product_variant} variant="extra-small" color={colors.dark.bermudaGrey} />
      <Text
        label={`${item?.quantity.toString()} x ${currencyFormatter(item?.selling_price)}`}
        variant="extra-small"
        fontWeight="semi-bold"
        color={colors.dark.blackCoral}
      />
    </View>
  </View>
);

const AccordionContainer = styled.TouchableOpacity`
  align-items: center;
  border-bottom-color: ${colors.dark.bermudaGrey};
  border-bottom-width: 1px;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 12px;
`;

export const OrderDetailAccordion = ({ data }: OrderDetailAccordionListInterface) => {
  const { t } = useTranslation('order');

  const [expand, setExpand] = useState<boolean>(false);
  const rotateAnimation = new Animated.Value(expand ? 1 : 0);

  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpand(!expand);

    Animated.timing(rotateAnimation, {
      toValue: expand ? 0 : 1,
      duration: 900,
      useNativeDriver: true
    }).start();
  };

  const rotateInterpolation = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-90deg']
  });

  return (
    <View style={{ gap: 12 }}>
      {expand ? data.map(renderListItem) : [data[0]].map(renderListItem)}
      {data.length > 1 && (
        <AccordionContainer onPress={toggleExpand}>
          <Text
            style={{ paddingVertical: 5 }}
            label={expand ? t('hideProducts') : `+${data.length - 1} ${t('otherProducts')}`}
            variant="small"
            color={colors.dark.gumbo}
          />
          <Animated.View style={{ transform: [{ rotate: rotateInterpolation }] }}>
            <Icon
              name="chevronRight"
              size="16"
              color={colors.light.whiteSolid}
              stroke={colors.dark.gumbo}
            />
          </Animated.View>
        </AccordionContainer>
      )}
    </View>
  );
};
