/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable camelcase */
import Clipboard from '@react-native-clipboard/clipboard';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from 'components/Button';
import { Countdown } from 'components/Countdown';
import { Icon } from 'components/Icon';
import { LayoutScreen } from 'components/layouts';
import { HowToMakePaymentSection } from 'components/Section';
import { Text } from 'components/Text';
import { LoadingContext } from 'contexts/AppLoadingContext';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import useGetRetryPaypal from 'hooks/paypal/useGetRetryPaypal';
import { usePaypal } from 'hooks/paypal/usePaypal';
import useGetOrderDetail from 'hooks/useGetOrderDetail';
import { CheckoutStackParamList } from 'navigators/CheckoutStackNavigator';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Image, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';
import { currencyFormatter } from 'utils/currencyFormatter';
import { formatDate } from 'utils/formatDate';

type HowToPayScreenNavigationProps = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const HowToPayContainer = styled(View)`
  flex: 1;
  gap: 8px;
  margin-bottom: 8px;
`;

const Heading = styled(View)`
  align-items: center;
  background-color: ${colors.light.whiteSolid};
  flex-direction: row;
  justify-content: space-between;
  padding: 16px;
`;

const PaymentInfo = styled(View)`
  background-color: ${colors.light.whiteSolid};
  gap: 16px;
  padding: 16px;
`;

const FooterContainer = styled(View)`
  background-color: ${colors.light.whiteSolid};
  bottom: 0;
  display: flex;
  position: absolute;
  width: ${width};
`;

const FooterButton = styled(View)`
  flex: 1;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
  padding: 16px;
`;

const Border = styled(View)`
  border: 1px solid ${colors.dark.solitude};
`;

type HowToPayScreenRouteProps = RouteProp<CheckoutStackParamList, 'HowToPay'>;

