import { Accordion } from 'components/Accordion';
import { AccordionProps } from 'components/Accordion/Accordion.type';
import { Text } from 'components/Text';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';
import styled from 'styled-components';
import colors from 'styles/colors';

import { HowToMakePaymentProps } from './HowToMakePaymentSection.type';

const StepContainer = styled(View)`
  border-color: ${colors.dark.solitude};
  border-radius: 5px;
  border-width: 1px;
  gap: 16px;
  padding: 0 8px 16px 8px;
`;

const Heading = styled(View)`
  border-bottom-width: 1px;
  border-color: ${colors.dark.bermudaGrey};
  padding: 12px;
`;

export const HowToMakePaymentSection = ({ bankCode, style }: HowToMakePaymentProps) => {
  const { t } = useTranslation(['bankInstruction', 'howToPay']);
  const [expand, setExpand] = useState<number | null>(0);

  const DATA_ACCORDION_MANDIRI = [
    {
      id: '0',
      label: t('bankInstruction:mandiriAtm'),
      childData: [
        { id: '1', label: t('bankInstruction:mandiriAtmDetail.1') },
        { id: '2', label: t('bankInstruction:mandiriAtmDetail.2') },
        { id: '3', label: t('bankInstruction:mandiriAtmDetail.3') },
        { id: '4', label: t('bankInstruction:mandiriAtmDetail.4') },
        { id: '5', label: t('bankInstruction:mandiriAtmDetail.5') },
        { id: '6', label: t('bankInstruction:mandiriAtmDetail.6') },
        { id: '7', label: t('bankInstruction:mandiriAtmDetail.7') },
        { id: '8', label: t('bankInstruction:mandiriAtmDetail.8') }
      ]
    },
    {
      id: '1',
      label: t('bankInstruction:mandiriInternetBanking'),
      childData: [
        { id: '1', label: t('bankInstruction:mandiriInternetBankingDetail.1') },
        { id: '2', label: t('bankInstruction:mandiriInternetBankingDetail.2') },
        { id: '3', label: t('bankInstruction:mandiriInternetBankingDetail.3') },
        { id: '4', label: t('bankInstruction:mandiriInternetBankingDetail.4') },
        { id: '5', label: t('bankInstruction:mandiriInternetBankingDetail.5') },
        { id: '6', label: t('bankInstruction:mandiriInternetBankingDetail.6') },
        { id: '7', label: t('bankInstruction:mandiriInternetBankingDetail.7') },
        { id: '8', label: t('bankInstruction:mandiriInternetBankingDetail.8') }
      ]
    }
  ];

  const DATA_ACCORDION_CIMB = [
    {
      id: '0',
      label: t('bankInstruction:cimbClicks'),
      childData: [
        { id: '1', label: t('bankInstruction:cimbClicksDetail.1') },
        { id: '2', label: t('bankInstruction:cimbClicksDetail.2') },
        { id: '3', label: t('bankInstruction:cimbClicksDetail.3') },
        { id: '4', label: t('bankInstruction:cimbClicksDetail.4') },
        { id: '5', label: t('bankInstruction:cimbClicksDetail.5') },
        { id: '6', label: t('bankInstruction:cimbClicksDetail.6') },
        { id: '7', label: t('bankInstruction:cimbClicksDetail.7') }
      ]
    },
    {
      id: '1',
      label: t('bankInstruction:atmBersama'),
      childData: [
        { id: '1', label: t('bankInstruction:atmBersamaDetail.1') },
        { id: '2', label: t('bankInstruction:atmBersamaDetail.2') },
        { id: '3', label: t('bankInstruction:atmBersamaDetail.3') },
        { id: '4', label: t('bankInstruction:atmBersamaDetail.4') },
        { id: '5', label: t('bankInstruction:atmBersamaDetail.5') },
        { id: '6', label: t('bankInstruction:atmBersamaDetail.6') },
        { id: '7', label: t('bankInstruction:atmBersamaDetail.7') }
      ]
    },
    {
      id: '2',
      label: t('bankInstruction:cimbAtm'),
      childData: [
        { id: '1', label: t('bankInstruction:cimbAtmDetail.1') },
        { id: '2', label: t('bankInstruction:cimbAtmDetail.2') },
        { id: '3', label: t('bankInstruction:cimbAtmDetail.3') },
        { id: '4', label: t('bankInstruction:cimbAtmDetail.4') },
        { id: '5', label: t('bankInstruction:cimbAtmDetail.5') },
        { id: '6', label: t('bankInstruction:cimbAtmDetail.6') },
        { id: '7', label: t('bankInstruction:cimbAtmDetail.7') }
      ]
    },
    {
      id: '3',
      label: t('bankInstruction:internetBankingOther'),
      childData: [
        { id: '1', label: t('bankInstruction:internetBankingOtherDetail.1') },
        { id: '2', label: t('bankInstruction:internetBankingOtherDetail.2') },
        { id: '3', label: t('bankInstruction:internetBankingOtherDetail.3') },
        { id: '4', label: t('bankInstruction:internetBankingOtherDetail.4') },
        { id: '5', label: t('bankInstruction:internetBankingOtherDetail.5') },
        { id: '6', label: t('bankInstruction:internetBankingOtherDetail.6') },
        { id: '7', label: t('bankInstruction:internetBankingOtherDetail.7') },
        { id: '8', label: t('bankInstruction:internetBankingOtherDetail.8') }
      ]
    },
    {
      id: '4',
      label: t('bankInstruction:goMobileCimb'),
      childData: [
        { id: '1', label: t('bankInstruction:goMobileCimbDetail.1') },
        { id: '2', label: t('bankInstruction:goMobileCimbDetail.2') },
        { id: '3', label: t('bankInstruction:goMobileCimbDetail.3') },
        { id: '4', label: t('bankInstruction:goMobileCimbDetail.4') },
        { id: '5', label: t('bankInstruction:goMobileCimbDetail.5') },
        { id: '6', label: t('bankInstruction:goMobileCimbDetail.6') },
        { id: '7', label: t('bankInstruction:goMobileCimbDetail.7') }
      ]
    }
  ];

  const DATA_ACCORDION_PAYPAL = [
    {
      id: '0',
      label: 'PayPal Payment',
      childData: [
        {
          id: '1',
          label:
            "Log in to Your PayPal account. Or if you don't have an account, you may have the option to create or proceed as a guest and pay with a credit or debit card."
        },
        {
          id: '2',
          label:
            'Review your order and payment summary. Make sure everything is correct before proceeding.'
        },
        {
          id: '3',
          label:
            'Select funding source linked to your PayPal account (e.g., bank account, credit/debit cards, choose the one you want to use for this transaction)'
        },
        { id: '4', label: 'Complete the payment after confirming the details.' },
        {
          id: '5',
          label: 'PayPal will process the transaction and send you back to SriCandy mobile app.'
        },
        {
          id: '6',
          label:
            'You should receive a confirmation message from both PayPal and the platform confirming that your order has been successfully placed and paid.'
        }
      ]
    }
  ];

  const renderItem = ({ item, index }: { item: AccordionProps; index: number }) => {
    return (
      <Accordion
        key={index}
        {...item}
        expanded={expand === index}
        onToggle={() => {
          setExpand(expand === index ? null : index);
        }}
      />
    );
  };

  return (
    <>
      {bankCode === 'CIMB' || bankCode === 'MANDIRI' ? (
        <View style={style}>
          <StepContainer>
            <Heading>
              <Text
                label={t('howToPay:howToMakeAPayment')}
                variant="small"
                fontWeight="semi-bold"
                color={colors.dark.blackCoral}
                textAlign="center"
              />
            </Heading>
            <FlatList
              data={bankCode === 'CIMB' ? DATA_ACCORDION_CIMB : DATA_ACCORDION_MANDIRI}
              renderItem={renderItem}
              contentContainerStyle={{ gap: 16, marginHorizontal: 12 }}
              keyExtractor={(_, index) => index.toString()}
              scrollEnabled={false}
            />
          </StepContainer>
        </View>
      ) : bankCode.includes('PAYPAL') ? (
        <View style={style}>
          <StepContainer>
            <Heading>
              <Text
                label={t('howToPay:howToMakeAPayment')}
                variant="small"
                fontWeight="semi-bold"
                color={colors.dark.blackCoral}
                textAlign="center"
              />
            </Heading>
            <FlatList
              data={DATA_ACCORDION_PAYPAL}
              renderItem={renderItem}
              contentContainerStyle={{ gap: 16, marginHorizontal: 12 }}
              keyExtractor={(_, index) => index.toString()}
              scrollEnabled={false}
            />
          </StepContainer>
        </View>
      ) : null}
    </>
  );
};
