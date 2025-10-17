// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import { Icon } from 'components/Icon';
import { InputQuantity } from 'components/Input';
import { Text } from 'components/Text';
import { useI18n } from 'core/hooks/usei18n';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, TouchableOpacity, View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import styled from 'styled-components';
import colors from 'styles/colors';
import { currencyFormatter } from 'utils/currencyFormatter';

import { CartCardBaseInterface } from './CartCard.type';

const CardAvailableContainer = styled(TouchableOpacity)`
  background-color: ${colors.light.whiteSolid};
  border-bottom-width: 1;
  border-color: ${colors.dark.bermudaGrey};
  flex-direction: row;
  height: 106px;
`;

const CardSoldOutContainer = styled(TouchableOpacity)`
  background-color: ${colors.light.whiteSolid};
  flex-direction: row;
  height: 106px;
  position: relative;
`;

const CartCardAvailable = ({
  main_image_link,
  product_name,
  variant_name,
  stock,
  selling_price,
  quantity,
  setQuantity = () => {},
  isChecked,
  handleChecked = () => {},
  onPress,
  activeOpacity = 0
}: CartCardBaseInterface) => {
  const { i18next } = useI18n();

  return (
    <CardAvailableContainer onPress={onPress} activeOpacity={activeOpacity}>
      <View>
        <BouncyCheckbox
          size={16}
          fillColor={colors.dark.bermudaGrey}
          style={{ padding: 1 }}
          unFillColor="transparent"
          ImageComponent={() => <Icon name="checkedCircle" size="17px" />}
          isChecked={isChecked}
          onPress={handleChecked}
        />
      </View>
      <Image
        source={{ uri: main_image_link }}
        style={{ aspectRatio: 1, width: 76, borderRadius: 16, marginRight: 12 }}
      />
      <View
        style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', height: 94 }}
      >
        <View>
          <Text
            label={product_name}
            numberOfLines={2}
            color={colors.dark.blackCoral}
            variant="small"
            style={{ marginBottom: 8 }}
          />
          <Text
            label={variant_name}
            color={colors.dark.blackCoral}
            variant="extra-small"
            fontWeight="regular"
          />
          {stock <= 5 && (
            <Text
              label={i18next.t('cart:productLeft', {
                count: stock,
                interpolation: { escapeValue: false }
              })}
              color={colors.red.americanRed}
              variant="extra-small"
              fontWeight="regular"
            />
          )}
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text
            label={currencyFormatter(selling_price)}
            color={colors.dark.blackCoral}
            fontWeight="semi-bold"
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              paddingLeft: 10
            }}
            onStartShouldSetResponder={() => true}
          >
            <InputQuantity value={quantity} setValue={setQuantity} max={stock} />
          </View>
        </View>
      </View>
    </CardAvailableContainer>
  );
};

const CartCardSoldOut = ({
  main_image_link,
  product_name,
  variant_name,
  selling_price,
  onPress,
  activeOpacity = 0
}: CartCardBaseInterface) => {
  const { t } = useTranslation(['cart']);
  return (
    <CardSoldOutContainer onPress={onPress} activeOpacity={activeOpacity}>
      <Image
        source={{ uri: main_image_link }}
        style={{ aspectRatio: 1, width: 76, borderRadius: 16, marginRight: 12, opacity: 0.5 }}
      />
      <View
        style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', height: 94 }}
      >
        <View style={{ opacity: 0.5 }}>
          <Text
            label={product_name}
            numberOfLines={2}
            color={colors.dark.blackCoral}
            variant="small"
            style={{ marginBottom: 8, marginRight: 60 }}
          />
          <Text
            label={variant_name}
            color={colors.dark.blackCoral}
            variant="extra-small"
            fontWeight="regular"
          />
        </View>
        <View
          style={{
            position: 'absolute',
            right: 0,
            backgroundColor: colors.red.linenRed,
            padding: 4,
            borderRadius: 100,
            opacity: 0.5
          }}
        >
          <Text
            label={t('cart:soldOut')}
            color={colors.red.deepPink}
            variant="extra-small"
            fontWeight="regular"
          />
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text
            label={currencyFormatter(selling_price)}
            color={colors.dark.blackCoral}
            fontWeight="semi-bold"
            style={{ opacity: 0.5 }}
          />
        </View>
      </View>
    </CardSoldOutContainer>
  );
};

export const CartCard = (props: CartCardBaseInterface) => {
  const { stock } = props;

  return stock === 0 ? <CartCardSoldOut {...props} /> : <CartCardAvailable {...props} />;
};