const HowToPayScreen = () => {
  const navigation = useNavigation<HowToPayScreenNavigationProps>();
  const route = useRoute<HowToPayScreenRouteProps>();
  const { t } = useTranslation(['bankInstruction', 'howToPay']);
  const { setIsShowToast, setToastMessage, setType } = useContext(ModalToastContext);
  const { setLoading } = useContext(LoadingContext);

  const { payWithPaypal, isLoading: paypalLoading } = usePaypal();

  const { data: orderDetail, isLoading: isLoadingOrderDetail } = useGetOrderDetail({
    id: route.params.id,
    options: { enabled: !!route.params.id }
  });

  const {
    data,
    isInitialLoading: isGetRetryPaypalLoading,
    refetch
  } = useGetRetryPaypal({
    id: route.params.id,
    options: { enabled: false, cacheTime: 0 }
  });

  const {
    payment_due,
    payment_info,
    total_price,
    total_payment,
    shipping_cost,
    shipping_insurance,
    order_items,
    discount_amount,
    voucher_amount,
    voucher_shipping_amount
  } = orderDetail?.data || {};

  const copyToClipboard = (text: string, message: string) => {
    Clipboard.setString(text);
    setIsShowToast(true);
    setToastMessage(message);
    setType('success');
  };

  useEffect(() => {
    const createOrder = async () => {
      if (data) {
        try {
          const { data: retryData } = data;

          const items =
            order_items?.map((item) => ({
              name: item.product_name,
              quantity: item.quantity,
              unit_amount: { currency_code: 'SGD', value: item.selling_price },
              category: 'PHYSICAL_GOODS',
              image_url: item?.product_image_link
            })) || [];

          await payWithPaypal({
            id: retryData.id,
            order_payment_id: retryData.order_payment_id,
            paypal_access_token: retryData.paypal_access_token,
            paypal_url: retryData.paypal_url,
            items,
            amount: total_payment || 0,
            insurance: shipping_insurance || 0,
            item_total_amount: total_price || 0,
            shipping_cost: shipping_cost || 0,
            discount: (discount_amount || 0) + (voucher_amount || 0),
            shipping_discount: voucher_shipping_amount || 0
          });
        } catch (error) {
          //
        }
      }
    };

    createOrder();
  }, [data]);

  const currentTime = new Date();
  const paymentDue: Date = payment_due ? new Date(payment_due as string) : currentTime;

  const remainingMilliseconds = paymentDue.getTime() - currentTime.getTime();
  const remainingSeconds = Math.floor(remainingMilliseconds / 1000);

  const isPaypal = payment_info?.payment_type.includes('PAYPAL');

  useEffect(
    () => setLoading(isLoadingOrderDetail || isGetRetryPaypalLoading || paypalLoading),
    [isLoadingOrderDetail, isGetRetryPaypalLoading, paypalLoading, setLoading]
  );
  return (
    <>
      <LayoutScreen isNoPadding isScrollable scrollViewContentStyle={{ paddingBottom: 80 }}>
        <HowToPayContainer>
          <Heading>
            <View style={{ gap: 6 }}>
              <Text label={t('howToPay:paymentDue')} variant="small" color={colors.dark.gumbo} />
              <Text
                label={
                  payment_due &&
                  formatDate(payment_due, 'MMM dd, yyyy, HH.mm', {
                    locale: 'en'
                  })
                }
                variant="small"
                fontWeight="semi-bold"
                color={colors.dark.blackCoral}
              />
            </View>
            <View
              style={{
                backgroundColor: colors.secondary + '40',
                padding: 7,
                borderRadius: 100,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4
              }}
            >
              <Icon name="time" size="16" color={colors.secondary} />
              {remainingSeconds ? (
                <Countdown
                  initialSeconds={remainingSeconds}
                  color={colors.secondary}
                  fontWeight="semi-bold"
                />
              ) : null}
            </View>
          </Heading>
          <PaymentInfo>
            <View style={{ gap: 12 }}>
              <Text
                label={t('howToPay:paymentInfo')}
                variant="small"
                fontWeight="semi-bold"
                color={colors.dark.blackCoral}
              />
              <Border />
            </View>
            <View style={{ gap: 12 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                {isPaypal ? (
                  <>
                    <Text
                      label={payment_info?.payment_name}
                      variant="small"
                      fontWeight="semi-bold"
                      color={colors.dark.blackCoral}
                    />
                    {payment_info?.payment_logo && (
                      <Image
                        source={{ uri: payment_info?.payment_logo }}
                        style={{ height: 21, width: 48 }}
                        resizeMode="contain"
                      />
                    )}
                  </>
                ) : (
                  <>
                    <Text
                      label={`${payment_info?.bank_name} ${payment_info?.payment_type}`}
                      variant="small"
                      fontWeight="semi-bold"
                      color={colors.dark.blackCoral}
                    />
                    {payment_info?.bank_logo && (
                      <Image
                        source={{ uri: payment_info?.bank_logo }}
                        style={{ height: 21, width: 48 }}
                        resizeMode="contain"
                      />
                    )}
                  </>
                )}
              </View>
              {!isPaypal && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end'
                  }}
                >
                  <View style={{ gap: 8 }}>
                    <Text label={t('howToPay:VA')} variant="small" color={colors.dark.gumbo} />
                    <Text
                      label={payment_info?.va_number}
                      variant="small"
                      fontWeight="semi-bold"
                      color={colors.dark.blackCoral}
                    />
                  </View>
                  {payment_info?.va_number && (
                    <TouchableOpacity
                      onPress={() =>
                        copyToClipboard(
                          payment_info?.va_number?.toString() || '',
                          t('howToPay:successCopyVirtualAccount')
                        )
                      }
                      style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}
                    >
                      <Text
                        label={t('howToPay:copy')}
                        variant="small"
                        color={colors.dark.blackCoral}
                      />
                      <Icon name="copy" size="10" color={colors.dark.bermudaGrey} />
                    </TouchableOpacity>
                  )}
                </View>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end'
                }}
              >
                <View style={{ gap: 8 }}>
                  <Text
                    label={t('howToPay:totalPayment')}
                    variant="small"
                    color={colors.dark.gumbo}
                  />
                  <Text
                    label={currencyFormatter(total_payment as number)}
                    variant="small"
                    fontWeight="semi-bold"
                    color={colors.dark.blackCoral}
                  />
                </View>
                <TouchableOpacity
                  onPress={() =>
                    copyToClipboard(
                      currencyFormatter(total_payment as number),
                      t('howToPay:successCopyTotalPayment')
                    )
                  }
                  style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}
                >
                  <Text label={t('howToPay:copy')} variant="small" color={colors.dark.blackCoral} />
                  <Icon name="copy" size="10" color={colors.dark.bermudaGrey} />
                </TouchableOpacity>
              </View>
            </View>
            <HowToMakePaymentSection
              bankCode={
                payment_info?.payment_type
                  ? payment_info?.payment_type
                  : payment_info?.bank_code || ''
              }
            />
          </PaymentInfo>
        </HowToPayContainer>
      </LayoutScreen>
      <FooterContainer>
        <Border />
        <FooterButton>
          <View style={{ flex: 1 }}>
            <Button
              label="Back to Order"
              onPress={() => navigation.navigate('MainBottomTabNavigator', { screen: 'Order' })}
              variant="plain"
              color={colors.secondary}
              borderRadius="28px"
              height={40}
            />
          </View>
          {isPaypal && (
            <View style={{ flex: 1 }}>
              <Button
                image="paypal"
                label="Pay With Paypal"
                onPress={refetch}
                variant="background"
                color={colors.secondary}
                borderRadius="28px"
                height={40}
              />
            </View>
          )}
        </FooterButton>
      </FooterContainer>
    </>
  );
};

export default HowToPayScreen;
