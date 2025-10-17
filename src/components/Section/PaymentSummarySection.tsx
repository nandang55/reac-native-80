// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import { Text, TextRow } from 'components/Text';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import styled from 'styled-components';
import colors from 'styles/colors';
import { currencyFormatter } from 'utils/currencyFormatter';

import { PaymentSummarySectionInterface } from './PaymentSummarySection.type';

export const PaymentSummarySection = ({
  cost,
  insurance,
  totalPayment,
  totalPrice,
  totalQuantity,
  promoCode,
  discount,
  paymentInformation,
  free_ongkir,
  voucher
}: PaymentSummarySectionInterface) => {
  const { t } = useTranslation('checkout');
  return (
    <Card>
      <Text
        label={t('paymentSummary')}
        variant="small"
        fontWeight="semi-bold"
        color={colors.dark.blackCoral}
      />
      {paymentInformation && (
        <>
          <Border />
          <PaymentInfoStyled>
            <Text label={paymentInformation?.name} variant="small" color={colors.dark.blackCoral} />
            <Image source={{ uri: paymentInformation?.logo }} style={{ width: 35, height: 16 }} />
          </PaymentInfoStyled>
        </>
      )}

      <View style={{ display: 'flex', gap: 8 }}>
        <TextRow
          label={t('quantity')}
          value={`${totalQuantity} ${totalQuantity > 1 ? t('items') : t('item')}`}
          labelProps={{ variant: 'small', color: colors.dark.gumbo }}
          valueProps={{ variant: 'small', color: colors.dark.blackCoral }}
        />
        <TextRow
          label={t('price')}
          value={currencyFormatter(totalPrice)}
          labelProps={{ variant: 'small', color: colors.dark.gumbo }}
          valueProps={{ variant: 'small', color: colors.dark.blackCoral }}
        />
        {voucher ? (
          <TextRow
            label={'Voucher'}
            value={`-${currencyFormatter(voucher)}`}
            labelProps={{ variant: 'small', color: colors.dark.gumbo }}
            valueProps={{ variant: 'small', color: colors.green.pantoneGreen }}
          />
        ) : null}
        {cost ? (
          <TextRow
            label={t('deliveryFee')}
            value={currencyFormatter(cost)}
            labelProps={{ variant: 'small', color: colors.dark.gumbo }}
            valueProps={{ variant: 'small', color: colors.dark.blackCoral }}
          />
        ) : null}
        {free_ongkir && cost ? (
          <TextRow
            label={'Voucher Delivery Fee'}
            value={`-${currencyFormatter(cost)}`}
            labelProps={{ variant: 'small', color: colors.dark.gumbo }}
            valueProps={{ variant: 'small', color: colors.green.pantoneGreen }}
          />
        ) : null}
        {insurance ? (
          <TextRow
            label={t('deliveryInsurance')}
            value={currencyFormatter(insurance)}
            labelProps={{ variant: 'small', color: colors.dark.gumbo }}
            valueProps={{ variant: 'small', color: colors.dark.blackCoral }}
          />
        ) : null}
        {discount ? (
          <TextRow
            label={'Discount' + (promoCode ? ` (${promoCode})` : '')}
            value={`-${currencyFormatter(discount)}`}
            labelProps={{ variant: 'small', color: colors.dark.gumbo }}
            valueProps={{ variant: 'small', color: colors.green.pantoneGreen }}
          />
        ) : null}
      </View>
      <Border />
      <TextRow
        label={t('totalPayment')}
        value={currencyFormatter(totalPayment)}
        labelProps={{ variant: 'small', color: colors.dark.gumbo, fontWeight: 'semi-bold' }}
        valueProps={{
          variant: 'medium',
          color: colors.dark.blackCoral,
          fontWeight: 'semi-bold'
        }}
      />
    </Card>
  );
};

const Card = styled(View)`
  background-color: ${colors.light.whiteSolid};
  gap: 12px;
  padding: 16px;
`;

const Border = styled(View)<{ color?: string }>`
  border: 0.8px solid ${(props) => props.color || colors.dark.silver};
`;

const PaymentInfoStyled = styled(View)`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
