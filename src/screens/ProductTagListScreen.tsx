// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable react-hooks/exhaustive-deps */
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQueryClient } from '@tanstack/react-query';
import LogoSearchEmpty from 'assets/images/search-empty.svg';
import { ProductCard } from 'components/Card';
import { BottomFilterTriggerComponent } from 'components/Filter/BottomFilterTriggerComponent';
import FilterComponent from 'components/Filter/FilterComponent';
import { SortingComponent } from 'components/Filter/SortingComponent';
import { LayoutScreen } from 'components/layouts';
import { ProductCardSkeleton } from 'components/Skeleton/ProductCardSkeleton';
import { ImageSlider } from 'components/Slider';
import { Text } from 'components/Text';
import { gap } from 'constant';
import { AccountContext } from 'contexts/AppAccountContext';
import { LoadingContext } from 'contexts/AppLoadingContext';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import { useAlgoliaFilters } from 'hooks/Filters/useAlgoliaFilter';
import { useDeleteWishlist } from 'hooks/useDeleteWishlist';
import useGetProductTagList from 'hooks/useGetProductTagList';
import useGetTagsDetail from 'hooks/useGetTagsDetail';
import { usePostAddToWishlist } from 'hooks/usePostAddToWishlist';
import { usePostCheckIsWishlist } from 'hooks/usePostCheckIsWishlist';
import { ProductCardItemInterface } from 'interfaces/ProductInterface';
import { CategoriesStackParamList } from 'navigators/CategoriesStackNavigator';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, Dimensions, View } from 'react-native';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import colors from 'styles/colors';

type ProductTagListScreenNavigatorProps = StackNavigationProp<RootStackParamList>;
type ProductTagListScreenRouteProps = RouteProp<CategoriesStackParamList, 'ProductTagList'>;

