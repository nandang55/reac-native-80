/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable camelcase */
import { Text } from 'components/Text';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import colors from 'styles/colors';
import { currencyFormatter } from 'utils/currencyFormatter';
import { formatDate } from 'utils/formatDate';

import { OrderCardBaseInterface } from './OrderCard.type';

const CardContainer = styled(TouchableOpacity)`
  background-color: white;
  border-radius: 8px;
  padding: 16px;
`;

const Heading = styled(View)`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Border = styled(View)`
  border: 0.8px solid ${colors.dark.silver};
  margin: 8px 0 12px 0;
`;

export const OrderCard = ({
  id,
  status_name,
  status_color,
  payment_due,
  order_date,
  product_name,
  product_image_link,
  total_payment,
  total_product,
  product_quantity,
  delivery_date,
  completed_date,
  onPressCard = () => undefined
}: OrderCardBaseInterface) => {
  const { t } = useTranslation(['order']);

  const getStatusStyles = (status: string) => {
    let wordingDate, date;

    switch (status) {
      case 'IN PROGRESS':
      case 'EXPIRED ORDER':
        wordingDate = t('order:orderDate');
        date = formatDate(order_date, 'MMM dd, yyyy, HH.mm', { locale: 'en' });
        break;
      case 'PENDING PAYMENT':
        wordingDate = t('order:paymentDue');
        date = formatDate(payment_due, 'MMM dd, yyyy, HH.mm', { locale: 'en' });
        break;
      case 'IN DELIVERY':
        wordingDate = t('order:deliveryDate');
        date = formatDate(delivery_date, 'MMM dd, yyyy, HH.mm', { locale: 'en' });
        break;
      case 'COMPLETED':
        wordingDate = t('order:completeDate');
        date = formatDate(completed_date, 'MMM dd, yyyy, HH.mm', { locale: 'en' });
        break;
    }

    return {
      wordingDate,
      date
    };
  };

  const items = product_quantity > 1 ? t('order:items') : t('order:item');

  return (
    <CardContainer
      onPress={() => onPressCard(id)}
      style={{
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 3
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 4
      }}
    >
      <Heading>
        <View
          style={{
            borderLeftWidth: 3,
            borderColor: status_color,
            paddingLeft: 4
          }}
        >
          <Text
            label={status_name}
            variant="extra-small"
            color={status_color}
            fontWeight="semi-bold"
          />
        </View>
        <View>
          <Text
            label={getStatusStyles(status_name).wordingDate}
            variant="extra-small"
            color={colors.dark.gumbo}
            fontWeight="regular"
            textAlign="right"
          />
          <Text
            label={getStatusStyles(status_name).date}
            variant="extra-small"
            color={colors.dark.blackCoral}
            fontWeight="semi-bold"
          />
        </View>
      </Heading>
      <Border />
      <View style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
          <Image
            source={{ uri: product_image_link }}
            style={{ aspectRatio: 1, width: 32, borderRadius: 4 }}
          />
          <View style={{ gap: 4, flex: 1 }}>
            <Text label={product_name} variant="small" color={colors.dark.blackCoral} />
            <Text
              label={`${product_quantity} ${items}`}
              variant="extra-small"
              color={colors.dark.bermudaGrey}
            />
          </View>
        </View>
        {total_product > 1 && (
          <Text
            label={`+${total_product - 1} ${t('order:otherProducts')}`}
            variant="small"
            color={colors.dark.bermudaGrey}
          />
        )}
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <View style={{ gap: 4 }}>
            <Text label={t('order:totalPayment')} variant="extra-small" color={colors.dark.gumbo} />
            <Text
              label={currencyFormatter(total_payment)}
              variant="small"
              fontWeight="semi-bold"
              color={colors.dark.blackCoral}
            />
          </View>
        </View>
      </View>
    </CardContainer>
  );
};
