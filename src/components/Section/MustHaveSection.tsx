// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQueryClient } from '@tanstack/react-query';
import { ProductCard } from 'components/Card';
import { ProductCardSkeleton } from 'components/Skeleton/ProductCardSkeleton';
import { Text } from 'components/Text';
import { AccountContext } from 'contexts/AppAccountContext';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import { useDeleteWishlist } from 'hooks/useDeleteWishlist';
import { useGetProductBundle } from 'hooks/useGetProductBundle';
import { usePostAddToWishlist } from 'hooks/usePostAddToWishlist';
import { ProductCardItemInterface, ProductItemInterface } from 'interfaces/ProductInterface';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useContext } from 'react';
import { Dimensions, FlatList, View } from 'react-native';
import colors from 'styles/colors';

type MustHaveSectionScreenNavigatorProps = StackNavigationProp<RootStackParamList>;

export const MustHaveSection = () => {
  const navigation = useNavigation<MustHaveSectionScreenNavigatorProps>();
  const gap = 12;

  const numColumn = 2;
  const availableSpace = Dimensions.get('window').width - (numColumn - 1) * gap - 42;
  const widthCard = availableSpace / numColumn;
  const heightCard = availableSpace / 1.5;

  const queryClient = useQueryClient();

  const { state: accountState } = useContext(AccountContext);
  const { setIsShowToast, setToastMessage, setType, setIcon } = useContext(ModalToastContext);

  const { data, isLoading } = useGetProductBundle({});

  const { mutate: addToWishlist } = usePostAddToWishlist({
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries(['useGetProductBundle']);

      const previousWishlist = queryClient.getQueryData(['useGetProductBundle']);

      queryClient.setQueryData(['useGetProductBundle'], (oldWishlist: any) => {
        if (!oldWishlist || !oldWishlist.data) return oldWishlist;

        return {
          ...oldWishlist,
          data: oldWishlist.data.map((item: ProductItemInterface) =>
            item.id === id ? { ...item, is_wishlist: true } : item
          )
        };
      });

      return { previousWishlist };
    },
    onError: (_err, _newData, context: any) => {
      queryClient.setQueryData(['useGetProductBundle'], context.previousWishlist);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetCountWishlist'] });
      queryClient.invalidateQueries({ queryKey: ['useGetCartList'] });
      queryClient.invalidateQueries({ queryKey: ['useGetProductBundle'] });
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
      await queryClient.cancelQueries(['useGetProductBundle']);

      const previousWishlist = queryClient.getQueryData(['useGetProductBundle']);

      queryClient.setQueryData(['useGetProductBundle'], (oldWishlist: any) => {
        if (!oldWishlist || !oldWishlist.data) return oldWishlist;

        return {
          ...oldWishlist,
          data: oldWishlist.data.map((item: ProductItemInterface) =>
            item.id === product_ids[0] ? { ...item, is_wishlist: false } : item
          )
        };
      });

      return { previousWishlist };
    },
    onError: (_err, _newData, context: any) => {
      queryClient.setQueryData(['useGetProductBundle'], context.previousWishlist);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetCountWishlist'] });
      queryClient.invalidateQueries({ queryKey: ['useGetCartList'] });
      queryClient.invalidateQueries({ queryKey: ['useGetProductBundle'] });
    },
    onSuccess: (res) => {
      setIsShowToast(true);
      setType('success');
      setToastMessage(res.message || '');
      setIcon('checkCircleOutline');
    }
  });

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

    if (isLoading) {
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

  if (data?.data.length === 0) return null;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={formatData(data?.data || [], 2) as Array<ProductCardItemInterface>}
        renderItem={renderItem}
        keyExtractor={(item: ProductCardItemInterface) => item.id}
        numColumns={2}
        nestedScrollEnabled
        contentContainerStyle={{
          gap,
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingBottom: 12
        }}
        columnWrapperStyle={{ gap, marginVertical: gap - 4, marginHorizontal: gap - 9 }}
        ListHeaderComponent={
          <Text
            label="Must Have"
            color={colors.dark.blackCoral}
            variant="medium"
            fontWeight="semi-bold"
          />
        }
        ListHeaderComponentStyle={{ paddingBottom: 2, paddingTop: 24, width: '100%' }}
        getItemLayout={(_, index) => ({
          length: heightCard,
          offset: heightCard * index,
          index
        })}
        removeClippedSubviews
      />
    </View>
  );
};
