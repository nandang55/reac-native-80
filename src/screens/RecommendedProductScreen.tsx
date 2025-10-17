// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQueryClient } from '@tanstack/react-query';
import LogoSearchEmpty from 'assets/images/search-empty.svg';
import { ProductCard } from 'components/Card';
import { LayoutScreen } from 'components/layouts';
import { ProductCardSkeleton } from 'components/Skeleton/ProductCardSkeleton';
import { Text } from 'components/Text';
import { gap } from 'constant';
import { AccountContext } from 'contexts/AppAccountContext';
import { LoadingContext } from 'contexts/AppLoadingContext';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import { useDeleteWishlist } from 'hooks/useDeleteWishlist';
import useGetProductRecommended from 'hooks/useGetProductRecommended';
import { usePostAddToWishlist } from 'hooks/usePostAddToWishlist';
import { APIResponse } from 'interfaces/BaseAPIResponse';
import { ProductCardItemInterface, ProductItemInterface } from 'interfaces/ProductInterface';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import colors from 'styles/colors';

type RecommendedProductScreenNavigatorProps = StackNavigationProp<RootStackParamList>;
type RouteParams = {
  id: string;
};

const CategoryCatalogueContainer = styled(View)`
  background-color: white;
  flex: 1;
`;

const SearchEmptyContainer = styled(View)`
  background-color: ${colors.light.whiteSolid};
  gap: 12px;
  height: 80%;
  justify-content: center;
  padding: 0 50px;
`;

const RecommendedProductScreen = () => {
  const navigation = useNavigation<RecommendedProductScreenNavigatorProps>();
  const route = useRoute();
  const { id: productDetailId } = route.params as RouteParams;
  const queryClient = useQueryClient();

  const { state: accountState } = useContext(AccountContext);
  const { setIsShowToast, setToastMessage, setType, setIcon } = useContext(ModalToastContext);
  const { setLoading } = useContext(LoadingContext);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: productRecommended,
    isLoading: isLoadingProductRecommended,
    refetch: refetchProductRecommended
  } = useGetProductRecommended({
    id: productDetailId,
    options: {
      onSettled: () => setIsRefreshing(false)
    }
  });

  const { mutate: addToWishlist } = usePostAddToWishlist({
    onMutate: async ({ id: productId }) => {
      const previousDataList = queryClient.getQueryData([
        'useGetProductRecommended',
        productDetailId
      ]);

      queryClient.setQueryData<APIResponse<Array<ProductItemInterface>>>(
        ['useGetProductRecommended', productDetailId],
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
    },
    onError: (_err, _newData, previousDataList) => {
      queryClient.setQueryData(['useGetProductRecommended', productDetailId], previousDataList);
    },
    onSettled: () => {
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
    onMutate: async ({ product_ids }) => {
      const previousDataList = queryClient.getQueryData([
        'useGetProductRecommended',
        productDetailId
      ]);

      queryClient.setQueryData<APIResponse<Array<ProductItemInterface>>>(
        ['useGetProductRecommended', productDetailId],
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
    },
    onError: (_err, _newData, previousDataList) => {
      queryClient.setQueryData(['useGetProductRecommended', productDetailId], previousDataList);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetCountWishlist'] });
    },
    onSuccess: (res) => {
      setIsShowToast(true);
      setType('success');
      setToastMessage(res.message || '');
      setIcon('checkCircleOutline');
    }
  });

  const numColumn = 2;
  const availableSpace = Dimensions.get('window').width - (numColumn - 1) * gap - 15;
  const widthCard = availableSpace / numColumn;
  const heightCard = availableSpace / 1.25;

  const handleOnDetailProduct = ({ id, title }: { id: string; title: string }) => {
    navigation.push('ProductStack', {
      screen: 'ProductDetail',
      params: { id, title }
    });
  };

  const formatData = (data_: Array<Partial<ProductCardItemInterface>>, numColumns: number) => {
    const isOddLength = data_.length % numColumns !== 0;
    if (isOddLength) {
      return [...data_, { id: 'blank', empty: true }];
    } else {
      return data_;
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    refetchProductRecommended();
  };

  const handleOnWishlistProduct = ({ id, isWishlist }: { id: string; isWishlist: boolean }) => {
    if (accountState.account?.id) {
      if (isWishlist) {
        removeWishlist({ product_ids: [id] });
      } else {
        addToWishlist({ module: 'products', id });
      }
    } else {
      navigation.navigate('WishlistStack');
    }
  };

  const renderItem = ({ item }: { item: ProductCardItemInterface }) => {
    if (item.empty) {
      return <View style={{ width: widthCard, height: heightCard }} />;
    }

    if (isLoadingProductRecommended) {
      return <ProductCardSkeleton style={{ width: widthCard, minHeight: heightCard }} />;
    }

    return (
      <ProductCard
        {...item}
        isWishlist={item.is_wishlist}
        variant="primary"
        productOnPress={handleOnDetailProduct}
        buttonOnPress={handleOnDetailProduct}
        wishlistOnPress={handleOnWishlistProduct}
        cardStyle={{
          width: widthCard,
          minHeight: heightCard
        }}
      />
    );
  };

  const RenderEmpty = () => {
    return (
      <SearchEmptyContainer>
        <LogoSearchEmpty width="100%" />
        <Text
          label={'No Result Found'}
          color={colors.dark.blackCoral}
          variant="medium"
          textAlign="center"
          fontWeight="semi-bold"
        />
      </SearchEmptyContainer>
    );
  };

  useEffect(
    () => setLoading(isLoadingProductRecommended),
    [isLoadingProductRecommended, setLoading]
  );

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries(['useGetProductRecommended', productDetailId]);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  return (
    <LayoutScreen isNoPadding>
      <CategoryCatalogueContainer>
        <FlatList
          data={formatData(productRecommended?.data || [], 2) as Array<ProductCardItemInterface>}
          renderItem={renderItem}
          keyExtractor={(item: ProductCardItemInterface) => item.id}
          numColumns={2}
          scrollEnabled
          contentContainerStyle={{
            gap,
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 12,
            paddingTop: 16
          }}
          columnWrapperStyle={{ gap }}
          ListHeaderComponentStyle={{ paddingBottom: 12, width: '100%' }}
          onEndReachedThreshold={0}
          ListEmptyComponent={!isLoadingProductRecommended ? <RenderEmpty /> : null}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
          getItemLayout={(_, index) => ({
            length: heightCard,
            offset: heightCard * index,
            index
          })}
        />
      </CategoryCatalogueContainer>
    </LayoutScreen>
  );
};

export default RecommendedProductScreen;
