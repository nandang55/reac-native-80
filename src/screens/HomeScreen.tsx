// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQueryClient } from '@tanstack/react-query';
import { ProductCardBaseInterface } from 'components/Card/ProductCard.type';
import { LayoutScreen } from 'components/layouts';
import { SearchTrigger } from 'components/Search';
import { CategoryGridSection, ProductSection } from 'components/Section';
import { CollectionSection } from 'components/Section/CollectionSection';
import { ImageSlider } from 'components/Slider';
import { AccountContext } from 'contexts/AppAccountContext';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import { useDeleteWishlist } from 'hooks/useDeleteWishlist';
import useGetBanners from 'hooks/useGetBanners';
import useGetCategoryList from 'hooks/useGetCategoryList';
import useGetCollections from 'hooks/useGetCollections';
import useGetNewArrivals from 'hooks/useGetNewArrivals';
import { ProductCategoriesResponse, useGetProductCategories } from 'hooks/useGetProductCategories';
import { usePostAddToWishlist } from 'hooks/usePostAddToWishlist';
import { APIResponse } from 'interfaces/BaseAPIResponse';
import { ProductItemInterface } from 'interfaces/ProductInterface';
import { HomeStackParamList } from 'navigators/HomeStackNavigator';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';

type HomeScreenProps = StackNavigationProp<HomeStackParamList & RootStackParamList>;

const HomeContainer = styled(View)`
  background-color: white;
  flex: 1;
  padding-bottom: 10px;
`;

