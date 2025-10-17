/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable camelcase */
import type BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomDrawerContainer } from 'components/BottomDrawer';
import { Modalize } from 'components/BottomSheet';
import { Button } from 'components/Button';
import { Icon } from 'components/Icon';
import { LayoutScreen } from 'components/layouts';
import { ModalAlert } from 'components/Modal';
import { PaymentSummarySection } from 'components/Section';
import { Skeleton } from 'components/Skeleton';
import { Text } from 'components/Text';
import { LoadingContext } from 'contexts/AppLoadingContext';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import { PickAddressContext } from 'contexts/AppPickAddressContext';
import useGetPaymentOptions from 'hooks/useGetPaymentOptions';
import useGetPrimaryShippingAddress from 'hooks/useGetPrimaryShippingAddress';
import useGetShippingMethodList from 'hooks/useGetShippingMethodList';
import { usePostValidatePromo } from 'hooks/usePostValidatePromo';
import {
  PaymentOptionInterface,
  PromoCodeInterface,
  ShippingMethodListInterface
} from 'interfaces/CheckoutInterface';
import { CheckoutStackParamList } from 'navigators/CheckoutStackNavigator';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Config from 'react-native-config';
import styled from 'styled-components/native';
import colors from 'styles/colors';
import { currencyFormatter } from 'utils/currencyFormatter';

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

const initialDeliveryMethodState = {
  id: '',
  name: '',
  estimate_delivery: '',
  cost: 0,
  insurance: 0
};

const initialPaymentOptionState = {
  id: '',
  name: '',
  payment_type: '',
  logo: ''
};

const initialValidatePromoResponseState = {
  discount_amount: 0,
  discount_code: ''
};

const { width } = Dimensions.get('window');

const OrderDetailContainer = styled(View)`
  flex: 1;
  gap: 8px;
`;

const Card = styled(View)`
  background-color: ${colors.light.whiteSolid};
  gap: 12px;
  padding: 16px;
`;

const StyledButtonText = styled(TouchableOpacity)`
  border: 1px solid ${colors.dark.blackCoral};
  border-radius: 8px;
  padding: 12px 16px;
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

const Border = styled(View)<{ color?: string }>`
  border: 0.8px solid ${(props) => props.color || colors.dark.silver};
