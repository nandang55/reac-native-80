/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable camelcase */

import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQueryClient } from '@tanstack/react-query';
import LogoCartsEmpty from 'assets/images/carts-empty.svg';
import { Button } from 'components/Button';
import { CartCard } from 'components/Card';
import { Icon } from 'components/Icon';
import { LayoutScreen } from 'components/layouts';
import { ModalAlert } from 'components/Modal';
import { NoLogin } from 'components/NoLogin';
import { MustHaveSection } from 'components/Section';
import { Stepper } from 'components/Stepper';
import { Text } from 'components/Text';
import { AccountContext } from 'contexts/AppAccountContext';
import { CartContext } from 'contexts/AppCartContext';
import { LoadingContext } from 'contexts/AppLoadingContext';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import { useDeleteProductCart } from 'hooks/useDeleteProductCart';
import useGetCartList from 'hooks/useGetCartList';
import { useGetCartVouchers } from 'hooks/useGetCartVouchers';
import { usePostAddToWishlist } from 'hooks/usePostAddToWishlist';
import { usePostValidateCart } from 'hooks/usePostValidateCart';
import { usePutModifyQuantityCart } from 'hooks/usePutModifyQuantityCart';
import { CartInterface, ValidateCartInterface } from 'interfaces/CartInterface';
import { reset, RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, Dimensions, RefreshControl, TouchableOpacity, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import styled from 'styled-components/native';
import colors from 'styles/colors';
import { currencyFormatter } from 'utils/currencyFormatter';

type NavigationCartScreenProp = StackNavigationProp<RootStackParamList, 'CartStack'>;

interface ConfirmModal {
  open: boolean;
  title: string;
  description: string;
  singleBtnLabel?: string;
  onOk?: () => void;
}

const initialConfirmModal: ConfirmModal = {
  open: false,
  title: '',
  description: '',
  singleBtnLabel: '',
  onOk: () => undefined
};

const { width } = Dimensions.get('window');

const CartContainer = styled(View)`
  background-color: ${colors.light.whiteSolid};
  flex: 1;
  gap: 24px;
  padding: 0px 18px 24px 18px;
`;

const CartEmptyContainer = styled(View)`
  background-color: ${colors.light.whiteSolid};
  flex: 1;
  justify-content: center;
  padding: 0 50px;
`;

const FooterContainer = styled(View)`
  background-color: ${colors.light.whiteSolid};
  bottom: 0;
  display: flex;
  position: absolute;
  width: ${width};
`;

const FooterButton = styled(View)`
  align-items: center;
  flex-direction: row;
  justify-content: space-around;
  padding: 18px 16px;
`;

const Border = styled(View)`
  border: 0.8px solid ${colors.dark.silver};
`;

const fixDeliveryFee = 5;

const CartScreen = () => {
  const navigation = useNavigation<NavigationCartScreenProp>();
  const queryClient = useQueryClient();
  const isFocused = useIsFocused();

  const { state: accountState } = useContext(AccountContext);
  const { isNewCart, setIsNavigateFromCart, setIsNewCart } = useContext(CartContext);
  const { setIsShowToast, setToastMessage, setType, setIcon } = useContext(ModalToastContext);
  const { setLoading } = useContext(LoadingContext);

  const { id } = accountState.account || {};

  const [cartList, setCartList] = useState<Array<CartInterface>>([]);
  const [selectedItem, setSelectedItem] = useState<Array<ValidateCartInterface>>([]);
  const [showConfirmModal, setShowConfirmModal] = useState<ConfirmModal>(initialConfirmModal);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { t } = useTranslation(['cart']);

  const {
    isLoading: isLoadingDataCart,
    isFetchedAfterMount: isFetchedAfterMountDataCart,
    refetch: refetchDataCart
  } = useGetCartList({
    options: {
      onSuccess: (res) => {
        if (res.data.length) {
          const availableStock = res.data.filter((item) => item.stock > 0);
          const outOfStock = res.data.filter((item) => item.stock == 0);
          const sortedData = [...availableStock, ...outOfStock];
          setCartList(sortedData);

          if (!isNewCart) {
            const updatedSelected = sortedData.filter((item) => {
              const isSelectedItem = selectedItem.find((select) => select.id === item.id);
              return selectedItem.length === 0 || isSelectedItem || item.stock > 0;
            });

            setSelectedItem(updatedSelected);
          }

          setIsNewCart(false);
        }
      },
      enabled: !!id,
      staleTime: 0,
      refetchOnWindowFocus: 'always'
    }
  });

  const { mutate: changeQuantityProduct } = usePutModifyQuantityCart({
    onMutate: async ({ cartId, body }) => {
      const previousCartList = [...cartList];
      const updatedCarts = cartList.map((item) =>
        item.id === cartId ? { ...item, quantity: body.quantity } : item
      );

      setCartList(updatedCarts);
      return previousCartList;
    },
    onError: (_err, _newData, previousCartList) => {
      setCartList(previousCartList as Array<CartInterface>);
    }
  });

  const { mutate: deleteProduct } = useDeleteProductCart({
    onSuccess: async (data, { cartId }) => {
      if (!data.error) {
        const updatedCarts = cartList.filter((cart) => cart.id !== cartId);

        setCartList(updatedCarts);
      }
    }
  });

  const { mutate: validateCart } = usePostValidateCart({
    onSuccess: async (data) => {
      if (!data.error) {
        const checkoutItems = cartList?.filter((cart) =>
          selectedItem.some((item) => cart.id === item.id)
        );

        navigation.navigate('CheckoutStack', {
          screen: 'Checkout',
          params: {
            cart: checkoutItems,
            voucher: {
              voucher_amount: currentVoucher?.discount || 0,
              free_ongkir: currentVoucher?.free
            }
          }
        });
      } else {
        setShowConfirmModal({
          open: true,
          title: t('cart:unavailableTitle'),
          description: t('cart:unavailableDescription'),
          singleBtnLabel: t('cart:reload'),
          onOk: () => {
            queryClient.invalidateQueries({ queryKey: ['useGetCartList'] });
          }
        });
      }
    }
  });

  const { mutate: addToWishlist } = usePostAddToWishlist({
    onMutate: async ({ id: cartId }) => {
      const previousCartList = [...cartList];

      const updatedCartList = previousCartList.filter((data) => {
        if (data.is_wishlist) {
          return data;
        } else {
          return data.id !== cartId;
        }
      });

      setCartList(updatedCartList);

      return previousCartList;
    },
    onSuccess: (res) => {
      if (res.error) {
        setShowConfirmModal({
          open: true,
          description: 'This product is already on the wishlist.',
          title: 'Unable to Wishlist',
          singleBtnLabel: 'Close',
          onOk: () => setShowConfirmModal(initialConfirmModal)
        });
      } else {
        setIsShowToast(true);
        setType('success');
        setToastMessage(res.message || '');
        setIcon('checkCircleOutline');
        queryClient.invalidateQueries(['useGetCountCart']);
        queryClient.invalidateQueries(['useGetCountWishlist']);
        queryClient.invalidateQueries(['useGetWishlists']);
      }
    },
    onError: (_err, _newData, previousCartList) => {
      setCartList(previousCartList as Array<CartInterface>);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['useGetCartList']);
    }
  });

  useEffect(() => {
    if (!isFocused) {
      queryClient.invalidateQueries({ queryKey: ['useGetCountCart'] });
      queryClient.invalidateQueries(['useGetCountWishlist']);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  useEffect(() => {
    if (id) {
      refetchDataCart();
    }
    setIsRefreshing(false);
  }, [isRefreshing, refetchDataCart, id]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleBackButton();
      return true;
    });

    return () => backHandler.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const handleBackButton = () => {
    navigation.goBack();
  };

  const onRefresh = () => {
    setIsRefreshing(true);
  };

  const handleQuantity = (ids: string, value: number) => {
    if (value !== 0) {
      changeQuantityProduct({ cartId: ids, body: { quantity: value } });
    } else {
      setShowConfirmModal({
        open: true,
        title: t('cart:removeTitle'),
        description: t('cart:removeDescription'),
        onOk: () => {
          deleteProduct({ cartId: ids });
        }
      });
    }
  };

  const handleOnCheckout = () => {
    validateCart({ cart: selectedItem });
  };

  const calculateTotalPrice = (deliveryFee?: number, discount?: number) => {
    return cartList
      .filter((item) => selectedItem.some((select) => select.id === item.id) && item.stock > 0)
      .reduce(
        (total, item) => total + item.selling_price * item.quantity,
        (deliveryFee || 0) - (discount || 0)
      );
  };

  const { currentVoucher, nextVoucher, remainingPrice } = useGetCartVouchers({
    price: calculateTotalPrice()
  });

  const renderRightActions = ({ item }: { item: CartInterface }) => (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        // eslint-disable-next-line sonarjs/no-duplicate-string
        justifyContent: 'space-between',
        paddingLeft: 15
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: colors.secondary,
          alignItems: 'center',
          width: 58,
          marginLeft: 8,
          bottom: 0,
          justifyContent: 'center',
          position: 'absolute',
          top: 0,
          right: 58
        }}
        onPress={() => addToWishlist({ module: 'carts', id: item.id })}
      >
        <Icon
          name={item.is_wishlist ? 'wishlist' : 'wishlistOutline'}
          size="22px"
          color={colors.light.whiteSolid}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: colors.dark.gumbo,
          alignItems: 'center',
          width: 58,
          marginLeft: 8,
          bottom: 0,
          justifyContent: 'center',
          position: 'absolute',
          top: 0,
          right: 0
        }}
        onPress={() => deleteProduct({ cartId: item.id })}
      >
        <Icon name="trashBinOutline" size="24px" color={colors.light.whiteSolid} />
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }: { item: CartInterface }) => {
    return (
      <CartCard
        {...item}
        onPress={() => {
          setIsNavigateFromCart(true);
          navigation.push('ProductStack', {
            screen: 'ProductDetail',
            params: { id: item.product_id, title: item.product_name, variant_id: item.variant_id }
          });
        }}
        isChecked={selectedItem.some((select) => select.id === item.id)}
        handleChecked={() => {
          if (selectedItem.some((select) => select.id === item.id)) {
            const updatedSelected = selectedItem.filter((select) => select.id !== item.id);
            setSelectedItem(updatedSelected);
          } else {
            setSelectedItem([
              ...selectedItem,
              { id: item.id, quantity: item.quantity, selling_price: item.selling_price }
            ]);
          }
        }}
        activeOpacity={1}
        setQuantity={(value: number) => handleQuantity(item.id, value)}
        handleRemove={() => {
          setShowConfirmModal({
            open: true,
            title: t('cart:removeTitle'),
            description: t('cart:removeDescription'),
            onOk: () => {
              deleteProduct({ cartId: item.id });
            }
          });
        }}
      />
    );
  };

  const renderEmpty = () => {
    return (
      <CartEmptyContainer>
        <LogoCartsEmpty width="100%" />
        <Text
          label={t('cart:emptyCart')}
          color={colors.dark.gumbo}
          variant="medium"
          textAlign="center"
          style={{ marginTop: 12, marginBottom: 32, fontSize: 14 }}
        />
        <Button
          label={t('cart:shopNow')}
          onPress={() => reset('MainBottomTabNavigator')}
          variant="background"
          color={colors.secondary}
          borderRadius="28px"
        />
      </CartEmptyContainer>
    );
  };

  const renderFooterComponent = () => {
    return (
      <View>
        {cartList.length > 0 && (
          <View>
            <Text
              label="Order Summary"
              variant="medium"
              fontWeight="semi-bold"
              color={colors.dark.blackCoral}
            />
            <View
              style={{
                marginTop: 12,
                backgroundColor: colors.light.whiteSmoke,
                paddingHorizontal: 12,
                paddingVertical: 16,
                borderRadius: 8,
                gap: 8
              }}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between'
                }}
              >
                <Text
                  label="Subtotal"
                  color={colors.dark.gumbo}
                  variant="small"
                  fontWeight="semi-bold"
                />
                <Text
                  label={currencyFormatter(calculateTotalPrice())}
                  color={colors.dark.gumbo}
                  variant="small"
                  fontWeight="semi-bold"
                />
              </View>
              {(currentVoucher?.discount || 0) > 0 && (
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between'
                  }}
                >
                  <Text
                    label="Voucher"
                    color={colors.dark.gumbo}
                    variant="small"
                    fontWeight="semi-bold"
                  />
                  <Text
                    label={`-${currencyFormatter(currentVoucher?.discount || 0)}`}
                    color={colors.red.newPink}
                    variant="small"
                    fontWeight="semi-bold"
                  />
                </View>
              )}
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between'
                }}
              >
                <Text
                  label="Delivery Fee"
                  color={colors.dark.gumbo}
                  variant="small"
                  fontWeight="semi-bold"
                />
                <Text
                  label={currentVoucher?.free ? 'Free' : 'Start from S$5'}
                  color={colors.red.newPink}
                  variant="small"
                  fontWeight="semi-bold"
                />
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between'
                }}
              >
                <Text
                  label="Delivery Insurance"
                  color={colors.dark.gumbo}
                  variant="small"
                  fontWeight="semi-bold"
                />
                <Text
                  label="Free"
                  color={colors.red.newPink}
                  variant="small"
                  fontWeight="semi-bold"
                />
              </View>
            </View>
          </View>
        )}
        <MustHaveSection />
      </View>
    );
  };

  useEffect(
    () => setLoading((!!id && isLoadingDataCart) || isRefreshing),
    [isLoadingDataCart, isRefreshing, setLoading, id]
  );

  return (
    <>
      <LayoutScreen isNoPadding>
        {!id ? (
          <View style={{ flex: 1, backgroundColor: colors.light.whiteSolid }}>
            <NoLogin />
          </View>
        ) : (
          isFetchedAfterMountDataCart && (
            <>
              <CartContainer>
                <SwipeListView
                  data={cartList}
                  renderItem={renderItem}
                  keyExtractor={(_, index) => index.toString()}
                  contentContainerStyle={{ flexGrow: 1, gap: 24, paddingBottom: 100 }}
                  ListEmptyComponent={renderEmpty}
                  renderHiddenItem={renderRightActions}
                  leftOpenValue={75}
                  rightOpenValue={-128}
                  disableRightSwipe={true}
                  showsVerticalScrollIndicator={false}
                  ListFooterComponent={renderFooterComponent}
                  refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
                  }
                  ListHeaderComponent={
                    <Stepper
                      currentPosition={currentVoucher?.position as number}
                      labels={['S$100', 'S$150', 'S$175', 'S$200']}
                      stepCount={4}
                      currentFree={currentVoucher?.free}
                      currentDiscount={currentVoucher?.discount}
                      nextFree={nextVoucher?.free}
                      nextDiscount={nextVoucher?.discount}
                      remainingPrice={remainingPrice || 0}
                    />
                  }
                  ListHeaderComponentStyle={{ paddingTop: 18 }}
                />
              </CartContainer>
            </>
          )
        )}
      </LayoutScreen>

      {cartList?.length > 0 && (
        <FooterContainer>
          <Border />
          <FooterButton>
            <View style={{ flex: 1, gap: 4 }}>
              <Text label={t('cart:est')} color={colors.dark.blackCoral} variant="small" />
              <Text
                label={currencyFormatter(
                  calculateTotalPrice(
                    currentVoucher?.free ? 0 : fixDeliveryFee,
                    currentVoucher?.discount || 0
                  )
                )}
                color={colors.dark.blackCoral}
                variant="medium"
                fontWeight="semi-bold"
              />
              <Text
                label={'Price will be subject to delivery fee.'}
                color={colors.dark.bermudaGrey}
                variant="extra-small"
                fontStyle="italic"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Button
                label={t('cart:checkout')}
                onPress={handleOnCheckout}
                variant="background"
                color={colors.secondary}
                isDisableColor={colors.light.whiteSmoke}
                isDisableTextColor={colors.dark.solitude}
                borderWidth="1px"
                borderColor={colors.secondary}
                borderRadius="28px"
                isDisable={selectedItem?.length < 1}
              />
            </View>
          </FooterButton>
        </FooterContainer>
      )}

      <ModalAlert
        title={showConfirmModal.title}
        description={showConfirmModal.description}
        isVisible={showConfirmModal.open}
        singleBtnLabel={showConfirmModal.singleBtnLabel}
        onCloseModal={() => setShowConfirmModal(initialConfirmModal)}
        onPressYes={showConfirmModal.onOk}
      />
    </>
  );
};

export default CartScreen;
