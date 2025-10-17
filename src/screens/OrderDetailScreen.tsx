/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable camelcase */
import Clipboard from '@react-native-clipboard/clipboard';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQueryClient } from '@tanstack/react-query';
import { OrderDetailAccordion } from 'components/Accordion';
import { BackButton } from 'components/BackButton';
import { Button } from 'components/Button';
import { Countdown } from 'components/Countdown';
import { Icon } from 'components/Icon';
import { LayoutScreen } from 'components/layouts';
import { ModalAlert } from 'components/Modal';
import { PaymentSummarySection } from 'components/Section';
import { Text, TextRow } from 'components/Text';
import { LoadingContext } from 'contexts/AppLoadingContext';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import useGetOrderDetail from 'hooks/useGetOrderDetail';
import { usePostCompleteOrder } from 'hooks/usePostCompleteOrder';
import { usePutCancelOrder } from 'hooks/usePutCancelOrder';
import { OrderStackParamList } from 'navigators/OrderStackNavigator';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, Dimensions, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';
import { formatDate } from 'utils/formatDate';
import { isDatePassed } from 'utils/isDatePassed';

type OrderDetailScreenNavigationProps = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const OrderDetailContainer = styled(View)`
  flex: 1;
  gap: 8px;
`;

const Heading = styled(View)`
  background-color: ${colors.light.whiteSolid};
  gap: 8px;
  padding: 16px;
`;

const Card = styled(View)`
  background-color: ${colors.light.whiteSolid};
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
  border: 1px solid ${colors.dark.silver};
`;

type OrderDetailScreenRouteProps = RouteProp<OrderStackParamList, 'OrderDetail'>;

interface ConfirmModal {
  isOpen: boolean;
  description: string;
  title: string;
  onPressYes: () => void;
  onCancel: () => void;
}

