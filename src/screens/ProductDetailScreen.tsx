// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import * as Sentry from '@sentry/react-native';
import { useQueryClient } from '@tanstack/react-query';
import { BackButton } from 'components/BackButton';
import { BottomDrawerCart } from 'components/BottomDrawer';
import { ModalBottomSheet } from 'components/BottomSheet';
import { Button } from 'components/Button';
import { ProductCardBaseInterface } from 'components/Card/ProductCard.type';
import { Icon, IconType } from 'components/Icon';
import { InputQuantity } from 'components/Input';
import { LayoutScreen } from 'components/layouts';
import { ModalAlert } from 'components/Modal';
import { VariantOptions } from 'components/Options';
import { ProductSection } from 'components/Section';
import { ProductDetailSkeleton } from 'components/Skeleton';
import { VideoImageSlider } from 'components/Slider';
import { Spacer } from 'components/Spacer';
import { Text } from 'components/Text';
import { AccountContext } from 'contexts/AppAccountContext';
import { CartContext } from 'contexts/AppCartContext';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import { VideoPlayerContext } from 'contexts/AppVideoPlayerContext';
import { useDeleteWishlist } from 'hooks/useDeleteWishlist';
import useGetProductDetail from 'hooks/useGetProductDetail';
import useGetProductRecommended from 'hooks/useGetProductRecommended';
import { usePostAddToCart } from 'hooks/usePostAddToCart';
import { usePostAddToWishlist } from 'hooks/usePostAddToWishlist';
import { APIResponse } from 'interfaces/BaseAPIResponse';
import { PostBodyCartInterface } from 'interfaces/CartInterface';
import type {
  MediaInterface,
  VariantActiveState,
  VariantAvailableState,
  VariantOption,
  Variants
} from 'interfaces/ProductDetailInterface';
import { ProductItemInterface } from 'interfaces/ProductInterface';
import type { ProductStackParamList } from 'navigators/ProductStackNavigator';
import { reset, RootStackParamList } from 'navigators/RootStackNavigator';
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, TouchableOpacity, View } from 'react-native';
import { RichEditor } from 'react-native-pell-rich-editor';
import styled from 'styled-components/native';
import colors from 'styles/colors';
import { currencyFormatter } from 'utils/currencyFormatter';

import { UserGuide } from './Product';
import useShare, { ShareAppInteface } from './Product/Detail/Hook/useShare';

type ProductDetailScreenProps = StackScreenProps<ProductStackParamList, 'ProductDetail'>;

type NavigationProductDetailScreenProps = StackNavigationProp<RootStackParamList>;

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

const ProductDetailContainer = styled(View)`
  background-color: ${colors.light.whiteSolid};
  flex: 1;
  padding-bottom: 75px;
`;

const OutOfStockContainer = styled(View)`
  align-items: center;
  background-color: ${colors.secondary};
  flex-direction: row;
  gap: 8px;
  padding: 8px 16px;
`;

const CartContainer = styled(View)`
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

const TabButton = styled(TouchableOpacity)`
  border-bottom-color: ${colors.secondary};
  padding: 8px 12px;
