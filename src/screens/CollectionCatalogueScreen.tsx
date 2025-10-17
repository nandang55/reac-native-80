// TODO: FIX TYPE DATA ANY USE TYPE DATA FROM ALGOLIA
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable react-hooks/exhaustive-deps */
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQueryClient } from '@tanstack/react-query';
import LogoSearchEmpty from 'assets/images/search-empty.svg';
import { BackButton } from 'components/BackButton';
import { ProductCard } from 'components/Card';
import { BottomFilterTriggerComponent } from 'components/Filter/BottomFilterTriggerComponent';
import FilterComponent from 'components/Filter/FilterComponent';
import { SortingComponent } from 'components/Filter/SortingComponent';
import { LayoutScreen } from 'components/layouts';
import { ProductCardSkeleton } from 'components/Skeleton/ProductCardSkeleton';
import { Text } from 'components/Text';
import { gap } from 'constant';
import { AccountContext } from 'contexts/AppAccountContext';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import { useAlgoliaFilters } from 'hooks/Filters/useAlgoliaFilter';
import { useDeleteWishlist } from 'hooks/useDeleteWishlist';
import useGetCollectionById from 'hooks/useGetCollectionById';
import { useGetProductCollections } from 'hooks/useGetProductCollections';
import { usePostAddToWishlist } from 'hooks/usePostAddToWishlist';
import { usePostCheckIsWishlist } from 'hooks/usePostCheckIsWishlist';
import { ProductCardItemInterface } from 'interfaces/ProductInterface';
import { HomeStackParamList } from 'navigators/HomeStackNavigator';
import { reset, RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, Dimensions, Image, View } from 'react-native';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import colors from 'styles/colors';

type CollectionCatalogueScreenNavigatorProps = StackNavigationProp<RootStackParamList>;
type CollectionCatalogueScreenRouteProps = RouteProp<HomeStackParamList, 'CollectionCatalogue'>;

const CollectionCatalogueContainer = styled(View)`
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

const CollectionCatalogueScreen = () => {
  const navigation = useNavigation<CollectionCatalogueScreenNavigatorProps>();
  const { params } = useRoute<CollectionCatalogueScreenRouteProps>();
  const queryClient = useQueryClient();
  const { state: accountState } = useContext(AccountContext);
  const { setIsShowToast, setToastMessage, setType, setIcon } = useContext(ModalToastContext);

  const [productWishlist, setProductWishlist] = useState<Record<string, boolean>>({});
  const [allProductIds, setAllProductIds] = useState<Array<string>>([]);

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
    if (params.from === 'categories') {
      reset('CategoriesStack');
    } else if (params.from === 'home') {
      reset('MainBottomTabNavigator');
    } else {
      navigation.goBack();
    }
  };

  const {
    data,
    filterDatas,
    facetData,
    isLoading,
    isLoadingFilter,
    isShowSortBy,
    isShowFilter,
    filtersCount,
    sortByIndexName,
    facetActive,
    setFilterDatas,
    setIsShowSortBy,
    setIsShowFilter,
    setFilter,
    setFilterCount,
    setSortByIndexName,
    setFacetActive,
    setTempFilterDatas,
    tempFilterDatas,
    setFacetFilter,
    setIsCollectionIds
  } = useAlgoliaFilters();

  const numColumn = 2;
  const availableSpace = Dimensions.get('window').width - (numColumn - 1) * gap - 15;
  const widthCard = availableSpace / numColumn;
  const heightCard = availableSpace / 1.21;

  const { data: dataCollection } = useGetCollectionById({ id: params.id });

  const { fetchNextPage, hasNextPage } = useGetProductCollections({
    id: params.id,
    params: { page: 1, limit: 10 },
    options: { enabled: false }
  });

  const { mutate: checkIsWishlist } = usePostCheckIsWishlist({
    onSuccess: (res) => {
      setProductWishlist(res.data as Record<string, boolean>);
    }
  });

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

  const onRefreshProductCollectionsData = () => {
    setFilter(`collection_ids: ${params.id}`);
    setFilterCount(0);
    setFilterDatas([]);
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

    if (isLoading) {
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
      queryClient.invalidateQueries(['useGetCategoryDetail']);
    }, [])
  );

  useEffect(() => {
    if (params.id) {
      setFilter(`collection_ids: ${params.id}`);
      setFacetFilter(`collection_ids: ${params.id}`);
      setIsCollectionIds(true);
    }
  }, [params.id]);

  useEffect(() => {
    if (data.length > 0 && accountState.account?.id) {
      setAllProductIds(data.map((item) => item.id));
    } else {
      setAllProductIds([]);
    }
  }, [data]);

  return (
    <>
      <LayoutScreen isNoPadding>
        <CollectionCatalogueContainer>
          {isLoading ? (
            <ActivityIndicator />
          ) : data.length > 0 ? (
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
                <Image
                  source={{ uri: dataCollection?.data.image_link }}
                  style={{ width: '100%', height: 162 }}
                />
              }
              ListHeaderComponentStyle={{
                paddingBottom: 12,
                width: '100%'
              }}
              onEndReachedThreshold={0}
              onEndReached={() => {
                if (hasNextPage) {
                  fetchNextPage();
                }
              }}
              ListFooterComponent={isLoading ? <ActivityIndicator /> : <></>}
              refreshControl={
                <RefreshControl
                  refreshing={isLoading}
                  onRefresh={onRefreshProductCollectionsData}
                />
              }
              getItemLayout={(_, index) => ({
                length: heightCard,
                offset: heightCard * index,
                index
              })}
            />
          ) : (
            <>
              <Image
                source={{ uri: dataCollection?.data.image_link }}
                style={{ width: '100%', height: 162 }}
              />
              <RenderEmpty />
            </>
          )}
        </CollectionCatalogueContainer>

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
      </LayoutScreen>
      {isShowFilter && (
        <FilterComponent
          isLoading={isLoadingFilter}
          facetData={facetData}
          filterDatas={filterDatas}
          facetActive={facetActive}
          setFacetActive={(value) => setFacetActive(value)}
          setFilterDatas={(values) => {
            setFilterDatas(values);
          }}
          isVisible={isShowFilter}
          onClosed={() => {
            const bind = filterDatas === tempFilterDatas;

            setFilterDatas(bind ? filterDatas : tempFilterDatas);
            setIsShowFilter(!isShowFilter);
          }}
          onClearAll={() => {
            setIsShowFilter(false);
            setFilter(`collection_ids: ${params.id}`);
            setTempFilterDatas([]);
            setFilterCount(0);
          }}
          onApply={(values, total) => {
            setTempFilterDatas(filterDatas);
            setIsShowFilter(!isShowFilter);
            if (Number(total) > 0) {
              setFilter(`collection_ids: ${params.id} AND ${values}`);
            } else {
              setFilter(`collection_ids: ${params.id}`);
            }
            setFilterCount(Number(total));
          }}
          onFilterFacet={(values, total) => {
            if (Number(total) > 0) {
              setFacetFilter(`collection_ids: ${params.id} AND ${values}`);
            } else {
              setFacetFilter(`collection_ids: ${params.id}`);
            }
          }}
        />
      )}
    </>
  );
};

export default CollectionCatalogueScreen;