const HomeScreen = () => {
  const isIos = Platform.OS === 'ios';
  const queryClient = useQueryClient();
  const navigation = useNavigation<HomeScreenProps>();
  const { state: accountState } = useContext(AccountContext);
  const { setIsShowToast, setToastMessage, setType, setIcon } = useContext(ModalToastContext);

  const [isRefreshScreen, setIsRefreshScreen] = useState<boolean>(false);
  const [categoriesId, setCategoriesId] = useState<Array<string>>();
  const [productCategoriesList, setProductCategoriesList] = useState<
    Array<ProductCategoriesResponse>
  >([]);

  const { data: dataBanner } = useGetBanners({});

  const { t } = useTranslation(['home']);

  const {
    data: dataNewArrivals,
    isLoading: loadingNewArrivals,
    isFetching: fetchingNewArrivals,
    refetch: refetchNewArrivals
  } = useGetNewArrivals({});

  const {
    data: dataCollections,
    isLoading: loadingCollections,
    isFetching: fetchingCollections,
    refetch: refetchCollections
  } = useGetCollections({});

  const {
    data: dataCategoryList,
    isLoading: loadingCategoryList,
    isFetching: fetchingCategoryList,
    refetch: refetchCategoryList
  } = useGetCategoryList({
    options: {
      onSuccess: (response) => {
        const temp: Array<string> = [];
        response.data.map((e) => temp.push(e.id));
        setCategoriesId(temp);
      }
    }
  });

  const { refetch: refetchProductCategoriesList } = useGetProductCategories({
    id: categoriesId || [],
    params: { page: 1, limit: 5 },
    options: {
      enabled: false,
      onSuccess: (res) => {
        if (res.length) {
          setProductCategoriesList(res);
        }
      }
    }
  });

  const { mutate: addToWishlist } = usePostAddToWishlist({
    // eslint-disable-next-line sonarjs/cognitive-complexity
    onMutate: async ({ id: productId, from }) => {
      if (from === 'newArrivals') {
        const previousDataList = queryClient.getQueryData(['useGetNewArrivals']);

        queryClient.setQueryData<APIResponse<Array<ProductItemInterface>>>(
          ['useGetNewArrivals'],
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
      } else {
        const previousDataList = [...productCategoriesList];

        const updatedProductCategories = productCategoriesList.map((itemLevel1) => {
          if (!itemLevel1.data || !Array.isArray(itemLevel1.data.data)) {
            return itemLevel1;
          }

          const updatedData = itemLevel1.data.data.map((itemLevel2) =>
            itemLevel2.id === productId ? { ...itemLevel2, is_wishlist: true } : itemLevel2
          );

          return {
            ...itemLevel1,
            data: {
              ...itemLevel1.data,
              data: updatedData
            }
          };
        });

        setProductCategoriesList(updatedProductCategories);
        return previousDataList;
      }
    },
    onError: (_err, { from }, previousDataList) => {
      if (from === 'newArrivals') {
        queryClient.setQueryData(['useGetNewArrivals'], previousDataList);
      } else {
        setProductCategoriesList(previousDataList as Array<ProductCategoriesResponse>);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetNewArrivals'] });
      queryClient.invalidateQueries({ queryKey: ['useGetCountWishlist'] });
      refetchProductCategoriesList();
    },
    onSuccess: (res) => {
      setIsShowToast(true);
      setType('success');
      setToastMessage(res.message || '');
      setIcon('checkCircleOutline');
    }
  });

  const { mutate: removeWishlist } = useDeleteWishlist({
    // eslint-disable-next-line sonarjs/cognitive-complexity
    onMutate: async ({ product_ids, from }) => {
      if (from === 'newArrivals') {
        const previousDataList = queryClient.getQueryData(['useGetNewArrivals']);

        queryClient.setQueryData<APIResponse<Array<ProductItemInterface>>>(
          ['useGetNewArrivals'],
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
      } else {
        const previousDataList = [...productCategoriesList];

        const updatedProductCategories = productCategoriesList.map((itemLevel1) => {
          if (!itemLevel1.data || !Array.isArray(itemLevel1.data.data)) {
            return itemLevel1;
          }

          const updatedData = itemLevel1.data.data.map((itemLevel2) =>
            itemLevel2.id === product_ids[0] ? { ...itemLevel2, is_wishlist: false } : itemLevel2
          );

          return {
            ...itemLevel1,
            data: {
              ...itemLevel1.data,
              data: updatedData
            }
          };
        });

        setProductCategoriesList(updatedProductCategories);
        return previousDataList;
      }
    },
    onError: (_err, { from }, previousDataList) => {
      if (from === 'newArrivals') {
        queryClient.setQueryData(['useGetNewArrivals'], previousDataList);
      } else {
        setProductCategoriesList(previousDataList as Array<ProductCategoriesResponse>);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetNewArrivals'] });
      refetchProductCategoriesList();
      queryClient.invalidateQueries({ queryKey: ['useGetCountWishlist'] });
    },
    onSuccess: (res) => {
      setIsShowToast(true);
      setType('success');
      setToastMessage(res.message || '');
      setIcon('checkCircleOutline');
    }
  });

  const handleOnDetailProduct = ({ id, title }: { id: string; title: string }) => {
    navigation.navigate('ProductStack', { screen: 'ProductDetail', params: { id, title } });
  };

  const handleOnDetailCategory = ({ id, title }: { id: string; title: string }) => {
    navigation.navigate('CategoryCatalogue', { title, id });
  };

  const handleOnDetailBanner = ({ title, id }: { id: string; title: string }) => {
    navigation.navigate('CollectionCatalogue', {
      title,
      id
    });
  };

  const handleOnWishlistProduct = ({
    id,
    isWishlist,
    from
  }: {
    id: string;
    isWishlist: boolean;
    from?: 'newArrivals' | 'categories';
  }) => {
    if (accountState.account?.id) {
      if (isWishlist) {
        removeWishlist({ product_ids: [id], from });
      } else {
        addToWishlist({ module: 'products', id, from });
      }
    } else {
      navigation.navigate('WishlistStack');
    }
  };

  useEffect(() => {
    if (categoriesId) {
      refetchProductCategoriesList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesId]);

  useEffect(() => {
    if (!fetchingNewArrivals) setIsRefreshScreen(false);
  }, [fetchingNewArrivals]);

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ['useGetNewArrivals'] });
      queryClient.invalidateQueries({ queryKey: ['useGetCountWishlist'] });
      refetchProductCategoriesList();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  return (
    <LayoutScreen
      statusBarColor={colors.primary}
      isNoPadding
      isScrollable
      backgroundColor={colors.light.whiteSolid}
      onRefresh={() => {
        refetchCategoryList();
        refetchNewArrivals();
        refetchCollections();
        setIsRefreshScreen(true);
      }}
    >
      <HomeContainer>
        <SearchTrigger
          value="Search by category, product & more..."
          onPress={() => navigation.push('SearchSuggestion', { from: 'home' })}
        />
        <ImageSlider
          data={dataBanner?.data.banners || []}
          height={151}
          autoplay
          absoluteIndicator
          displayDuration={Number(dataBanner?.data.display_duration) * 1000}
        />
        <CategoryGridSection
          data={dataCategoryList?.data || []}
          isLoading={loadingCategoryList || fetchingCategoryList}
          productOnPress={handleOnDetailCategory}
          wrapperStyle={{ paddingTop: isIos ? 12 : 0 }}
        />
        {dataCollections?.data && dataCollections?.data.length > 0 && (
          <CollectionSection
            data={dataCollections?.data.filter((item) => Boolean(item.image_link)) || []}
            label="Special Collections"
            bannerOnPress={handleOnDetailBanner}
            labelStyle={{ paddingLeft: 12 }}
            isLoading={loadingCollections || fetchingCollections}
          />
        )}
        <ProductSection
          data={(dataNewArrivals?.data || []) as Array<ProductCardBaseInterface>}
          label={t('home:newArrivals')}
          cardVariant="primary"
          productOnPress={handleOnDetailProduct}
          wishlistOnPress={(item) => handleOnWishlistProduct({ ...item, from: 'newArrivals' })}
          isLoading={loadingNewArrivals || isRefreshScreen}
        />
        {productCategoriesList?.map((e, index) => {
          const label = dataCategoryList?.data[index].name || '';
          return (
            <ProductSection
              key={index}
              data={(e.data.data || []) as Array<ProductCardBaseInterface>}
              label={label}
              cardVariant="primary"
              withCta
              ctaLabel={t('home:seeAll')}
              ctaOnPress={() =>
                navigation.navigate('CategoryCatalogue', { title: label, id: e.categoryId })
              }
              productOnPress={handleOnDetailProduct}
              wishlistOnPress={(item) => handleOnWishlistProduct({ ...item, from: 'categories' })}
              isLoading={loadingNewArrivals || isRefreshScreen}
            />
          );
        })}
      </HomeContainer>
    </LayoutScreen>
  );
};

export default HomeScreen;