`;

// eslint-disable-next-line sonarjs/cognitive-complexity
const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ route }) => {
  const navigation = useNavigation<NavigationProductDetailScreenProps>();
  const addToCartRef = useRef<BottomSheet>(null);
  const { t } = useTranslation('productDetail');
  const isFocused = useIsFocused();

  const { state: accountState } = useContext(AccountContext);
  const { setIsNavigateFromCart, setIsNewCart } = useContext(CartContext);
  const { setIsShowToast, setToastMessage, setType, setIcon } = useContext(ModalToastContext);
  const { isPlaying, currentTime, currentIndex, setIsPlaying, setCurrentTime, setCurrentIndex } =
    useContext(VideoPlayerContext);
  const {
    ShareApp,
    handleShare,
    handleShareInstagram,
    handleCopyLink,
    isShowModalShare,
    setIsShowModalShare,
    isShowToast,
    setShowToast,
    toastMessage,
    isError,
    setIsError,
    setShareLink
  } = useShare();

  const [tabIndex, setTabIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [active, setActive] = useState<VariantActiveState>({});
  const [available, setAvailable] = useState<VariantAvailableState>({});
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState<ConfirmModal>(initialConfirmModal);
  const [isRefreshScreen, setIsRefreshScreen] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const {
    data: productDetail,
    isLoading: isLoadingProductDetail,
    isRefetching: isRefetchingProductDetail,
    refetch: refetchProductDetail
  } = useGetProductDetail({
    id: route.params.id,
    options: {
      onSuccess: (res) => {
        if (!res.error) {
          navigation.setParams({ title: res.data.name });
          if (!res.data.variant_stock_keys) {
            Sentry.withScope((scope) => {
              scope.setTag('product_id', res.data.id);
              scope.setTag('product_name', res.data.name);
              scope.setContext('error_details', {
                title: 'Error',
                description: "variant stock keys 'null'"
              });
              Sentry.captureException(new Error("variant stock keys 'null'"));
            });
            setShowConfirmModal({
              open: true,
              title: 'Something Was Wrong',
              description: 'Unable to display product detail',
              singleBtnLabel: 'Go Back',
              onOk: () => {
                navigation.goBack();
              }
            });
          }
        }
      }
    }
  });

  const {
    data: productRecommended,
    isLoading: isLoadingProductRecommended,
    isRefetching: isRefetchingProductRecommended,
    refetch: refetchProductRecommended
  } = useGetProductRecommended({
    id: productDetail?.data.id as string,
    options: {
      enabled: !!productDetail?.data.id
    }
  });

  const { mutate: addToCart, isLoading: loadingAddToCart } = usePostAddToCart({
    onSuccess: (res) => {
      setIsShowToast(true);
      setType('success');
      setToastMessage(res.message || '');
      setIcon('cart');
      onClose();
      queryClient.invalidateQueries(['useGetCountCart']);
      setIsNewCart(true);
      setIsNavigateFromCart(false);
      queryClient.invalidateQueries({ queryKey: ['useGetCartList'] });
    }
  });

  const { mutate: addToWishlist } = usePostAddToWishlist({
    onMutate: async ({ id: productId, from }) => {
      if (from === 'productDetail') {
        const previousDataList = queryClient.getQueryData(['useGetProductDetail', route.params.id]);

        queryClient.setQueryData<APIResponse<ProductItemInterface>>(
          ['useGetProductDetail', route.params.id],
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              data: {
                ...oldData.data,
                is_wishlist: true
              }
            };
          }
        );

        return previousDataList;
      } else {
        const previousDataList = queryClient.getQueryData([
          'useGetProductRecommended',
          productDetail?.data.id
        ]);

        queryClient.setQueryData<APIResponse<Array<ProductItemInterface>>>(
          ['useGetProductRecommended', productDetail?.data.id],
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              data: oldData.data.map((item) =>
                item.id === productId ? { ...item, is_wishlist: true } : item
              )
            };
          }
        );

        return previousDataList;
      }
    },
    onError: (_err, { from }, previousDataList) => {
      if (from === 'productDetail') {
        queryClient.setQueryData(['useGetProductDetail', route.params.id], previousDataList);
      } else {
        queryClient.setQueryData(
          ['useGetProductRecommended', productDetail?.data.id],
          previousDataList
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetNewArrivals'] });
      queryClient.invalidateQueries({ queryKey: ['useGetCategoryList'] });
      queryClient.invalidateQueries({ queryKey: ['useGetCountWishlist'] });
    },
    onSuccess: (res) => {
      setIsShowToast(true);
      setType('success');
      setToastMessage(res.message || '');
      setIcon('checkCircleOutline');
    }
  });

  const { mutate: removeWishlist } = useDeleteWishlist({
    onMutate: async ({ product_ids, from }) => {
      if (from === 'productDetail') {
        const previousDataList = queryClient.getQueryData(['useGetProductDetail', route.params.id]);

        queryClient.setQueryData<APIResponse<ProductItemInterface>>(
          ['useGetProductDetail', route.params.id],
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              data: {
                ...oldData.data,
                is_wishlist: false
              }
            };
          }
        );

        return previousDataList;
      } else {
        const previousDataList = queryClient.getQueryData([
          'useGetProductRecommended',
          productDetail?.data.id
        ]);

        queryClient.setQueryData<APIResponse<Array<ProductItemInterface>>>(
          ['useGetProductRecommended', productDetail?.data.id],
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              data: oldData.data.map((item) =>
                item.id === product_ids[0] ? { ...item, is_wishlist: false } : item
              )
            };
          }
        );

        return previousDataList;
      }
    },
    onError: (_err, { from }, previousDataList) => {
      if (from === 'productDetail') {
        queryClient.setQueryData(['useGetProductDetail', route.params.id], previousDataList);
      } else {
        queryClient.setQueryData(
          ['useGetProductRecommended', productDetail?.data.id],
          previousDataList
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetNewArrivals'] });
      queryClient.invalidateQueries({ queryKey: ['useGetCategoryList'] });
      queryClient.invalidateQueries({ queryKey: ['useGetCountWishlist'] });
    },
    onSuccess: (res) => {
      setIsShowToast(true);
      setType('success');
      setToastMessage(res.message || '');
      setIcon('checkCircleOutline');
    }
  });

  const {
    media,
    description,
    option_sequence,
    variant_stock_keys,
    lowest_price,
    highest_price,
    is_sold_out: allVariantOutOfStock,
    category_id,
    is_wishlist
  } = productDetail?.data || {};

  const OPTION_KEY = isOpen ? '_has_stock' : '_available';

  const variantOptionData = (
    options: Array<VariantOption>,
    variant: Variants,
    avilableState: VariantAvailableState
    // eslint-disable-next-line sonarjs/cognitive-complexity
  ) => {
    const variantIds = options?.map((option) => ({ [variant]: option.id }));
    const flattenedVariantIds = variantIds?.reduce((acc: { [key: string]: Array<string> }, obj) => {
      Object.entries(obj).forEach(([objKey, value]) => {
        acc[objKey] = acc[objKey] ? [...acc[objKey], value] : [value];
      });
      return acc;
    }, {});

    if (flattenedVariantIds) {
      Object.entries(flattenedVariantIds).forEach(([key, value]) => {
        if (
          variant_stock_keys?.option_no_stocks &&
          key in variant_stock_keys.option_no_stocks &&
          Array.isArray(value) &&
          Array.isArray(variant_stock_keys?.option_no_stocks[key])
        ) {
          flattenedVariantIds[key] = value.filter(
            (item) => !variant_stock_keys?.option_no_stocks[key].includes(item)
          );
        }
      });
    }

    const variantExceptNoStock = flattenedVariantIds && Object.values(flattenedVariantIds).flat();

    if (Object.keys(avilableState || {}).length === 0) {
      return options?.map((option) => {
        option.disabled = isOpen ? !variantExceptNoStock.includes(option.id) : false;
        return option;
      });
    }

    const variantAvailable = Object.values(avilableState).map(
      (prop) => prop[`${variant + OPTION_KEY}`]
    );
    const cleanedVariant = variantAvailable?.filter((value) => value !== undefined);

    const commonAvailable = cleanedVariant?.reduce((acc, commAvail) => {
      return acc.filter((item) => commAvail.includes(item));
    }, cleanedVariant[0] || []);

    const hasDuplicates = new Set(commonAvailable || []).size !== commonAvailable?.length;
    const uniqueVariant = hasDuplicates
      ? commonAvailable?.filter((value, index, self) => self.indexOf(value) !== index)
      : commonAvailable;
    const cartVariant = variantExceptNoStock?.filter((elm) => uniqueVariant?.includes(elm));

    return options?.map((option) => {
      const isDisabled = isOpen
        ? !cartVariant?.includes(option.id)
        : !uniqueVariant?.includes(option.id);

      option.disabled = isDisabled;
      return option;
    });
  };

  const constructLabel = (variant: Variants) => {
    return t(variant);
  };

  const constructStocksKey = () => {
    const activeKeys = Object.keys(active);
    const isComplete = activeKeys.length === option_sequence?.length;
    const isTheSameOrder = activeKeys.every((key, index) => key === option_sequence?.[index]);

    if (isComplete) {
      if (isTheSameOrder) {
        return option_sequence?.map((key) => active[key]).join('_');
      } else {
        const reorderedActiveKeys = option_sequence.filter((key) => activeKeys.includes(key));
        const reorderedIsComplete = reorderedActiveKeys.join() === option_sequence.join();
        if (reorderedIsComplete) {
          return option_sequence?.map((key) => active[key]).join('_');
        }
      }
    }
    return null;
  };

  const stocksKey = constructStocksKey();
  const stocksValue = stocksKey ? variant_stock_keys?.stocks[stocksKey] : null;

  const price = stocksValue?.price
    ? currencyFormatter(stocksValue?.price)
    : Number(lowest_price) === Number(highest_price)
      ? currencyFormatter(Number(lowest_price))
      : `${currencyFormatter(Number(lowest_price))}-${currencyFormatter(Number(highest_price))}`;

  const stock = stocksValue?.qty || '-';

  const isStockEmpty = stock === 0 || stock === '-';

  const isSoldOut = allVariantOutOfStock || (isStockEmpty && !!stocksKey);

  const sliderVideoImage: Array<MediaInterface & { id: string }> =
    media?.map((item, index) => ({
      ...item,
      id: index.toString()
    })) || [];

  useEffect(() => {
    if (isStockEmpty) {
      setQuantity(1);
    }
  }, [isStockEmpty]);

  useEffect(() => {
    const setVariantActive = () => {
      const variantId = route.params?.variant_id;

      if (variantId) {
        const stockEntry = Object.entries(variant_stock_keys?.stocks || {}).find(
          ([, value]) => value.variant_id === variantId
        );

        if (stockEntry) {
          const [stockKey] = stockEntry;
          const parts = stockKey.split('_');

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const defaultSelected = option_sequence?.reduce((acc: any, key, index) => {
            if (parts[index]) {
              acc[key] = parts[index];
            }
            return acc;
          }, {});

          setActive(defaultSelected);
          return;
        }
      }

      variant_stock_keys && setActive(variant_stock_keys?.default_selected || {});
    };

    setVariantActive();
  }, [option_sequence, route.params?.variant_id, variant_stock_keys]);

  useEffect(() => {
    const filterMatchedAvailableKey = (id: VariantOption) => {
      return Object.keys(id)
        .filter((objKey) => objKey.endsWith(OPTION_KEY))
        .reduce((acc, objKey) => ({ ...acc, [objKey]: id[objKey] }), {});
    };

    const flattenCurrentAvailableKey = (key: Variants) => {
      const keyAvailable = variant_stock_keys?.options?.[key]?.map((option) => ({
        [`${key + OPTION_KEY}`]: option.id
      }));

      return keyAvailable?.reduce((acc: { [key: string]: Array<string> }, obj) => {
        Object.entries(obj).forEach(([objKey, value]) => {
          acc[objKey] = acc[objKey] ? [...acc[objKey], value] : [value];
        });
        return acc;
      }, {});
    };

    setAvailable((prevState) => {
      if (Object.keys(active).length === 0) {
        return {};
      }

      const updatedState = { ...prevState };

      option_sequence?.forEach((sequence) => {
        const key = sequence as Variants;
        const matchIds = variant_stock_keys?.options?.[key]?.find(
          (option) => option.id === active[key]
        );

        if (matchIds) {
          const filteredId = filterMatchedAvailableKey(matchIds);
          const flattenedKeyAvailable = flattenCurrentAvailableKey(key);

          updatedState[key] =
            Object.keys(active).length === 1
              ? { ...filteredId, ...flattenedKeyAvailable }
              : filteredId;
        } else {
          delete updatedState[key];
        }
      });

      return updatedState;
    });
  }, [active, option_sequence, variant_stock_keys?.options, OPTION_KEY]);

  useEffect(() => {
    if (!isFocused) {
      setCurrentTime(0);
      setCurrentIndex(0);
      setIsPlaying(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const handleOnDetailProduct = ({ id, title }: { id: string; title: string }) => {
    navigation.push('ProductStack', {
      screen: 'ProductDetail',
      params: { id, title }
    });
  };

  const onOpen = () => {
    addToCartRef.current?.snapToIndex(0);
    setIsOpen(true);
  };

  const onClose = () => {
    addToCartRef.current?.close();
    setIsOpen(false);
  };

  const handleAddToCart = () => {
    if (accountState.account) {
      const payload: PostBodyCartInterface = {
        product_id: route.params.id,
        quantity: quantity,
        variant_id: stocksValue?.variant_id || ''
      };

      addToCart(payload);
    } else {
      navigation.push('CartStack', { screen: 'Cart' });
    }
  };

  useEffect(() => {
    if (!isRefetchingProductDetail && !isRefetchingProductRecommended) setIsRefreshScreen(false);
  }, [isRefetchingProductDetail, isRefetchingProductRecommended]);

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

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ['useGetProductDetail', route.params.id] });
      queryClient.invalidateQueries({
        queryKey: ['useGetProductRecommended', productDetail?.data.id]
      });
      queryClient.invalidateQueries({ queryKey: ['useGetNewArrivals'] });
      queryClient.invalidateQueries({ queryKey: ['useGetCategoryList'] });
      queryClient.invalidateQueries({ queryKey: ['useGetCountWishlist'] });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  const handleBackButton = () => {
    if (route.params?.from === 'categories') {
      navigation.navigate('CategoriesStack', { screen: 'Categories' });
    } else if (route.params?.from === 'home') {
      reset('MainBottomTabNavigator');
    } else {
      navigation.canGoBack() ? navigation.goBack() : reset('MainBottomTabNavigator');
    }
  };

  const handleOnWishlistProduct = ({
    id,
    isWishlistValue,
    from
  }: {
    id: string;
    isWishlistValue: boolean;
    from?: 'recommendedProduct' | 'productDetail';
  }) => {
    if (accountState.account?.id) {
      if (isWishlistValue) {
        removeWishlist({ product_ids: [id], from });
      } else {
        addToWishlist({ module: 'products', id, from });
      }
    } else {
      navigation.navigate('WishlistStack');
    }
  };

  const handlePressShareButton = (item: ShareAppInteface) => {
    switch (item.icon) {
      case 'instagram':
        handleShareInstagram();
        break;
      case 'copyLink':
        handleCopyLink();
        break;

      default:
        handleShare(item);
        break;
    }
  };

  const renderShareIcon = () => {
    return (
      <View
        style={{
          paddingVertical: 24,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between'
        }}
      >
        {ShareApp.map((item, index) => (
          <TouchableOpacity
            disabled={!item.name}
            onPress={() => {
              setIsShowModalShare(!isShowModalShare);
              handlePressShareButton(item);
            }}
            style={{
              width: '25%',
              alignItems: 'center',
              marginBottom: 16,
              gap: 4
            }}
            key={index}
          >
            <Icon name={item.icon as IconType} size="42px" />
            <Text label={item.name} color={colors.dark.blackCoral} variant="small" />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <>
      <LayoutScreen
        isNoPadding
        isScrollable
        onRefresh={() => {
          refetchProductDetail();
          refetchProductRecommended();
          setIsRefreshScreen(true);
        }}
      >
        <ProductDetailContainer>
          {isLoadingProductDetail || isRefreshScreen ? (
            <ProductDetailSkeleton />
          ) : (
            <>
              <VideoImageSlider
                currentIndex={currentIndex}
                setCurrentIndex={(index) => {
                  setCurrentIndex(index);
                  setCurrentTime(0);
                  setIsPlaying(false);
                }}
                onEnd={() => {
                  setCurrentTime(0);
                  setIsPlaying(false);
                }}
                data={sliderVideoImage}
                height={360}
                initialShowThumbnail={!isPlaying}
                currentTime={currentTime}
                absoluteIndicator
                isFocused={isFocused}
                onPress={(item) =>
                  navigation.push('ProductStack', {
                    screen: 'VideoImageViewer',
                    params: {
                      data: sliderVideoImage,
                      isThumbnail: true,
                      isMuted: item.isMuted
                    }
                  })
                }
              />
              {allVariantOutOfStock && (
                <OutOfStockContainer>
                  <Icon name="cart" size="16" color={colors.light.whiteSolid} />
                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <Text
                      label={`${t('unavalabileStock')} `}
                      variant="small"
                      color={colors.light.whiteSolid}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('ProductStack', {
                          screen: 'SimilarCatalogue',
                          params: {
                            id: category_id as string,
                            title: ''
                          }
                        })
                      }
                    >
                      <Text
                        label={t('similarProduct')}
                        variant="small"
                        color={colors.light.whiteSolid}
                        style={{
                          textDecorationLine: 'underline',
                          textDecorationColor: colors.light.whiteSolid
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </OutOfStockContainer>
              )}
              <View style={{ paddingHorizontal: 12 }}>
                <Spacer h={24} />
                <Text
                  label={route.params.title}
                  fontWeight="regular"
                  variant="extra-large"
                  color={colors.dark.blackCoral}
                />
                <Spacer h={12} />
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <View
                    style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12 }}
                  >
                    <Text
                      label={price}
                      fontWeight="semi-bold"
                      variant="extra-larger"
                      color={colors.dark.blackCoral}
                    />

                    {isSoldOut ? (
                      <View
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          backgroundColor: colors.red.linenRed,
                          borderRadius: 100
                        }}
                      >
                        <Text
                          label={t('soldOut')}
                          variant="extra-small"
                          color={colors.red.newPink}
                        />
                      </View>
                    ) : (
                      stock !== '-' && (
                        <Text
                          label={`${t('stock')}: ${stock}`}
                          color={colors.dark.bermudaGrey}
                          variant="extra-small"
                        />
                      )
                    )}
                  </View>
                  <TouchableOpacity
                    style={{ width: 24, height: 24 }}
                    onPress={() => {
                      setShareLink(productDetail?.data.dynamic_link || '');
                      setIsShowModalShare(!isShowModalShare);
                    }}
                  >
                    <Icon name="shareIcon" size="24px" />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    borderWidth: 0.5,
                    borderColor: colors.dark.bermudaGrey,
                    marginVertical: 16
                  }}
                />
                {option_sequence?.map((sequence, index) => (
                  <VariantOptions
                    key={index}
                    label={constructLabel(sequence)}
                    sequence={sequence}
                    data={
                      variantOptionData(
                        variant_stock_keys?.options[sequence] as Array<VariantOption>,
                        sequence,
                        available
                      ) || []
                    }
                    active={active[sequence] as VariantActiveState}
                    setActive={setActive}
                  />
                ))}
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <TabButton
                    style={{
                      borderBottomWidth: tabIndex == 0 ? 1 : 0
                    }}
                    onPress={() => setTabIndex(0)}
                  >
                    <Text
                      label={t('description')}
                      fontWeight="semi-bold"
                      color={tabIndex === 0 ? colors.dark.blackCoral : colors.dark.bermudaGrey}
                      textAlign="center"
                    />
                  </TabButton>
                  {productDetail?.data.category_name === 'Rings' && (
                    <TabButton
                      style={{
                        borderBottomWidth: tabIndex == 1 ? 1 : 0
                      }}
                      onPress={() => setTabIndex(1)}
                    >
                      <Text
                        label={'Size Guide'}
                        fontWeight="semi-bold"
                        color={tabIndex === 1 ? colors.dark.blackCoral : colors.dark.bermudaGrey}
                        textAlign="center"
                      />
                    </TabButton>
                  )}
                </View>
                {tabIndex === 0 ? (
                  <RichEditor
                    disabled={true}
                    style={{ marginHorizontal: -5 }}
                    editorStyle={{
                      color: colors.dark.blackCoral,
                      contentCSSText: 'font-size: 14px;line-height:20px;'
                    }}
                    initialContentHTML={description ?? ''}
                  />
                ) : (
                  productDetail?.data.size_guide && (
                    <UserGuide
                      data={productDetail?.data.size_guide}
                      onPressImage={(values) =>
                        navigation.push('ProductStack', {
                          screen: 'VideoImageViewer',
                          params: {
                            data: [{ id: '0', thumbnail: values, type: 'photo' }],
                            isThumbnail: false
                          }
                        })
                      }
                    />
                  )
                )}
                {productRecommended?.data && productRecommended?.data.length > 0 && (
                  <View style={{ borderWidth: 0.5, borderColor: colors.dark.bermudaGrey }} />
                )}
              </View>
            </>
          )}
          {productRecommended?.data && productRecommended?.data.length > 0 && (
            <ProductSection
              data={(productRecommended?.data.slice(0, 5) || []) as Array<ProductCardBaseInterface>}
              label="Recommended Products"
              cardVariant="secondary"
              withCta
              ctaLabel={t('seeAll')}
              wishlistOnPress={(item) =>
                handleOnWishlistProduct({
                  id: item.id,
                  isWishlistValue: item.isWishlist,
                  from: 'recommendedProduct'
                })
              }
              ctaOnPress={() =>
                navigation.push('ProductStack', {
                  screen: 'SimilarCatalogue',
                  params: {
                    id: productDetail?.data.id as string,
                    title: 'Recommended Products'
                  }
                })
              }
              productOnPress={handleOnDetailProduct}
              isLoading={isLoadingProductRecommended || isRefreshScreen}
            />
          )}
        </ProductDetailContainer>
      </LayoutScreen>
      <CartContainer>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            onPress={() =>
              handleOnWishlistProduct({
                id: productDetail?.data.id || '',
                isWishlistValue: !!is_wishlist,
                from: 'productDetail'
              })
            }
            style={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 999,
              borderColor: is_wishlist ? colors.secondary : colors.dark.gumbo,
              backgroundColor: is_wishlist ? colors.secondary : 'transparent',
              borderWidth: 2
            }}
          >
            <Icon
              name={is_wishlist ? 'wishlist' : 'wishlistOutline'}
              size="24"
              color={is_wishlist ? colors.light.whiteSolid : colors.dark.gumbo}
            />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Button
              label={t('addToCart')}
              onPress={onOpen}
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
              isDisable={allVariantOutOfStock || !stocksKey || isStockEmpty}
            />
          </View>
        </View>
      </CartContainer>

      <BottomDrawerCart
        bottomSheetRef={addToCartRef}
        onPressAddToCart={handleAddToCart}
        isMutating={loadingAddToCart}
        labelAddToCart={t('addToCart')}
        onClose={onClose}
        productTitle={route.params.title}
        productImage={sliderVideoImage[0]?.thumbnail}
        price={price}
        stock={stock}
      >
        {option_sequence?.map((sequence, index) => (
          <VariantOptions
            key={index}
            label={constructLabel(sequence)}
            sequence={sequence}
            data={
              variantOptionData(
                variant_stock_keys?.options[sequence] as Array<VariantOption>,
                sequence,
                available
              ) || []
            }
            active={active[sequence] as VariantActiveState}
            setActive={setActive}
          />
        ))}
        <InputQuantity
          label={t('quantity')}
          value={quantity}
          setValue={setQuantity}
          min={1}
          max={isStockEmpty ? 1 : stock}
        />
      </BottomDrawerCart>

      <ModalAlert
        title={showConfirmModal.title}
        description={showConfirmModal.description}
        isVisible={showConfirmModal.open}
        singleBtnLabel={showConfirmModal.singleBtnLabel}
        onCloseModal={() => setShowConfirmModal(initialConfirmModal)}
        onPressYes={showConfirmModal.onOk}
      />

      <ModalBottomSheet
        type={'normal'}
        isVisible={isShowModalShare}
        label="Share Post"
        render={renderShareIcon()}
        onCloseModal={() => setIsShowModalShare(!isShowModalShare)}
        isShowToast={isShowModalShare && isShowToast}
        onClosedToast={() => {
          setShowToast(false);
          setIsError(false);
        }}
        messageToast={toastMessage}
        typeToast={isError ? 'error' : 'success'}
        iconToast={isError ? 'infoCircle' : 'checkCircleOutline'}
      />
    </>
  );
};

export default ProductDetailScreen;
