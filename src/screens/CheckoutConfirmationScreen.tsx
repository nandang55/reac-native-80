/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable camelcase */
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from 'components/Button';
import { LayoutScreen } from 'components/layouts';
import { ModalAlert } from 'components/Modal';
import { PaymentSummarySection } from 'components/Section';
import { Spacer } from 'components/Spacer';
import { Text } from 'components/Text';
import { LoadingContext } from 'contexts/AppLoadingContext';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import { PickAddressContext } from 'contexts/AppPickAddressContext';
import { usePaypal } from 'hooks/paypal/usePaypal';
import useGetOrderDetail from 'hooks/useGetOrderDetail';
import { usePostCheckout } from 'hooks/usePostCheckout';
import { CartInterface } from 'interfaces/CartInterface';
import {
  CheckoutPayloadInterface,
  CheckoutResponse,
  PaymentType
} from 'interfaces/CheckoutInterface';
import { CheckoutStackParamList } from 'navigators/CheckoutStackNavigator';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, FlatList, Image, View } from 'react-native';
import Config from 'react-native-config';
import styled from 'styled-components/native';
import colors from 'styles/colors';
import { currencyFormatter } from 'utils/currencyFormatter';

const { width } = Dimensions.get('window');

interface ErrorModal {
  open: boolean;
  title: string;
  description: string;
  onCancel: () => void;
}

const initialErrorModal: ErrorModal = {
  open: false,
  title: '',
  description: '',
  onCancel: () => undefined
};

const initialCheckoutResponse: CheckoutResponse = {
  id: '',
  order_payment_id: '',
  paypal_access_token: '',
  paypal_url: ''
};

const CheckoutConfirmationContainer = styled(View)`
  flex: 1;
  gap: 8px;
`;

const Card = styled(View)`
  background-color: ${colors.light.whiteSolid};
  gap: 12px;
  padding: 16px;
`;

