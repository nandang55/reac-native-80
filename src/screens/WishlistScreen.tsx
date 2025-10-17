/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable camelcase */
import BottomSheet from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Sentry from '@sentry/react-native';
import { useQueryClient } from '@tanstack/react-query';
import WishlistEmpty from 'assets/images/wishlist-empty.svg';
import { BackButton } from 'components/BackButton';
import { BottomDrawerCart } from 'components/BottomDrawer';
import { Button } from 'components/Button';
import { WishlistCard } from 'components/Card';
import { Icon } from 'components/Icon';
import { InputQuantity } from 'components/Input';
import { LayoutScreen } from 'components/layouts';
import { ModalAlert } from 'components/Modal';
import { NoLogin } from 'components/NoLogin';
import { VariantOptions } from 'components/Options';
import { Text } from 'components/Text';
import { AccountContext } from 'contexts/AppAccountContext';
import { LoadingContext } from 'contexts/AppLoadingContext';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import { useDeleteWishlists } from 'hooks/useDeleteWishlists';
import useGetProductDetail from 'hooks/useGetProductDetail';
import { useGetWishlists } from 'hooks/useGetWishlists';
import { usePostAddToCart } from 'hooks/usePostAddToCart';
import useVariantOptions from 'hooks/useVariantOptions';
import { PostBodyCartInterface } from 'interfaces/CartInterface';
import { VariantActiveState, VariantOption } from 'interfaces/ProductDetailInterface';
import { WishlistInterface } from 'interfaces/WishlistInterface';
import { reset, RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, FlatList, RefreshControl, View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import styled from 'styled-components/native';
import colors from 'styles/colors';

type WishlistScreenProps = StackNavigationProp<RootStackParamList>;

interface ConfirmModal {
  open: boolean;
  title: string;
  description: string;
  onOk?: () => void;
}

const initialConfirmModal: ConfirmModal = {
  open: false,
  title: '',
  description: '',
  onOk: () => undefined
};

const WishlistContainer = styled(View)`
  background-color: ${colors.light.whiteSolid};
  flex: 1;
  padding: 16px;
  padding-bottom: 55px;
`;

const WishlistEmptyContainer = styled(View)`
  background-color: ${colors.light.whiteSolid};
  flex: 1;
  gap: 16px;
  justify-content: center;
  padding: 0 50px;
`;

const EditContainer = styled(View)`
  align-items: center;
  background-color: ${colors.light.whiteSolid};
  border-top-color: ${colors.dark.solitude};
  border-top-width: 2px;
  bottom: 0px;
  display: flex;
  flex-direction: row;
  gap: 8px;
  left: 0px;
  padding: 16px;
  position: absolute;
  right: 0px;
`;

// eslint-disable-next-line sonarjs/cognitive-complexity
const WishlistScreen = () => {
  const navigation = useNavigation<WishlistScreenProps>();

  const [edit, setEdit] = useState(false);
  const [wishlistId, setWishlistId] = useState('');
  const [productId, setProductId] = useState('');
  const [productIds, setProductIds] = useState<Array<string>>([]);
  const [showConfirmModal, setShowConfirmModal] = useState<ConfirmModal>(initialConfirmModal);
  const [quantity, setQuantity] = useState<number>(1);

  const addToCartRef = useRef<BottomSheet>(null);

  const queryClient = useQueryClient();

  const { state: accountState } = useContext(AccountContext);
  const { setIsShowToast, setToastMessage, setType, setIcon } = useContext(ModalToastContext);

  const { id } = accountState.account || {};

  const { setLoading } = useContext(LoadingContext);

  const {
    data: dataWishlist,
    isLoading,
    isFetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetWishlists({
    options: { enabled: !!id },
    params: { page: 1, per_page: 15 }
  });

  const {
    data: productDetail,
    isLoading: isLoadingProductDetail,
    isRefetching: isRefetchingProductDetail
  } = useGetProductDetail({
    id: productId,
    options: {
      enabled: !!productId,
      onSuccess: (res) => {
        if (!res.error && !res.data.variant_stock_keys) {
          Sentry.withScope((scope) => {
            scope.setTag('product_id', res.data.id);
            scope.setTag('product_name', res.data.name);
            scope.setContext('error_details', {
              title: 'Error',
              description: "variant stock keys 'null'"
            });
            Sentry.captureException(new Error("variant stock keys 'null'"));
          });
        }
      }
    }
  });

  const { mutate: removeWishlist, isLoading: isRemoveWishlistLoading } = useDeleteWishlists({
    onSuccess: () => {
      queryClient.invalidateQueries(['useGetWishlists']);
      queryClient.invalidateQueries(['useGetCountWishlist']);
      setEdit(false);
      setIsShowToast(true);
      setType('success');
      setToastMessage('Product has been removed from wishlist.');
      setIcon('cart');
    }
  });

  const { mutate: addToCart, isLoading: loadingAddToCart } = usePostAddToCart({
    onSuccess: () => {
      setIsShowToast(true);
      setType('success');
      setToastMessage('Product has been successfully added to the cart.');
      setIcon('cart');
      onClose();
      queryClient.invalidateQueries(['useGetCountCart']);
      queryClient.invalidateQueries(['useGetCountWishlist']);
      queryClient.invalidateQueries(['useGetCartList']);
      queryClient.invalidateQueries(['useGetWishlists']);
    }
  });

  const WishlistData = dataWishlist?.pages?.flatMap((item) => item?.data) || [];

  const {
    main_image_link,
    option_sequence,
    variant_stock_keys,
    name,
    highest_price,
    lowest_price,
    is_sold_out: allVariantOutOfStock
  } = productDetail?.data || {};

  const {
    variantOptionData,
    label,
    active,
    setActive,
    setAvailable,
    price,
    stock,
    isStockEmpty,
    stocksValue
  } = useVariantOptions({
    allVariantOutOfStock: allVariantOutOfStock || false,
    isOpen: true,
    variant_stock_keys,
    option_sequence: option_sequence || [],
    highest_price: highest_price || 0,
    lowest_price: lowest_price || 0
  });

  const allWishlistChecked = WishlistData.length === productIds.length;

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const onOpen = ({ productId, wishlistId }: { productId: string; wishlistId: string }) => {
    addToCartRef.current?.snapToIndex(0);
    setProductId(productId);
    setWishlistId(wishlistId);
  };

  const onClose = () => {
    addToCartRef.current?.close();
    setProductId('');
    setWishlistId('');
  };

  const onRefreshWishlistData = () => {
    refetch();
  };

  const handleAddToCart = () => {
    const payload: PostBodyCartInterface = {
      product_id: productId,
      quantity: quantity,
      variant_id: stocksValue?.variant_id || '',
      wishlist_id: wishlistId
    };

    addToCart(payload);
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleOnDetailProduct = ({ id, title }: { id: string; title: string }) => {
    navigation.navigate('ProductStack', { screen: 'ProductDetail', params: { id, title } });
  };

  const renderItem = ({ item }: { item: WishlistInterface }) => {
    if (!item) return null;

    return (
      <WishlistCard
        data={item}
        edit={edit}
        checked={productIds.includes(item.product_id)}
        onOpenCart={() => onOpen({ productId: item.product_id, wishlistId: item.id })}
        onClickProduct={() =>
          handleOnDetailProduct({ id: item.product_id, title: item.product_name })
        }
        onRemoveWishlist={() =>
          setShowConfirmModal({
            description: 'Are you sure you want to remove this product from your wishlist?',
            open: true,
            title: 'Remove Confirmation',
            onOk: () => removeWishlist({ product_ids: [item.product_id] })
          })
        }
        // eslint-disable-next-line @typescript-eslint/no-shadow
        onChecked={(productId) =>
          setProductIds((prevProductIds) => {
            if (prevProductIds.includes(productId)) {
              return prevProductIds.filter((existingId) => existingId !== productId);
            } else {
              return [...prevProductIds, productId];
            }
          })
        }
      />
    );
  };

  const renderEmpty = () => {
    return (
      <WishlistEmptyContainer>
        <WishlistEmpty width="100%" />
        <Text
          label={'Your wishlist is empty. Explore the sparkling world of SriCandy.'}
          color={colors.dark.gumbo}
          textAlign="center"
        />
        <Button
          label="SHOP NOW"
          onPress={() => reset('MainBottomTabNavigator')}
          variant="background"
          color={colors.secondary}
          borderRadius="28px"
        />
      </WishlistEmptyContainer>
    );
  };

  useEffect(() => {
    if (!productId) {
      setAvailable({});
      setActive({});
    }
  }, [productId, setActive, setAvailable]);

  useEffect(() => {
    if (isStockEmpty) {
      setQuantity(1);
    }
  }, [isStockEmpty]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleBackButton();
      return true;
    });

    return () => backHandler.remove();
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton onPress={handleBackButton} tintColor="white" />
    });
  }, [navigation]);

  const handleBackButton = () => {
    queryClient.removeQueries({ queryKey: ['useGetWishlists'] });
    navigation.goBack();
  };

  useEffect(
    () => setLoading((isLoading && !!id) || isFetching || isRemoveWishlistLoading),
    [id, isFetching, isLoading, isRemoveWishlistLoading, setLoading]
  );

  return (
    <>
      <LayoutScreen isNoPadding>
        {!id ? (
          <View style={{ flex: 1, backgroundColor: colors.light.whiteSolid }}>
            <NoLogin />
          </View>
        ) : (
          <WishlistContainer>
            {!isLoading && (
              <FlatList
                data={WishlistData}
                keyExtractor={(_, index) => index?.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
                ListHeaderComponent={
                  edit ? (
                    <BouncyCheckbox
                      size={16}
                      style={{ gap: 8, paddingHorizontal: 1, paddingBottom: 12 }}
                      textComponent={<Text label={'Select all'} color={colors.dark.gumbo} />}
                      iconComponent={
                        <Icon
                          name={allWishlistChecked ? 'checkedCircle' : 'checkCircleOutline'}
                          size="17px"
                          color={colors.red.newPink}
                        />
                      }
                      iconStyle={{ backgroundColor: 'transparent' }}
                      isChecked={allWishlistChecked}
                      onPress={() =>
                        setProductIds((prevProductIds) => {
                          if (prevProductIds.length < WishlistData.length) {
                            return WishlistData.map((data) => data.product_id);
                          } else {
                            return [];
                          }
                        })
                      }
                      useBuiltInState={false}
                    />
                  ) : null
                }
                ListEmptyComponent={isLoading || isFetching ? null : renderEmpty}
                showsVerticalScrollIndicator={false}
                extraData={dataWishlist}
                onEndReached={() => {
                  if (hasNextPage) {
                    fetchNextPage();
                  }
                }}
                onEndReachedThreshold={0.5}
                ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
                refreshControl={
                  <RefreshControl refreshing={false} onRefresh={onRefreshWishlistData} />
                }
              />
            )}
          </WishlistContainer>
        )}
      </LayoutScreen>

      {WishlistData.length > 0 && (
        <>
          <EditContainer>
            <View style={{ flex: 1 }}>
              <Button
                label={edit ? 'Cancel' : 'Edit'}
                onPress={() => {
                  setEdit(!edit);
                  setProductIds([]);
                }}
                variant={edit ? 'plain' : 'background'}
                fontSize="medium"
                fontWeight="semi-bold"
                color={colors.secondary}
                textColor={colors.light.whiteSolid}
                height={40}
                borderRadius="28px"
                borderColor={colors.secondary}
                borderWidth="1px"
              />
            </View>
            {edit && (
              <View style={{ flex: 1 }}>
                <Button
                  label={'Remove'}
                  onPress={() =>
                    setShowConfirmModal({
                      description:
                        'Are you sure you want to remove this product from your wishlist?',
                      open: true,
                      title: 'Remove Confirmation',
                      onOk: () => removeWishlist({ product_ids: productIds })
                    })
                  }
                  variant="background"
                  fontSize="medium"
                  fontWeight="semi-bold"
                  color={colors.secondary}
                  isDisableColor={colors.light.whiteSmoke}
                  textColor={colors.light.whiteSolid}
                  isDisableTextColor={colors.dark.solitude}
                  height={40}
                  borderRadius="28px"
                  borderColor={colors.secondary}
                  isDisableBorderColor={colors.dark.silver}
                  borderWidth="1px"
                  isDisable={productIds.length === 0}
                />
              </View>
            )}
          </EditContainer>

          <BottomDrawerCart
            bottomSheetRef={addToCartRef}
            onPressAddToCart={handleAddToCart}
            isLoading={isLoadingProductDetail || isRefetchingProductDetail}
            isMutating={loadingAddToCart}
            labelAddToCart={'Add to Cart'}
            onClose={onClose}
            productTitle={name || ''}
            productImage={main_image_link || ''}
            price={price}
            stock={stock as number}
          >
            {option_sequence?.map((sequence, index) => (
              <VariantOptions
                key={index}
                label={label(sequence)}
                sequence={sequence}
                data={variantOptionData({
                  options: variant_stock_keys?.options[sequence] as Array<VariantOption>,
                  variant: sequence
                })}
                active={active[sequence] as VariantActiveState}
                setActive={setActive}
              />
            ))}
            <InputQuantity
              label={'Quantity'}
              value={quantity}
              setValue={setQuantity}
              min={1}
              max={isStockEmpty ? 1 : (stock as number)}
            />
          </BottomDrawerCart>
        </>
      )}

      <ModalAlert
        title={showConfirmModal.title}
        description={showConfirmModal.description}
        isVisible={showConfirmModal.open}
        onCloseModal={() => setShowConfirmModal(initialConfirmModal)}
        onPressYes={showConfirmModal.onOk}
      />
    </>
  );
};

export default WishlistScreen;
