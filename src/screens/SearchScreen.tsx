// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
/* eslint-disable eslint-comments/disable-enable-pair */
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
import { Loading } from 'components/Loading';
import { SearchTrigger } from 'components/Search';
import { ProductCardSkeleton } from 'components/Skeleton/ProductCardSkeleton';
import { Text } from 'components/Text';
import { gap } from 'constant';
import { AccountContext } from 'contexts/AppAccountContext';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import { useAlgoliaFilters } from 'hooks/Filters/useAlgoliaFilter';
import { useDeleteWishlist } from 'hooks/useDeleteWishlist';
import { usePostAddToWishlist } from 'hooks/usePostAddToWishlist';
import { usePostCheckIsWishlist } from 'hooks/usePostCheckIsWishlist';
import { ProductCardItemInterface } from 'interfaces/ProductInterface';
import { reset, RootStackParamList } from 'navigators/RootStackNavigator';
import { SearchStackPropsNavigator } from 'navigators/SearchStackNavigator';
import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useInfiniteHits, useSearchBox } from 'react-instantsearch-core';
import { BackHandler, Dimensions, FlatList, View } from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';

type SearchNavigationProps = StackNavigationProp<RootStackParamList>;
type SearchRouteProps = RouteProp<SearchStackPropsNavigator, 'Search'>;

const SearchEmptyContainer = styled(View)`
  background-color: ${colors.light.whiteSolid};
  gap: 12px;
  height: 80%;
  justify-content: center;
  padding: 0 50px;
`;

export const SearchScreen = () => {
  const navigation = useNavigation<SearchNavigationProps>();
  const route = useRoute<SearchRouteProps>();
  const queryClient = useQueryClient();
  const { state: accountState } = useContext(AccountContext);
  const { setIsShowToast, setToastMessage, setType, setIcon } = useContext(ModalToastContext);

  const [productWishlist, setProductWishlist] = useState<Record<string, boolean>>({});
  const [allProductIds, setAllProductIds] = useState<Array<string>>([]);

  const { query, from } = route.params;

  const numColumn = 2;
  const availableSpace = Dimensions.get('window').width - (numColumn - 1) * gap - 15;
  const widthCard = availableSpace / numColumn;
  const heightCard = availableSpace / 1.21;

  const { clear } = useSearchBox();

  const {
    data,
    filterDatas,
    facetData,
    isLoading: LoadingAlgoliaFilters,
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
    setQuery,
    setFacetActive,
    setTempFilterDatas,
    tempFilterDatas,
    setFacetFilter
  } = useAlgoliaFilters();

  const { isLastPage, showMore } = useInfiniteHits<ProductCardItemInterface>({
    escapeHTML: false
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

    if (LoadingAlgoliaFilters) {
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
        <Text
          label={'Please use more general keyword.'}
          color={colors.dark.gumbo}
          variant="medium"
          textAlign="center"
        />
      </SearchEmptyContainer>
    );
  };

  const handleOnDetailProduct = ({ id, title }: { id: string; title: string }) => {
    navigation.push('ProductStack', { screen: 'ProductDetail', params: { id, title } });
  };

  useFocusEffect(
    useCallback(() => {
      if (allProductIds.length > 0 && accountState.account?.id) {
        checkIsWishlist({ product_ids: allProductIds });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allProductIds])
  );

  useFocusEffect(
    useCallback(() => {
      if (query) {
        setQuery(query);
      }
    }, [query, setQuery])
  );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleBackButton();
      return true;
    });

    return () => backHandler.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  useEffect(() => {
    if (data.length > 0 && accountState.account?.id) {
      setAllProductIds(data.map((item) => item.id));
    } else {
      setAllProductIds([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton onPress={handleBackButton} tintColor="white" />
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const handleBackButton = () => {
    if (from === 'categories') {
      navigation.navigate('CategoriesStack', { screen: 'Categories' });
    } else {
      reset('MainBottomTabNavigator');
    }
    clear();
  };

  return (
    <>
      <LayoutScreen isNoPadding>
        <View style={{ flex: 1, backgroundColor: colors.light.whiteSolid }}>
          <SearchTrigger
            value={query}
            onPress={() => {
              navigation.goBack();
              clear();
            }}
            withClear
          />
          {LoadingAlgoliaFilters ? (
            <Loading visible={true} size="large" />
          ) : data.length > 0 ? (
            <FlatList
              data={formatData(data || [], 2) as Array<ProductCardItemInterface>}
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
              onEndReached={() => {
                if (!isLastPage) {
                  showMore();
                }
              }}
              getItemLayout={(_, index) => ({
                length: heightCard,
                offset: heightCard * index,
                index
              })}
            />
          ) : (
            <RenderEmpty />
          )}
        </View>

        {(data.length > 0 || filtersCount > 0) && (
          <>
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
            <SortingComponent
              isVisible={isShowSortBy}
              onClosed={() => setIsShowSortBy(!isShowSortBy)}
              sortByIndexName={sortByIndexName.value}
              setSortByIndexName={(values) => setSortByIndexName(values)}
            />
          </>
        )}
      </LayoutScreen>
      {isShowFilter && (
        <FilterComponent
          isLoading={isLoadingFilter}
          facetData={facetData}
          filterDatas={filterDatas}
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
            setFilter('');
            setFilterCount(0);
            setTempFilterDatas([]);
          }}
          onApply={(values, total) => {
            setTempFilterDatas(filterDatas);
            setIsShowFilter(!isShowFilter);
            if (Number(total) > 0) {
              setFilter(values);
            } else {
              setFilter('');
            }
            setFilterCount(Number(total));
          }}
          onFilterFacet={(values, total) => {
            if (Number(total) > 0) {
              setFacetFilter(`${values}`);
            } else {
              setFacetFilter('');
            }
          }}
          facetActive={facetActive}
          setFacetActive={(values) => setFacetActive(values)}
        />
      )}
    </>
  );
};