const initialConfirmModal = {
  isOpen: false,
  description: '',
  title: '',
  onPressYes: () => undefined,
  onCancel: () => undefined
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const OrderDetailScreen = () => {
  const route = useRoute<OrderDetailScreenRouteProps>();
  const navigation = useNavigation<OrderDetailScreenNavigationProps>();
  const queryClient = useQueryClient();
  const { t } = useTranslation(['order', 'orderDetail']);

  const { setIsShowToast, setToastMessage, setType } = useContext(ModalToastContext);
  const { setLoading } = useContext(LoadingContext);

  const [showConfirmModal, setShowConfirmModal] = useState<ConfirmModal>(initialConfirmModal);

  const {
    data: orderDetail,
    isLoading: isLoadingOrderDetail,
    isRefetching: isRefetchingOrderDetail,
    refetch: refetchOrderDetail
  } = useGetOrderDetail({
    id: route.params.id
  });

  const { mutate: cancelOrder, isLoading: loadingCancelOrder } = usePutCancelOrder({
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(['useGetOrderList']);
      handleBackButton();

      if (!data?.error) {
        setIsShowToast(true);
        setToastMessage(data.message);
        setType('success');
      } else {
        setIsShowToast(true);
        setToastMessage(data.message);
        setType('error');
      }
    }
  });

  const { mutate: completeOrder, isLoading: loadingCompleteOrder } = usePostCompleteOrder({
    onSuccess: async (data) => {
      if (!data?.error) {
        setIsShowToast(true);
        setToastMessage(data.message);
        setType('success');
      } else {
        setIsShowToast(true);
        setToastMessage(data.message);
        setType('error');
      }

      queryClient.invalidateQueries(['useGetOrderList']);
      queryClient.invalidateQueries(['useGetOrderDetail']);
    }
  });

  const copyToClipboard = (text: string, message: string) => {
    Clipboard.setString(text);
    setIsShowToast(true);
    setToastMessage(message);
    setType('success');
  };

  const handleBackButton = () => {
    if (route.params.source === 'webview') {
      navigation.replace('MainBottomTabNavigator', { screen: 'Order' });
    } else {
      navigation.pop();
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleBackButton();
      return true;
    });

    return () => backHandler.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton onPress={handleBackButton} tintColor="white" />
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const {
    status_name,
    status_color,
    payment_due,
    order_date,
    order_id,
    order_items,
    payment_info,
    total_price,
    shipping_cost,
    shipping_insurance,
    total_payment,
    shipping_method,
    receipt_name,
    receipt_phone,
    shipping_address,
    delivery_date,
    shipping_courier,
    receipt_number,
    completed_date,
    order_inquiries,
    discount_amount,
    discount_code,
    voucher_amount,
    voucher_shipping_amount
  } = orderDetail?.data || {};

  const total_items =
    order_items?.reduce((total, order_item) => total + order_item.quantity, 0) || 0;

  const currentTime = new Date();
  const paymentDue: Date = payment_due ? new Date(payment_due as string) : currentTime;

  const remainingMilliseconds = paymentDue.getTime() - currentTime.getTime();
  const remainingSeconds = Math.floor(remainingMilliseconds / 1000);

  const getStatusStyles = (status: string) => {
    let wordingDate, date;
    switch (status) {
      case 'IN PROGRESS':
      case 'EXPIRED ORDER':
        wordingDate = t('order:orderDate');
        date = formatDate(order_date as string, 'MMM dd, yyyy, HH.mm', {
          locale: 'en'
        });
        break;
      case 'PENDING PAYMENT':
        wordingDate = t('order:paymentDue');
        date = formatDate(payment_due as string, 'MMM dd, yyyy, HH.mm', {
          locale: 'en'
        });
        break;
      case 'IN DELIVERY':
        wordingDate = t('order:deliveryDate');
        date = formatDate(delivery_date as string, 'MMM dd, yyyy, HH.mm', {
          locale: 'en'
        });
        break;
      case 'COMPLETED':
        wordingDate = t('order:completeDate');
        date = formatDate(completed_date as string, 'MMM dd, yyyy, HH.mm', {
          locale: 'en'
        });
        break;
    }
    return {
      wordingDate,
      date
    };
  };

  const buttonOptions = {
    in_delivery: (
      <View style={{ flex: 1 }}>
        <Button
          label={t('orderDetail:completeOrder')}
          onPress={() =>
            setShowConfirmModal({
              title: t('orderDetail:completeComfirmationTitle'),
              description: t('orderDetail:completeComfirmationDescription'),
              isOpen: true,
              onPressYes: () => completeOrder({ id: route.params.id }),
              onCancel: () => setShowConfirmModal(initialConfirmModal)
            })
          }
          variant="background"
          color={colors.secondary}
          borderRadius="28px"
        />
      </View>
    ),
    pending_payment: (
      <>
        <View style={{ flex: 1 }}>
          <Button
            label={t('orderDetail:cancelOrder')}
            onPress={() =>
              setShowConfirmModal({
                title: t('orderDetail:cancelConfirmation'),
                description: t('orderDetail:cancelConfirmationDesc'),
                isOpen: true,
                onPressYes: () => {
                  cancelOrder({ id: route.params.id });
                },
                onCancel: () => setShowConfirmModal(initialConfirmModal)
              })
            }
            variant="secondary"
            borderRadius="28px"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            label={t('order:howToPay')}
            onPress={() =>
              navigation.navigate('CheckoutStack', {
                screen: 'HowToPay',
                params: { id: route.params.id }
              })
            }
            variant="background"
            color={colors.secondary}
            borderRadius="28px"
          />
        </View>
      </>
    ),
    completed: (
      <View style={{ flex: 1 }}>
        <Button
          label={t('orderDetail:submitInquiry')}
          onPress={() =>
            navigation.navigate('OrderStack', {
              screen: 'OrderInquiry',
              params: { id: route.params.id }
            })
          }
          variant="secondary"
          borderRadius="28px"
        />
      </View>
    )
  };

  const isCompletedDatePassed = isDatePassed(completed_date || '', 2);

  useEffect(
    () => setLoading(isLoadingOrderDetail || loadingCancelOrder || loadingCompleteOrder),
    [isLoadingOrderDetail, loadingCancelOrder, loadingCompleteOrder, setLoading]
  );

  return (
    <>
      <LayoutScreen
        isNoPadding
        isScrollable
        scrollViewContentStyle={{
          paddingBottom: isCompletedDatePassed || order_inquiries ? 0 : 100
        }}
        isRefreshing={isRefetchingOrderDetail}
        onRefresh={refetchOrderDetail}
      >
        <OrderDetailContainer>
          <Heading>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <View style={{ borderLeftWidth: 3, borderColor: status_color, paddingLeft: 4 }}>
                <Text
                  label={status_name}
                  variant="extra-small"
                  color={status_color}
                  fontWeight="semi-bold"
                />
              </View>
              {status_name === 'PENDING PAYMENT' ? (
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
              ) : null}
            </View>
            {(status_name === 'IN DELIVERY' || status_name === 'COMPLETED') && (
              <TextRow
                label={t('order:orderDate')}
                value={formatDate(order_date as string, 'MMM dd, yyyy, HH.mm', {
                  locale: 'en'
                })}
                labelProps={{ variant: 'small', color: colors.dark.bermudaGrey }}
                valueProps={{
                  variant: 'small',
                  fontWeight: 'semi-bold',
                  color: colors.dark.blackCoral
                }}
              />
            )}
            {status_name === 'COMPLETED' && (
              <TextRow
                label={t('order:deliveryDate')}
                value={formatDate(delivery_date as string, 'MMM dd, yyyy, HH.mm', {
                  locale: 'en'
                })}
                labelProps={{ variant: 'small', color: colors.dark.bermudaGrey }}
                valueProps={{
                  variant: 'small',
                  fontWeight: 'semi-bold',
                  color: colors.dark.blackCoral
                }}
              />
            )}
            <TextRow
              label={getStatusStyles(status_name as string).wordingDate as string}
              value={getStatusStyles(status_name as string).date as string}
              labelProps={{ variant: 'small', color: colors.dark.bermudaGrey }}
              valueProps={{
                variant: 'small',
                fontWeight: 'semi-bold',
                color: colors.dark.blackCoral
              }}
            />
            <TextRow
              label={t('orderDetail:orderId')}
              value={order_id as string}
              labelProps={{ variant: 'small', color: colors.dark.bermudaGrey }}
              valueProps={{ variant: 'small', color: colors.dark.blackCoral }}
            />
          </Heading>
          <Card>
            <Text
              label={t('orderDetail:products')}
              variant="small"
              fontWeight="semi-bold"
              color={colors.dark.blackCoral}
              style={{ marginBottom: 12 }}
            />
            <OrderDetailAccordion data={order_items || []} />
          </Card>
          <Card>
            <Text
              style={{
                borderBottomWidth: 1,
                borderBottomColor: colors.dark.solitude,
                paddingBottom: 12,
                marginBottom: 12
              }}
              label={t('orderDetail:deliveryInfo')}
              variant="small"
              fontWeight="semi-bold"
              color={colors.dark.blackCoral}
            />
            <View style={{ gap: 16 }}>
              <View>
                <Text label={t('orderDetail:address')} variant="small" color={colors.dark.gumbo} />
                <View style={{ flex: 1, marginTop: 8 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      marginBottom: 4,
                      gap: 4
                    }}
                  >
                    <Text
                      label={receipt_name}
                      variant="small"
                      fontWeight="semi-bold"
                      color={colors.dark.blackCoral}
                    />
                    <Text label="|" variant="extra-small" color={colors.dark.gumbo} />
                    <Text label={receipt_phone} variant="small" color={colors.dark.gumbo} />
                  </View>
                  <Text label={shipping_address} variant="small" color={colors.dark.gumbo} />
                </View>
              </View>
              <View style={{ gap: 8 }}>
                <Text
                  label={t('orderDetail:deliveryMethod')}
                  variant="small"
                  color={colors.dark.gumbo}
                />
                <Text
                  label={shipping_method}
                  variant="small"
                  fontWeight="semi-bold"
                  color={colors.dark.blackCoral}
                />
              </View>
              {(status_name === 'IN DELIVERY' || status_name === 'COMPLETED') && (
                <>
                  <View style={{ gap: 8 }}>
                    <Text
                      label={t('orderDetail:courier')}
                      variant="small"
                      color={colors.dark.gumbo}
                    />
                    <Text
                      label={shipping_courier}
                      variant="small"
                      fontWeight="semi-bold"
                      color={colors.dark.blackCoral}
                    />
                  </View>
                  <View style={{ gap: 8 }}>
                    <Text
                      label={t('orderDetail:receiptNumber')}
                      variant="small"
                      color={colors.dark.gumbo}
                    />
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text
                        label={receipt_number}
                        variant="small"
                        fontWeight="semi-bold"
                        color={colors.dark.blackCoral}
                      />
                      <TouchableOpacity
                        onPress={() =>
                          copyToClipboard(
                            receipt_number as string,
                            t('orderDetail:copyReceiptNumber')
                          )
                        }
                      >
                        <Icon name="copy" size="10" color={colors.dark.bermudaGrey} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
            </View>
          </Card>
          <PaymentSummarySection
            paymentInformation={{
              name: payment_info?.payment_name || '',
              logo: payment_info?.payment_logo || ''
            }}
            totalQuantity={total_items || 0}
            totalPrice={total_price || 0}
            cost={shipping_cost || 0}
            insurance={shipping_insurance || 0}
            totalPayment={total_payment || 0}
            discount={discount_amount}
            promoCode={discount_code}
            voucher={voucher_amount || 0}
            free_ongkir={(voucher_shipping_amount || 0) > 0}
          />
          {order_inquiries && (
            <Card>
              <Text
                label={t('orderDetail:orderInquiry')}
                variant="small"
                fontWeight="semi-bold"
                color={colors.dark.blackCoral}
                style={{ marginBottom: 12 }}
              />
              <Text
                label={t('orderDetail:orderInquiryDesc')}
                variant="small"
                color={colors.dark.gumbo}
              />
            </Card>
          )}
        </OrderDetailContainer>
      </LayoutScreen>
      {!isCompletedDatePassed && !order_inquiries && (
        <FooterContainer>
          <Border />
          <FooterButton>
            <ButtonStatus status={status_name} buttonOptions={buttonOptions} />
          </FooterButton>
        </FooterContainer>
      )}

      <ModalAlert
        title={showConfirmModal.title}
        description={showConfirmModal.description}
        isVisible={showConfirmModal.isOpen}
        onCloseModal={showConfirmModal.onCancel}
        onPressYes={showConfirmModal.onPressYes}
      />
    </>
  );
};

function ButtonStatus({
  status,
  buttonOptions
}: {
  status?: string;
  buttonOptions: Record<'pending_payment' | 'in_delivery' | 'completed', React.ReactNode>;
}) {
  const navigation = useNavigation<OrderDetailScreenNavigationProps>();
  const { t } = useTranslation('common');

  if (status === 'IN DELIVERY') {
    return buttonOptions.in_delivery;
  }

  if (status === 'PENDING PAYMENT') {
    return buttonOptions.pending_payment;
  }

  if (status === 'COMPLETED') {
    return buttonOptions.completed;
  }

  return (
    <View style={{ flex: 1 }}>
      <Button
        label={t('backToHome')}
        onPress={() => navigation.navigate('MainBottomTabNavigator', { screen: 'HomeStack' })}
        variant="background"
        color={colors.secondary}
        borderRadius="28px"
      />
    </View>
  );
}

export default OrderDetailScreen;
