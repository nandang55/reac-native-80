// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import { Button } from 'components/Button';
import { Icon } from 'components/Icon';
import { Text } from 'components/Text';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import styled from 'styled-components/native';
import colors from 'styles/colors';
import { currencyFormatter } from 'utils/currencyFormatter';

import { WishlistCardInterface } from './WishlistCard.type';

const WishlistCardContainer = styled(View)`
  align-items: flex-start;
  flex-direction: row;
  gap: 8px;
  width: 100%;
`;

export const WishlistCard: React.FC<WishlistCardInterface> = ({
  data,
  edit,
  checked,
  onOpenCart,
  onRemoveWishlist,
  onChecked,
  onClickProduct
}) => {
  const { main_image_link, product_name, selling_price, is_sold_out, product_id } = data;

  return (
    <>
      <WishlistCardContainer
        style={{
          borderBottomWidth: 0.8,
          borderBottomColor: colors.dark.bermudaGrey,
          marginBottom: 16,
          paddingBottom: 16
        }}
      >
        {edit && (
          <View>
            <BouncyCheckbox
              size={16}
              style={{ padding: 1, marginRight: -16 }}
              iconComponent={
                <Icon
                  name={checked ? 'checkedCircle' : 'checkCircleOutline'}
                  size="17px"
                  color={colors.red.newPink}
                />
              }
              iconStyle={{ backgroundColor: 'transparent' }}
              isChecked={checked}
              onPress={() => onChecked(product_id)}
              useBuiltInState={false}
            />
          </View>
        )}
        <TouchableOpacity onPress={onClickProduct}>
          <Image
            source={{ uri: main_image_link }}
            style={{
              aspectRatio: 1,
              objectFit: 'cover',
              borderRadius: 12,
              opacity: is_sold_out ? 0.5 : 1.0
            }}
            width={92}
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            flex: 1
          }}
        >
          <View style={{ gap: 16, flexBasis: '90%', opacity: is_sold_out ? 0.5 : 1.0 }}>
            <TouchableOpacity style={{ gap: 8 }} onPress={onClickProduct}>
              <Text
                label={product_name}
                variant="small"
                color={colors.dark.blackCoral}
                numberOfLines={1}
              />
              <View style={{ flexDirection: 'row', gap: 16 }}>
                <Text
                  label={currencyFormatter(Number(selling_price))}
                  fontWeight="semi-bold"
                  color={colors.dark.blackCoral}
                />
                {is_sold_out && (
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      backgroundColor: colors.red.linenRed,
                      borderRadius: 100
                    }}
                  >
                    <Text label={'Sold Out'} variant="extra-small" color={colors.red.newPink} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
            <Button
              label="Add to Cart"
              onPress={onOpenCart}
              variant="background"
              color={colors.secondary}
              borderRadius="28px"
              fontSize="small"
              height={32}
              width={140}
              isDisable={is_sold_out}
            />
          </View>
          {!edit && (
            <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={onRemoveWishlist}>
              <Icon name="trashBinOutline2" size="24px" color={colors.dark.gumbo} />
            </TouchableOpacity>
          )}
        </View>
      </WishlistCardContainer>
    </>
  );
};