`;

type CheckoutScreenNavigationProps = StackNavigationProp<RootStackParamList>;
type CheckoutScreenRouteProps = RouteProp<CheckoutStackParamList, 'Checkout'>;

// eslint-disable-next-line sonarjs/cognitive-complexity
const CheckoutScreen = () => {
  const navigation = useNavigation<CheckoutScreenNavigationProps>();
  const { params } = useRoute<CheckoutScreenRouteProps>();
  const { t } = useTranslation('checkout');

  const deliveryMethodRef = useRef<BottomSheet>(null);
  const paymentOptionsRef = useRef<BottomSheet>(null);
  const inputRef = useRef<TextInput>(null);

  const [deliveryMethodState, setDeliveryMethodState] = useState<ShippingMethodListInterface>(
    initialDeliveryMethodState
  );
  const [paymentOptionState, setPaymentOptionState] =
    useState<PaymentOptionInterface>(initialPaymentOptionState);
  const [promoCode, setPromoCode] = useState('');
  const [validatePromoResponse, setValidatePromoResponse] = useState<PromoCodeInterface>(
    initialValidatePromoResponseState
  );
  const [errorPromoResponse, setErrorPromoResponse] = useState<string | undefined>(undefined);
  const [isDeliveryMethodOpen, setIsDeliveryMethodOpen] = useState(false);
  const [isPaymentOptionOpen, setIsPaymentOptionOpen] = useState(false);
  const [isPromoCodeOpen, setIsPromoCodeOpen] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState<ErrorModal>(initialErrorModal);

  const { address: deliveryTo, setAddress } = useContext(PickAddressContext);
  const { setIsShowToast, setToastMessage, setType, isUnableProcess, setIsUnableProcess } =
    useContext(ModalToastContext);
  const { setLoading } = useContext(LoadingContext);

  const voucher_amount = params?.voucher.voucher_amount;
  const get_free_ongkir = params?.voucher.free_ongkir;
  const cart_ids = params?.cart.map((cart) => cart.id);
  const totalQuantity = params?.cart.reduce((total, obj) => total + obj.quantity, 0);
  const totalPrice =
    params?.cart.reduce((total, obj) => total + obj.selling_price * obj.quantity, 0) || 0;

  const deliveryCost = get_free_ongkir ? 0 : deliveryMethodState.cost;
  const insuranceCost = deliveryMethodState.insurance || 0;
  const discount = validatePromoResponse.discount_amount + voucher_amount;

  const totalPayment = totalPrice + deliveryCost + insuranceCost - discount;

  const allEmpty =
    deliveryTo.id === '' || deliveryMethodState.id === '' || paymentOptionState.name === '';

  const { isLoading: isLoadingPrimaryAddress } = useGetPrimaryShippingAddress({
    options: {
      onSuccess: (res) => {
        if (res.data) {
          setAddress(res.data);
        }
      }
    }
  });

  const { data: shippingMethodListData, isLoading: isLoadingShippingMethodListData } =
    useGetShippingMethodList({
      id: deliveryTo.id || '',
      options: {
        enabled: !!deliveryTo.id && isDeliveryMethodOpen,
        select: (res) => ({
          ...res,
          data: res.data.map((data, index) => ({ ...data, id: `shipping-method-${index + 1}` }))
        })
      }
    });

  const { data: paymentOptionData, isLoading: isLoadingPaymentOptionData } = useGetPaymentOptions(
    {}
  );

  const { mutate: validatePromo, isLoading: isLoadingValidatePromo } = usePostValidatePromo({
    onSuccess: (data) => {
      setValidatePromoResponse(data.data);
    },
    onError: (err) => {
      const error = err.response?.data?.data?.discount_code;
      setErrorPromoResponse(error);
      setIsPromoCodeOpen(true);
    },
    onSettled: (response) => {
      if (response && !response?.error) {
        setIsPromoCodeOpen(false);
        setTimeout(() => {
          setIsShowToast(true);
          setToastMessage(response?.message ?? '');
          setType('success');
        }, 600);
      }
    }
  });

  useEffect(() => {
    setDeliveryMethodState(initialDeliveryMethodState);
  }, [deliveryTo]);

  useEffect(() => {
    const findPaypal = paymentOptionData?.data.find((data) => data.payment_type === 'PAYPAL');
    setPaymentOptionState({
      logo: findPaypal?.logo || '',
      name: findPaypal?.name || '',
      payment_type: findPaypal?.payment_type || ''
    });
  }, [paymentOptionData]);

  const handleOpenModalPromoCode = () => {
    setIsPromoCodeOpen(!isPromoCodeOpen);
    setIsShowToast(false);
    setTimeout(
      () => {
        inputRef.current?.focus();
      },
      Platform.OS === 'ios' ? 300 : 500
    );
  };

  const handleHideModalPromoCode = () => {
    setIsPromoCodeOpen(!isPromoCodeOpen);
    setErrorPromoResponse('');
    setPromoCode('');
    setValidatePromoResponse(initialValidatePromoResponseState);
  };

  useFocusEffect(
    useCallback(() => {
      if (!validatePromo || isUnableProcess) {
        setValidatePromoResponse(initialValidatePromoResponseState);
        setPromoCode('');
      }
      setTimeout(() => {
        setIsUnableProcess(false);
      }, 1000);
    }, [isUnableProcess])
  );

  const handleNoAddress = () => {
    setShowErrorModal({
      title: t('unableProcessTitle'),
      description: t('unableProcessDescription'),
      open: true,
      onCancel: () => setShowErrorModal(initialErrorModal)
    });
  };

  const handleContinue = () => {
    navigation.navigate('CheckoutStack', {
      screen: 'CheckoutConfirmation',
      params: {
        cart: params?.cart,
        deliveryMethod: deliveryMethodState,
        paymentOption: paymentOptionState,
        promoCode: validatePromoResponse.discount_code,
        discount: validatePromoResponse.discount_amount,
        voucher: voucher_amount,
        freeOngkir: get_free_ongkir
      }
    });
  };

  const DeliveryMethodList = ({
    id,
    cost,
    estimate_delivery,
    insurance,
    name
  }: ShippingMethodListInterface) => (
    <TouchableOpacity
      style={{ display: 'flex', gap: 4, padding: 16 }}
      onPress={() => {
        setDeliveryMethodState({ id, cost, estimate_delivery, insurance, name });
        deliveryMethodRef.current?.close();
      }}
    >
      <Text
        label={`${name} (${currencyFormatter(cost)})`}
        variant="small"
        color={colors.dark.blackCoral}
        fontWeight="semi-bold"
      />
      <Text label={estimate_delivery} variant="extra-small" color={colors.dark.blackCoral} />
    </TouchableOpacity>
  );

  const PaymentOptionList = ({ payment_type, logo, name }: PaymentOptionInterface) => (
    <TouchableOpacity
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        paddingVertical: 16,
        marginHorizontal: 16,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.light.whiteSmoke
      }}
      onPress={() => {
        setPaymentOptionState({ payment_type, logo, name });
        paymentOptionsRef.current?.close();
      }}
    >
      <Image source={{ uri: logo }} style={{ width: 35, height: 16 }} />
      <Text label={name} variant="small" color={colors.dark.blackCoral} />
    </TouchableOpacity>
  );

  const renderDeliveryMethodItem = ({ item }: { item: ShippingMethodListInterface }) => {
    return <DeliveryMethodList {...item} />;
  };

  const renderPaymentOptionItem = ({ item }: { item: PaymentOptionInterface }) => {
    return <PaymentOptionList {...item} />;
  };

  const labelAddress =
    Config.APP_REGION === 'sg'
      ? `${deliveryTo.address}${
          deliveryTo.floor_or_unit ? ' ' + deliveryTo.floor_or_unit : ''
        }, Singapore ${deliveryTo.postal_code}`
      : `${deliveryTo.address}, Kec. ${deliveryTo.area_name}, ${deliveryTo.city_name}, ${deliveryTo.province_name} ${deliveryTo.postal_code}`;

  useEffect(() => setLoading(isLoadingPrimaryAddress), [isLoadingPrimaryAddress, setLoading]);

  return (
    <>
      <LayoutScreen isNoPadding isScrollable scrollViewContentStyle={{ paddingBottom: 90 }}>
        <OrderDetailContainer>
          <Card>
            <Text
              label={t('deliveryAddress')}
              variant="small"
              fontWeight="semi-bold"
              color={colors.dark.blackCoral}
            />
            {deliveryTo.id ? (
              <StyledButtonText
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8
                }}
                onPress={() =>
                  navigation.navigate('CheckoutStack', {
                    screen: 'CheckoutPickAddress'
                  })
                }
              >
                <View style={{ display: 'flex', gap: 4, flex: 1 }}>
                  <Text
                    label={deliveryTo.label}
                    variant="small"
                    color={colors.dark.blackCoral}
                    fontWeight="bold"
                  />
                  <View style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
                    <Text
                      label={deliveryTo.receipt_name}
                      variant="small"
                      color={colors.dark.gumbo}
                    />
                    <Text label="|" variant="small" color={colors.dark.gumbo} />
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
                    ellipsizeMode="tail"
                    numberOfLines={1}
                  />
                </View>
                <Icon
                  name="chevronRight"
                  color={colors.light.whiteSolid}
                  stroke={colors.dark.blackCoral}
                  size="16"
                />
              </StyledButtonText>
            ) : (
              <StyledButtonText
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  // eslint-disable-next-line sonarjs/no-duplicate-string
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onPress={() =>
                  navigation.push('CheckoutStack', {
                    screen: 'CheckoutPickAddress'
                  })
                }
              >
                <Text
                  label={t('selectDeliveryAddress')}
                  variant="small"
                  color={colors.dark.blackCoral}
                />
                <Icon
                  name="chevronRight"
                  color={colors.light.whiteSolid}
                  stroke={colors.dark.blackCoral}
                  size="16"
                />
              </StyledButtonText>
            )}
          </Card>

          <Card>
            <Text
              label={t('delivery')}
              variant="small"
              fontWeight="semi-bold"
              color={colors.dark.blackCoral}
              style={{ marginBottom: 4 }}
            />
            {deliveryMethodState.id ? (
              <StyledButtonText onPress={() => deliveryMethodRef.current?.snapToIndex(0)}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                  }}
                >
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <Icon name="deliveryBox" color={colors.dark.blackCoral} size="14" />
                    <Text
                      label={deliveryMethodState.name}
                      variant="small"
                      color={colors.dark.blackCoral}
                      fontWeight="semi-bold"
                    />
                    <Text
                      label={currencyFormatter(deliveryMethodState.cost)}
                      variant="small"
                      color={colors.dark.blackCoral}
                      fontWeight="bold"
                    />
                  </View>
                  <Icon
                    name="chevronRight"
                    color={colors.light.whiteSolid}
                    stroke={colors.dark.blackCoral}
                    size="16"
                  />
                </View>
                <View style={{ paddingHorizontal: 24, paddingTop: 2 }}>
                  <Text
                    label={deliveryMethodState.estimate_delivery}
                    variant="extra-small"
                    color={colors.dark.gumbo}
                  />
                </View>
                {deliveryMethodState.insurance !== 0 ? (
                  <View style={{ paddingTop: 8 }}>
                    <Border color={colors.dark.solitude} />
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 8, paddingTop: 8 }}>
                      <Icon name="verifiedUser" color={colors.dark.gumbo} size="14" />
                      <Text
                        label={`${t('protectedDelivery')} (${currencyFormatter(
                          deliveryMethodState.insurance
                        )})`}
                        variant="extra-small"
                        color={colors.dark.gumbo}
                      />
                    </View>
                  </View>
                ) : null}
              </StyledButtonText>
            ) : (
              <StyledButtonText
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onPress={() => {
                  if (!deliveryTo.id) {
                    handleNoAddress();
                  } else {
                    deliveryMethodRef.current?.snapToIndex(0);
                  }
                }}
              >
                <Text label={t('selectDelivery')} variant="small" color={colors.dark.blackCoral} />
                <Icon
                  name="chevronRight"
                  color={colors.light.whiteSolid}
                  stroke={colors.dark.blackCoral}
                  size="16"
                />
              </StyledButtonText>
            )}
          </Card>

          <Card>
            <View style={{ gap: 2 }}>
              <Text
                label={'Special Promo'}
                variant="small"
                fontWeight="semi-bold"
                color={colors.dark.blackCoral}
              />
              <Text
                label={'Input your promo code to get a special price!'}
                variant="small"
                color={colors.dark.gumbo}
              />
            </View>
            {validatePromoResponse.discount_code ? (
              <StyledButtonText
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onPress={handleOpenModalPromoCode}
              >
                <Text
                  label={validatePromoResponse.discount_code}
                  variant="small"
                  color={colors.dark.gumbo}
                />
                <Icon
                  name="chevronRight"
                  color={colors.light.whiteSolid}
                  stroke={colors.dark.blackCoral}
                  size="16"
                />
              </StyledButtonText>
            ) : (
              <StyledButtonText
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onPress={handleOpenModalPromoCode}
              >
                <Text label={'Enter code'} variant="small" color={colors.dark.blackCoral} />
                <Icon
                  name="chevronRight"
                  color={colors.light.whiteSolid}
                  stroke={colors.dark.blackCoral}
                  size="16"
                />
              </StyledButtonText>
            )}
          </Card>

          <Card>
            <Text
              label={t('paymentOptions')}
              variant="small"
              fontWeight="semi-bold"
              color={colors.dark.blackCoral}
              style={{ marginBottom: 4 }}
            />
            {paymentOptionState.name ? (
              <StyledButtonText
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onPress={() => paymentOptionsRef.current?.snapToIndex(0)}
              >
                <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                  <Image
                    source={{ uri: paymentOptionState.logo }}
                    style={{ width: 35, height: 16 }}
                  />
                  <Text
                    label={paymentOptionState.name}
                    variant="small"
                    color={colors.dark.blackCoral}
                    fontWeight="semi-bold"
                  />
                </View>
                <Icon
                  name="chevronRight"
                  color={colors.light.whiteSolid}
                  stroke={colors.dark.blackCoral}
                  size="16"
                />
              </StyledButtonText>
            ) : (
              <StyledButtonText
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onPress={() => paymentOptionsRef.current?.snapToIndex(0)}
              >
                <Text
                  label={t('selectPaymentOptions')}
                  variant="small"
                  color={colors.dark.blackCoral}
                />
                <Icon
                  name="chevronRight"
                  color={colors.light.whiteSolid}
                  stroke={colors.dark.blackCoral}
                  size="16"
                />
              </StyledButtonText>
            )}
          </Card>
          <PaymentSummarySection
            cost={deliveryMethodState.cost}
            insurance={deliveryMethodState.insurance}
            discount={validatePromoResponse.discount_amount}
            totalPayment={totalPayment}
            totalPrice={totalPrice}
            totalQuantity={totalQuantity}
            voucher={voucher_amount}
            free_ongkir={get_free_ongkir}
          />
        </OrderDetailContainer>
      </LayoutScreen>
      <FooterContainer>
        <Border />
        <FooterButton>
          <View style={{ flex: 1 }}>
            <Button
              label={t('continue')}
              onPress={handleContinue}
              variant="background"
              color={colors.secondary}
              borderRadius="28px"
              isDisable={allEmpty}
            />
          </View>
        </FooterButton>
      </FooterContainer>

      <BottomDrawerContainer
        title={
          shippingMethodListData?.data && shippingMethodListData?.data.length > 1
            ? t('deliveryMethods')
            : t('deliveryMethod')
        }
        bottomSheetRef={deliveryMethodRef}
        onChange={() => setIsDeliveryMethodOpen(!isDeliveryMethodOpen)}
        onClose={() => {
          deliveryMethodRef.current?.close();
        }}
      >
        {isLoadingShippingMethodListData ? (
          <View style={{ padding: 16, display: 'flex', gap: 4 }}>
            <Skeleton height={20} width={120} />
            <Skeleton height={20} width={240} />
          </View>
        ) : (
          <View style={{ marginBottom: Platform.OS === 'ios' ? 23 : 0 }}>
            <FlatList
              data={shippingMethodListData?.data || []}
              renderItem={renderDeliveryMethodItem}
              keyExtractor={({ id }) => id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <Border color={colors.dark.solitude} />}
            />
          </View>
        )}
      </BottomDrawerContainer>

      <Modalize
        isVisible={isPromoCodeOpen}
        label="Special Promo"
        onCloseModal={() => {
          if (!validatePromoResponse.discount_code && promoCode) {
            setPromoCode('');
          } else if (
            validatePromoResponse.discount_code &&
            validatePromoResponse.discount_code !== promoCode.toUpperCase()
          ) {
            setPromoCode(validatePromoResponse.discount_code);
          }
          setIsPromoCodeOpen(!isPromoCodeOpen);
        }}
        type="input"
        value={promoCode}
        onChange={(value: string) => {
          !!errorPromoResponse && setErrorPromoResponse('');
          setPromoCode(value);
        }}
        maxLength={20}
        isShowButtonAction
        errorMessage={errorPromoResponse}
        helperText="Max. 20 chars."
        isClearable={!!errorPromoResponse}
        onClear={() => {
          setPromoCode('');
          setErrorPromoResponse('');
        }}
        isError={!!errorPromoResponse}
        onCancel={handleHideModalPromoCode}
        onSubmit={() => validatePromo({ discount_code: promoCode, cart_ids })}
        isLoading={isLoadingValidatePromo}
        isAutofocus={false}
      />

      <BottomDrawerContainer
        title={t('paymentOptions')}
        bottomSheetRef={paymentOptionsRef}
        onChange={() => setIsPaymentOptionOpen(!isPaymentOptionOpen)}
        onClose={() => {
          paymentOptionsRef.current?.close();
        }}
      >
        {isLoadingPaymentOptionData ? (
          <View style={{ padding: 16, display: 'flex', flexDirection: 'row', gap: 8 }}>
            <Skeleton height={20} width={40} />
            <Skeleton height={20} width={120} />
          </View>
        ) : (
          <FlatList
            data={paymentOptionData?.data || []}
            renderItem={renderPaymentOptionItem}
            keyExtractor={({ name }) => name}
            scrollEnabled={false}
          />
        )}
      </BottomDrawerContainer>

      <ModalAlert
        isVisible={showErrorModal.open}
        title={showErrorModal.title}
        description={showErrorModal.description}
        onCloseModal={showErrorModal.onCancel}
      />
    </>
  );
};

export default CheckoutScreen;