const ProductTagListContainer = styled(View)`
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

const ProductTagListScreen = () => {
  const navigation = useNavigation<ProductTagListScreenNavigatorProps>();
  const { params } = useRoute<ProductTagListScreenRouteProps>();
  const queryClient = useQueryClient();
  const { state: accountState } = useContext(AccountContext);
  const { setIsShowToast, setToastMessage, setType, setIcon } = useContext(ModalToastContext);

  const [productWishlist, setProductWishlist] = useState<Record<string, boolean>>({});
  const [allProductIds, setAllProductIds] = useState<Array<string>>([]);

  const { setLoading } = useContext(LoadingContext);

  const {
    data,
    filtersCount,
    facetData,
    filterDatas,
    isShowFilter,
    isShowSortBy,
    isLoading,
    isLoadingFilter,
    sortByIndexName,
    facetActive,
    setFacetActive,
    setIsShowSortBy,
    setIsShowFilter,
    setFilter,
    setFilterDatas,
    setFilterCount,
    setSortByIndexName,
    setTempFilterDatas,
    tempFilterDatas,
    setFacetFilter,
    setIsTag
  } = useAlgoliaFilters();

  const numColumn = 2;
  const availableSpace = Dimensions.get('window').width - (numColumn - 1) * gap - 15;
  const widthCard = availableSpace / numColumn;
  const heightCard = availableSpace / 1.21;

  const { data: tagDetailData, isLoading: tagDetailLoading } = useGetTagsDetail({
    tag: params.tag,
    options: {
      onSuccess: (res) => {
        if (!res.error) {
          navigation.setParams({ title: res.data.name });
        }
      }
    }
  });

  const {
    isFetching: productTagListFetching,
    fetchNextPage,
    hasNextPage
  } = useGetProductTagList({
    tag: params.tag,
    params: { page: 1, limit: 10 },
    options: { enabled: false }
  });

  const { mutate: checkIsWishlist } = usePostCheckIsWishlist({
    onSuccess: (res) => {
      setProductWishlist(res.data as Record<string, boolean>);
    }
  });

  useEffect(() => {
    if (params.title) {
      setFilter(`tags:"${params.title}"`);
      setFacetFilter(`tags: ${params.title}`);
      setIsTag(true);
    }
  }, []);

  const { mutate: addToWishlist } = usePostAddToWishlist({
    onMutate: async ({ id: productId }) => {
      const previousWishlist = { ...productWishlist };

      const updatedWishlist = { ...productWishlist };
      if (!updatedWishlist[productId]) {
        updatedWishlist[productId] = true;
      }

      setProductWishlist(updatedWishlist);
      return previousWishlist;
    },
    onError: (_err, _newData, previousWishlist) => {
      setProductWishlist(previousWishlist as Record<string, boolean>);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetCountWishlist'] });
    },
    onSuccess: (res) => {
      checkIsWishlist({ product_ids: allProductIds });
      setIsShowToast(true);
      setType('success');
      setToastMessage(res.message || '');
      setIcon('checkCircleOutline');
    }
  });

  const { mutate: removeWishlist } = useDeleteWishlist({
    onMutate: async ({ product_ids }) => {
      const previousWishlist = { ...productWishlist };

      const updatedWishlist = { ...productWishlist };
      if (updatedWishlist[product_ids[0]]) {
        delete updatedWishlist[product_ids[0]];
      }

      setProductWishlist(updatedWishlist);
      return previousWishlist;
    },
    onError: (_err, _newData, previousWishlist) => {
      setProductWishlist(previousWishlist as Record<string, boolean>);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetCountWishlist'] });
    },
    onSuccess: (res) => {
      checkIsWishlist({ product_ids: allProductIds });
      setIsShowToast(true);
      setType('success');
      setToastMessage(res.message || '');
      setIcon('checkCircleOutline');
    }
  });

  const handleOnDetailProduct = ({ id, title }: { id: string; title: string }) => {
    navigation.push('ProductStack', { screen: 'ProductDetail', params: { id, title } });
  };

  const onRefreshproductTagListData = () => {
    setFilter(`tags:"${params.title}"`);
    setFilterCount(0);
    setFilterDatas([]);
    setTempFilterDatas([]);
  };

  useFocusEffect(
    useCallback(() => {
      if (allProductIds.length > 0 && accountState.account?.id) {
        checkIsWishlist({ product_ids: allProductIds });
      }
    }, [allProductIds])
  );

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

    if (productTagListFetching) {
      return <ProductCardSkeleton style={{ width: widthCard, minHeight: heightCard }} />;
    }

    return (
      <ProductCard
        {...item}
        variant="primary"
        isWishlist={productWishlist[item.id] === true}
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

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries(['useGetProductTagList']);
    }, [])
  );

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (data.length > 0 && accountState.account?.id) {
      setAllProductIds(data.map((item) => item.id));
    } else {
      setAllProductIds([]);
    }
  }, [data]);

  useEffect(
    () => setLoading(isLoading || tagDetailLoading),
    [isLoading, tagDetailLoading, setLoading]
  );

  return (
    <LayoutScreen isNoPadding>
      {(!isLoading || !tagDetailLoading) && (
        <ProductTagListContainer>
          {!isLoading && data.length > 0 ? (
            <FlatList
              data={
                formatData(data.flatMap((item) => item) || [], 2) as Array<ProductCardItemInterface>
              }
              renderItem={renderItem}
              keyExtractor={(item: ProductCardItemInterface) => item.id}
              numColumns={2}
              scrollEnabled
              contentContainerStyle={{
                gap,
                alignItems: 'center',
                justifyContent: 'center',
                paddingBottom: 12
              }}
              columnWrapperStyle={{ gap }}
              ListHeaderComponent={
                tagDetailData?.data.banners && tagDetailData?.data.banners.length > 0 ? (
                  <ImageSlider
                    data={tagDetailData?.data.banners || []}
                    height={152}
                    absoluteIndicator
                  />
                ) : (
                  <></>
                )
              }
              ListHeaderComponentStyle={{ width: '100%', paddingBottom: 12 }}
              onEndReachedThreshold={0}
              onEndReached={() => {
                if (hasNextPage) {
                  fetchNextPage();
                }
              }}
              ListFooterComponent={productTagListFetching ? <ActivityIndicator /> : <></>}
              refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={onRefreshproductTagListData} />
              }
              getItemLayout={(_, index) => ({
                length: heightCard,
                offset: heightCard * index,
                index
              })}
            />
          ) : (
            <>
              {tagDetailData?.data.banners && tagDetailData?.data.banners.length > 0 ? (
                <ImageSlider
                  data={tagDetailData?.data.banners || []}
                  height={152}
                  absoluteIndicator
                />
              ) : (
                <></>
              )}
              {!isLoading && <RenderEmpty />}
            </>
          )}
        </ProductTagListContainer>
      )}
      {(data.length > 0 || filtersCount > 0) && (
        <BottomFilterTriggerComponent
          sortLabel={sortByIndexName.label}
          filterCount={filtersCount}
          onPress={(values) => {
            if (values === 'sorting') {
              setIsShowSortBy(!isShowSortBy);
            } else {
              setIsShowFilter(!isShowFilter);
            }
          }}
        />
      )}
      <SortingComponent
        isVisible={isShowSortBy}
        onClosed={() => setIsShowSortBy(!isShowSortBy)}
        sortByIndexName={sortByIndexName.value}
        setSortByIndexName={(values) => setSortByIndexName(values)}
      />
      {isShowFilter && (
        <FilterComponent
          isLoading={isLoadingFilter}
          facetActive={facetActive}
          facetData={facetData}
          filterDatas={filterDatas}
          setFilterDatas={(values) => {
            setFilterDatas(values);
          }}
          setFacetActive={(values) => setFacetActive(values)}
          isVisible={isShowFilter}
          onClosed={() => {
            const bind = filterDatas === tempFilterDatas;

            setFilterDatas(bind ? filterDatas : tempFilterDatas);
            setIsShowFilter(!isShowFilter);
          }}
          onClearAll={() => {
            setIsShowFilter(false);
            setFilter(`tags:"${params.title}"`);

            setTempFilterDatas([]);
            setFilterCount(0);
          }}
          onFilterFacet={(values, total) => {
            if (Number(total) > 0) {
              setFacetFilter(`tags: ${params.title} AND ${values}`);
            } else {
              setFacetFilter(`tags: ${params.title}`);
            }
          }}
          onApply={(values, total) => {
            setTempFilterDatas(filterDatas);
            setIsShowFilter(!isShowFilter);
            if (Number(total) > 0) {
              setFilter(`tags:"${params.title}" AND ${values}`);
            } else {
              setFilter(`tags:"${params.title}"`);
            }
            setFilterCount(Number(total));
          }}
        />
      )}
    </LayoutScreen>
  );
};

export default ProductTagListScreen;
