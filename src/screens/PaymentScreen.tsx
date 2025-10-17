/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable camelcase */
import Clipboard from '@react-native-clipboard/clipboard';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import PaymentConfirmation from 'assets/images/payment-confirmation.svg';
import { Button } from 'components/Button';
import { Countdown } from 'components/Countdown';
import { Icon } from 'components/Icon';
import { LayoutScreen } from 'components/layouts';
import { HowToMakePaymentSection } from 'components/Section';
import { Text } from 'components/Text';
import { LoadingContext } from 'contexts/AppLoadingContext';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import useGetOrderDetail from 'hooks/useGetOrderDetail';
import { CheckoutStackParamList } from 'navigators/CheckoutStackNavigator';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Image, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import colors from 'styles/colors';
import { currencyFormatter } from 'utils/currencyFormatter';
import { formatDate } from 'utils/formatDate';

const { width } = Dimensions.get('window');

const PaymentContainer = styled(View)`
  background-color: ${colors.light.whiteSolid};
  display: flex;
  flex: 1;
  padding: 16px;
`;

const Heading = styled(View)`
  padding-top: 32px;
`;

const PayBeforeContainer = styled(View)`
  border: 1px solid ${colors.dark.solitude};
  border-radius: 8px;
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding: 16px;
  width: 100%;
`;

const PayBeforeHeading = styled(View)`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const CountdownBadge = styled(View)`
  align-items: center;
  background-color: ${colors.yellow.goldenrodYellow};
  border-radius: 32px;
  display: flex;
  flex-direction: row;
  gap: 3px;
  padding: 6px;
`;

const Border = styled(View)`
  border: 0.8px solid ${colors.dark.bermudaGrey};
`;

const Row = styled(View)`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const FooterContainer = styled(View)`
  background-color: ${colors.light.whiteSolid};
  bottom: 0;
  display: flex;
  position: absolute;
  width: ${width};
`;

const FooterButton = styled(View)`
  flex-direction: row;
  justify-content: space-around;
  padding: 18px 16px;
`;

const BorderSilver = styled(View)`
  border: 0.8px solid ${colors.dark.silver};
`;

type PaymentScreenRouteProps = RouteProp<CheckoutStackParamList, 'Payment'>;
type PaymentScreenNavigationProps = StackNavigationProp<RootStackParamList>;

const PaymentScreen = () => {
  const navigation = useNavigation<PaymentScreenNavigationProps>();
  const { params } = useRoute<PaymentScreenRouteProps>();
  const { t } = useTranslation(['checkout', 'howToPay', 'common']);
  const { setIsShowToast, setToastMessage, setType } = useContext(ModalToastContext);
  const { setLoading } = useContext(LoadingContext);

  const { data: orderDetailData, isLoading: isLoadingOrderDetail } = useGetOrderDetail({
    id: params.id,
    options: { enabled: !!params.id }
  });

  const { payment_due, payment_info, total_payment } = orderDetailData?.data || {};

  const copyToClipboard = (text: string, message: string) => {
    Clipboard.setString(text);
    setIsShowToast(true);
    setToastMessage(message);
    setType('success');
  };

  const currentTime = new Date();
  const paymentDue: Date = payment_due ? new Date(payment_due as string) : currentTime;

  const remainingMilliseconds = paymentDue.getTime() - currentTime.getTime();
  const remainingSeconds = Math.floor(remainingMilliseconds / 1000);

  useEffect(() => setLoading(isLoadingOrderDetail), [isLoadingOrderDetail, setLoading]);

  return (
    <>
      <LayoutScreen isScrollable isNoPadding>
        <PaymentContainer>
          <PaymentConfirmation width="100%" />
          <Heading>
            <Text
              label={t('checkout:paymentTitle')}
              fontWeight="semi-bold"
              variant="extra-larger"
              color={colors.dark.blackCoral}
              textAlign="center"
            />
          </Heading>
          <PayBeforeContainer>
            <PayBeforeHeading>
              <View>
                <Text
                  label={t('checkout:payBefore')}
                  fontWeight="semi-bold"
                  variant="large"
                  color={colors.dark.blackCoral}
                />
                <Text
                  label={formatDate(payment_due as string, 'MMM dd, yyyy, HH.mm', {
                    locale: 'en'
                  })}
                  variant="small"
                  color={colors.dark.gumbo}
                />
              </View>
              <CountdownBadge>
                <Icon name="time" size="15.6" color={colors.yellow.sunset} />
                {remainingSeconds ? (
                  <Countdown initialSeconds={remainingSeconds} color={colors.yellow.sunset} />
                ) : null}
              </CountdownBadge>
            </PayBeforeHeading>
            <Border />
            <View style={{ display: 'flex', gap: 12 }}>
              <Row>
                <Text
                  label={payment_info?.bank_name}
                  fontWeight="semi-bold"
                  variant="small"
                  color={colors.dark.blackCoral}
                />
                <Image
                  source={{ uri: payment_info?.bank_logo }}
                  style={{ width: 35, height: 16 }}
                />
              </Row>
              <View style={{ display: 'flex', gap: 8 }}>
                <Text label={t('checkout:va')} variant="small" color={colors.dark.gumbo} />
                <Row>
                  <Text
                    label={payment_info?.va_number}
                    fontWeight="semi-bold"
                    variant="small"
                    color={colors.dark.blackCoral}
                  />
                  <TouchableOpacity
                    style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4 }}
                    onPress={() =>
                      copyToClipboard(
                        payment_info?.va_number?.toString() || '',
                        t('howToPay:successCopyVirtualAccount')
                      )
                    }
                  >
                    <Text
                      label={t('checkout:copy')}
                      variant="small"
                      color={colors.dark.blackCoral}
                    />
                    <Icon name="copy" size="12" color={colors.dark.bermudaGrey} />
                  </TouchableOpacity>
                </Row>
              </View>
              <View style={{ display: 'flex', gap: 8 }}>
                <Text
                  label={t('checkout:totalPayment')}
                  variant="small"
                  color={colors.dark.gumbo}
                />
                <Row>
                  <Text
                    label={currencyFormatter(total_payment as number)}
                    fontWeight="semi-bold"
                    variant="small"
                    color={colors.dark.blackCoral}
                  />
                  <TouchableOpacity
                    style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4 }}
                    onPress={() =>
                      copyToClipboard(
                        currencyFormatter(total_payment as number),
                        t('howToPay:successCopyTotalPayment')
                      )
                    }
                  >
                    <Text
                      label={t('checkout:copy')}
                      variant="small"
                      color={colors.dark.blackCoral}
                    />
                    <Icon name="copy" size="12" color={colors.dark.bermudaGrey} />
                  </TouchableOpacity>
                </Row>
              </View>
            </View>
          </PayBeforeContainer>
        </PaymentContainer>
        <HowToMakePaymentSection
          bankCode={payment_info?.bank_code || ''}
          style={{
            backgroundColor: colors.light.whiteSolid,
            padding: 16,
            marginTop: 8,
            marginBottom: 90
          }}
        />
      </LayoutScreen>
      <FooterContainer>
        <BorderSilver />
        <FooterButton>
          <View style={{ flex: 1 }}>
            <Button
              label={t('common:backToHome')}
              onPress={() => navigation.navigate('MainBottomTabNavigator', { screen: 'HomeStack' })}
              variant="background"
              color={colors.secondary}
              borderRadius="28px"
            />
          </View>
        </FooterButton>
      </FooterContainer>
    </>
  );
};

export default PaymentScreen;
