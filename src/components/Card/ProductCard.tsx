// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import { Button } from 'components/Button';
import { Icon } from 'components/Icon';
import { Text } from 'components/Text';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import colors from 'styles/colors';
import { currencyFormatter } from 'utils/currencyFormatter';

import type { ProductCardBaseInterface, ProductCardVariantType } from './ProductCard.type';

const CardContainer = styled(TouchableOpacity)`
  background-color: white;
  border-radius: 12px;
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

const CardFooter = styled(View)`
  display: flex;
  gap: 12px;
`;

const ProductCardPrimary = ({
  id,
  name,
  main_image_link,
  selling_price,
  cardStyle,
  isWishlist = false,
  productOnPress,
  buttonOnPress,
  wishlistOnPress
}: ProductCardBaseInterface) => {
  const { t } = useTranslation(['home']);
  return (
    <CardContainer
      style={[
        cardStyle,
        {
          shadowColor: colors.dark.blackCoral,
          shadowOffset: { width: -2, height: 4 },
          shadowOpacity: 0.18,
          shadowRadius: 3,
          elevation: 5,
          position: 'relative'
        }
      ]}
      onPress={() => productOnPress({ id, title: name })}
    >
      <TouchableOpacity
        onPress={() => wishlistOnPress({ id, isWishlist })}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 99,
          padding: 8
        }}
      >
        <Icon
          name={isWishlist ? 'wishlist' : 'wishlistOutline'}
          size="16"
          color={isWishlist ? colors.secondary : colors.dark.gumbo}
        />
      </TouchableOpacity>
      <Image
        source={{ uri: main_image_link }}
        style={{ aspectRatio: 1, objectFit: 'cover', borderRadius: 7 }}
      />

      <CardContent>
        <Text
          label={name}
          variant="extra-small"
          color={colors.dark.blackCoral}
          ellipsizeMode="tail"
          numberOfLines={2}
        />
        <CardFooter>
          <Text
            label={currencyFormatter(Number(selling_price))}
            variant="small"
            color={colors.dark.blackCoral}
            fontWeight="semi-bold"
          />
          <Button
            label={t('home:viewDetail')}
            onPress={() => buttonOnPress({ id, title: name })}
            variant="background"
            fontSize="small"
            fontWeight="semi-bold"
            leftIcon="cart"
            iconSize="16px"
            iconColor={colors.light.whiteSolid}
            color={colors.secondary}
            height={32}
            borderRadius="28px"
            borderColor={colors.secondary}
            borderWidth="1px"
          />
        </CardFooter>
      </CardContent>
    </CardContainer>
  );
};

const ProductCardSecondary = ({
  id,
  name,
  main_image_link,
  selling_price,
  cardStyle,
  isWishlist = false,
  productOnPress,
  wishlistOnPress
}: ProductCardBaseInterface) => {
  return (
    <CardContainer
      style={[
        cardStyle,
        {
          shadowColor: colors.dark.blackCoral,
          shadowOffset: { width: -2, height: 4 },
          shadowOpacity: 0.18,
          shadowRadius: 3,
          elevation: 5,
          position: 'relative'
        }
      ]}
      onPress={() => productOnPress({ id, title: name })}
    >
      <TouchableOpacity
        onPress={() => wishlistOnPress({ id, isWishlist })}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 99,
          padding: 8
        }}
      >
        <Icon
          name={isWishlist ? 'wishlist' : 'wishlistOutline'}
          size="16"
          color={isWishlist ? colors.secondary : colors.dark.gumbo}
        />
      </TouchableOpacity>
      <Image
        source={{ uri: main_image_link }}
        style={{ aspectRatio: 1, objectFit: 'cover', borderRadius: 7 }}
      />

      <CardContent>
        <Text
          label={name}
          variant="extra-small"
          color={colors.dark.blackCoral}
          ellipsizeMode="tail"
          numberOfLines={2}
        />
        <CardFooter>
          <Text
            label={currencyFormatter(Number(selling_price))}
            variant="small"
            color={colors.dark.blackCoral}
            fontWeight="semi-bold"
          />
          {/* TODO: ignore this for now, maybe in the future we need this again we don't know */}
          {/* <Button
            label="View Details"
            onPress={buttonOnPress}
            variant="background"
            fontSize="extra-small"
            fontWeight="semi-bold"
            leftIcon="cart"
            iconSize="16px"
            iconColor={colors.yellow.darkYellow}
            color="rgba(214, 199, 146, 0.17)"
            textColor={colors.yellow.darkYellow}
            height={32}
            borderRadius="28px"
            borderColor={colors.yellow.lightYellow}
            borderWidth="1px"
          /> */}
        </CardFooter>
      </CardContent>
    </CardContainer>
  );
};

interface ProductCardInterface extends ProductCardBaseInterface {
  variant: ProductCardVariantType;
}

export const ProductCard = (props: ProductCardInterface) => {
  const productCartVariantMapper: Record<ProductCardVariantType, JSX.Element> = {
    primary: <ProductCardPrimary {...props} />,
    secondary: <ProductCardSecondary {...props} />
  };

  return productCartVariantMapper[props.variant];
};