const Border = styled(View)<{ color?: string }>`
  border: 0.8px solid ${(props) => props.color || colors.dark.silver};
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

type CheckoutConfirmationScreenRouteProps = RouteProp<
  CheckoutStackParamList,
  'CheckoutConfirmation'
>;
type CheckoutConfirmationScreenNavigationProps = StackNavigationProp<RootStackParamList>;

const CheckoutConfirmationScreen = () => {
  const navigation = useNavigation<CheckoutConfirmationScreenNavigationProps>();
  const { params } = useRoute<CheckoutConfirmationScreenRouteProps>();

  const { cart, deliveryMethod, paymentOption, discount, promoCode, voucher, freeOngkir } = params;

  const { payWithPaypal, isLoading: paypalLoading } = usePaypal();

  const queryClient = useQueryClient();

  const { t } = useTranslation('checkout');

  const { address: deliveryTo } = useContext(PickAddressContext);
  const { setIsShowToast, setToastMessage, setType, setIsUnableProcess } =
    useContext(ModalToastContext);
  const { setLoading } = useContext(LoadingContext);

  const [showErrorModal, setShowErrorModal] = useState<ErrorModal>(initialErrorModal);
  const [checkoutResponse, setCheckoutResponse] =
    useState<CheckoutResponse>(initialCheckoutResponse);

  const totalQuantity = cart.reduce((total, obj) => total + obj.quantity, 0);
  const totalPrice =
    params?.cart.reduce((total, obj) => total + obj.selling_price * obj.quantity, 0) || 0;

  const deliveryCost = freeOngkir ? 0 : deliveryMethod.cost;
  const insuranceCost = deliveryMethod.insurance || 0;
  const discountPrice = (discount || 0) + (voucher || 0);

  const totalPayment = totalPrice + deliveryCost + insuranceCost - discountPrice;

  const labelAddress =
    Config.APP_REGION === 'sg'
      ? `${deliveryTo.address}${
          deliveryTo.floor_or_unit ? ' ' + deliveryTo.floor_or_unit : ''
        }, Singapore ${deliveryTo.postal_code}`
      : `${deliveryTo.address}, Kec. ${deliveryTo.area_name}, ${deliveryTo.city_name}, ${deliveryTo.province_name} ${deliveryTo.postal_code}`;

  const { data: orderDetail, isInitialLoading: isLoadingOrderDetail } = useGetOrderDetail({
    id: checkoutResponse.id,
    options: { enabled: !!checkoutResponse.id }
  });

  const { mutate: checkout, isLoading: isLoadingCheckout } = usePostCheckout({
    // eslint-disable-next-line sonarjs/cognitive-complexity
    onSuccess: async (res) => {
      if (res.error) {
        if (!res.errorType) {
          setIsShowToast(true);
          setType('error');
          setToastMessage(res.message);
        } else {
          setShowErrorModal({
            open: true,
            title: res.errorType === 'UNABLE_TO_PROCESS' ? 'Unable to Process' : res.title || '',
            description: res.message,
            onCancel: () => {
              res.errorType === 1
                ? navigation.replace('MainBottomTabNavigator', { screen: 'Order' })
                : res.errorType === 'UNABLE_TO_PROCESS'
                  ? (navigation.pop(), setIsUnableProcess(true))
                  : navigation.replace('CartStack', { screen: 'Cart' });
            }
          });
        }
      } else {
        setCheckoutResponse(res.data);
      }
    }
  });

  const handleOrder = () => {
    const checkoutItems =
      cart.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        selling_price: item.selling_price
      })) || [];

    const payload: CheckoutPayloadInterface = {
      shipping_address_id: deliveryTo.id || '',
      shipping_cost: deliveryMethod.cost,
      shipping_insurance: deliveryMethod.insurance,
      shipping_method: deliveryMethod.name,
      va_bank_code: '',
      // Rollback code below after successfully show success and failed order
      // payment_type: paymentOption.payment_type === 'PAYPAL' ? 'PAYPAL' : 'VA',
      payment_type: paymentOption.payment_type as PaymentType,
      discount_code: params.promoCode || null,
      cart: checkoutItems,
      voucher_amount: voucher || 0,
      voucher_shipping_amount: freeOngkir ? 15 : 0
    };

    checkout(payload);
  };

  useEffect(() => {
    const pay = async () => {
      try {
        const { id, order_payment_id, paypal_access_token, paypal_url } = checkoutResponse;

        if (orderDetail) {
          const {
            total_price,
            total_payment,
            shipping_cost,
            shipping_insurance,
            discount_amount,
            voucher_amount,
            voucher_shipping_amount
          } = orderDetail?.data || {};

          const items =
            cart.map((item) => ({
              name: item.product_name,
              quantity: item.quantity,
              unit_amount: { currency_code: 'SGD', value: item.selling_price },
              category: 'PHYSICAL_GOODS',
              image_url: item.main_image_link
            })) || [];

          await payWithPaypal({
            id,
            order_payment_id,
            paypal_access_token,
            paypal_url,
            items,
            amount: total_payment,
            insurance: shipping_insurance,
            item_total_amount: total_price,
            shipping_cost: shipping_cost,
            discount: discount_amount + voucher_amount || 0,
            shipping_discount: voucher_shipping_amount || 0
          });
        }
      } catch (error) {
        queryClient.invalidateQueries(['useGetCartList']);
        queryClient.invalidateQueries(['useGetCountCart']);
        queryClient.invalidateQueries(['useGetOrderList']);
      }
    };

    pay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderDetail]);

  useEffect(
    () => setLoading(isLoadingCheckout || isLoadingOrderDetail || paypalLoading),
    [isLoadingCheckout, isLoadingOrderDetail, paypalLoading, setLoading]
  );

  return (
    <>
      <LayoutScreen isNoPadding isScrollable scrollViewContentStyle={{ paddingBottom: 90 }}>
        <CheckoutConfirmationContainer>
          <Card>
            <Text
              label={t('products')}
              variant="small"
              fontWeight="semi-bold"
              color={colors.dark.blackCoral}
            />
            <FlatList
              data={cart}
              renderItem={renderProductItem}
              keyExtractor={({ id }) => id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <Spacer h={12} />}
            />
          </Card>
          <Card>
            <Text
              label={t('deliveryInfo')}
              variant="small"
              fontWeight="semi-bold"
              color={colors.dark.blackCoral}
            />
            <Border color={colors.dark.solitude} />
            <View style={{ display: 'flex', gap: 16 }}>
              <View style={{ display: 'flex', gap: 8 }}>
                <Text label={t('address')} variant="small" color={colors.dark.gumbo} />
                <View>
                  <View style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
                    <Text
                      label={deliveryTo.receipt_name}
                      variant="small"
                      color={colors.dark.blackCoral}
                      fontWeight="bold"
                    />
                    <Text label={'|'} variant="small" color={colors.dark.gumbo} />
                    <Text
                      label={deliveryTo.receipt_phone}
                      variant="small"
                      color={colors.dark.gumbo}
                    />
                  </View>
                  <Text
                    label={labelAddress}
                    variant="small"
                    color={colors.dark.gumbo}
                    style={{ width: '90%' }}
                  />
                </View>
              </View>
              <View style={{ display: 'flex', gap: 8 }}>
                <Text label={t('deliveryMethod')} variant="small" color={colors.dark.gumbo} />
                <Text
                  label={deliveryMethod.name}
                  variant="small"
                  color={colors.dark.blackCoral}
                  fontWeight="bold"
                />
              </View>
            </View>
          </Card>
          <PaymentSummarySection
            cost={deliveryMethod.cost}
            insurance={deliveryMethod.insurance}
            promoCode={promoCode}
            discount={discount}
            totalPayment={totalPayment}
            totalPrice={totalPrice}
            totalQuantity={totalQuantity}
            paymentInformation={paymentOption}
            voucher={voucher || 0}
            free_ongkir={freeOngkir}
          />
        </CheckoutConfirmationContainer>
      </LayoutScreen>
      <FooterContainer>
        <Border />
        <FooterButton>
          <View style={{ flex: 1 }}>
            <Button
              label={t('order')}
              onPress={handleOrder}
              variant="background"
              color={colors.secondary}
              borderRadius="28px"
            />
          </View>
        </FooterButton>
      </FooterContainer>

      <ModalAlert
        isVisible={showErrorModal.open}
        title={showErrorModal.title}
        description={showErrorModal.description}
        onCloseModal={showErrorModal.onCancel}
      />
    </>
  );
};

export default CheckoutConfirmationScreen;

const renderProductItem = ({ item }: { item: CartInterface }) => {
  return <ProductList {...item} />;
};

const ProductList = ({
  main_image_link,
  product_name,
  quantity,
  selling_price,
  variant_name
}: CartInterface) => (
  <View style={{ flexDirection: 'row', gap: 12 }}>
    <Image
      source={{ uri: main_image_link }}
      style={{ aspectRatio: 1, width: 90, borderRadius: 18 }}
    />
    <View style={{ gap: 8 }}>
      <View style={{ paddingRight: 90 }}>
        <Text label={product_name} variant="small" color={colors.dark.blackCoral} />
      </View>
      <Text label={variant_name} variant="extra-small" color={colors.dark.bermudaGrey} />
      <Text
        label={`${quantity} x ${currencyFormatter(selling_price)}`}
        variant="small"
        fontWeight="semi-bold"
        color={colors.dark.blackCoral}
      />
    </View>
  </View>
);
