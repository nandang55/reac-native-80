import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BackButton } from 'components/BackButton';
import { Icon } from 'components/Icon';
import { LayoutScreen } from 'components/layouts';
import { NoLogin } from 'components/NoLogin';
import { SearchTrigger } from 'components/Search';
import { CollectionSection } from 'components/Section/CollectionSection';
import { Skeleton } from 'components/Skeleton';
import { Text } from 'components/Text';
import { AccountContext } from 'contexts/AppAccountContext';
import useGetCategoryList from 'hooks/useGetCategoryList';
import useGetCollections from 'hooks/useGetCollections';
import { CategoryListInterface } from 'interfaces/ProductInterface';
import { CategoriesStackParamList } from 'navigators/CategoriesStackNavigator';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import {
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View
} from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';

type CategoriesScreenNavigationProps = StackNavigationProp<
  CategoriesStackParamList & RootStackParamList
>;

const CategoriesContainer = styled(View)`
  background-color: ${colors.light.whiteSolid};
  flex: 1;
`;

const StyledButton = styled(TouchableOpacity)`
  align-items: center;
  background-color: ${colors.light.whiteSolid};
  border: 1px solid ${colors.dark.solitude};
  border-radius: 12px;
  flex-direction: row;
  justify-content: space-between;
  padding: 14px;
`;

const StyledHeading = styled(Text)`
  padding: 16px;
`;

const StyledImage = styled(Image)`
  border-radius: 7px;
  height: 47px;
  width: 47px;
`;

const StyledAuthButton = styled(TouchableOpacity)`
  align-items: center;
  background-color: ${colors.red.flamingoPink};
  border-radius: 12px;
  flex-direction: row;
  gap: 12px;
  padding: 14px;
`;

const CategoriesScreen = () => {
  const gap = 16;
  const numColumn = 2;
  const availableSpace = Dimensions.get('window').width - (numColumn - 1) * gap - 32;
  const widthCard = availableSpace / numColumn;
  const heightCard = availableSpace / 99;
  const [isAuth, setIsAuth] = useState<boolean>(false);

  const { state: accountState } = useContext(AccountContext);

  const {
    data: dataCategoryList,
    isLoading: loadingCategoryList,
    isFetching: fetchingCategoryList,
    refetch: refetchCategoryList
  } = useGetCategoryList({});

  const {
    data: dataCollections,
    isLoading: loadingCollections,
    isFetching: fetchingCollections,
    refetch: refetchCollections
  } = useGetCollections({});

  const navigation = useNavigation<CategoriesScreenNavigationProps>();

  const renderItem = ({ item }: { item: CategoryListInterface }) => {
    return loadingCategoryList || fetchingCategoryList ? (
      <Skeleton width={widthCard} height={76} rounded />
    ) : (
      <StyledButton
        style={{
          shadowColor: colors.dark.blackCoral,
          shadowOffset: {
            width: 0,
            height: 2
          },
          shadowOpacity: 0.23,
          shadowRadius: 2.62,

          elevation: 4,
          width: widthCard,
          minHeight: heightCard
        }}
        onPress={() => handleOnDetailCategory({ id: item.id, title: item.name })}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <StyledImage source={{ uri: item.category_image_link }} />
          <Text
            label={item.name}
            variant="small"
            color={colors.dark.blackCoral}
            fontWeight="bold"
          />
        </View>
        <Icon
          name="chevronRight"
          color={colors.light.whiteSolid}
          stroke={colors.dark.gumbo}
          size="16"
        />
      </StyledButton>
    );
  };

  const handleOnDetailBanner = ({ title, id }: { id: string; title: string }) => {
    navigation.navigate('CollectionCatalogue', {
      title,
      id
    });
  };

  const handleOnDetailCategory = ({ id, title }: { id: string; title: string }) => {
    navigation.navigate('CategoryCatalogue', { id, title });
  };
  const AuthButton = () => {
    return (
      <StyledAuthButton onPress={() => setIsAuth(!isAuth)}>
        <Icon name="account" color={'transparent'} stroke={colors.light.whiteSolid} size="32" />
        <View>
          <Text label="Guest User" variant="medium" color={colors.light.whiteSolid} />
          <Text label="Tap to Login / Register" variant="medium" color={colors.light.whiteSolid} />
        </View>
      </StyledAuthButton>
    );
  };

  useEffect(() => {
    const backAction = () => {
      if (isAuth) {
        setIsAuth(!isAuth);
      } else {
        navigation.goBack();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <BackButton
          onPress={() => {
            isAuth ? setIsAuth(!isAuth) : navigation.goBack();
          }}
        />
      )
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth]);

  return (
    <LayoutScreen statusBarColor={colors.primary} isNoPadding scrollViewContentStyle={{ flex: 1 }}>
      {isAuth ? (
        <View style={{ backgroundColor: colors.light.whiteSolid, flex: 1 }}>
          <NoLogin />
        </View>
      ) : (
        <CategoriesContainer>
          <SearchTrigger
            value="Search by category, product & more..."
            onPress={() =>
              navigation.navigate('CategoriesStack', {
                screen: 'SearchSuggestion',
                params: { from: 'categories' }
              })
            }
          />
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={() => {
                  refetchCategoryList();
                  refetchCollections();
                }}
              />
            }
          >
            <View style={{ marginTop: -16 }}>
              <StyledHeading
                label={'Top Categories'}
                variant="small"
                color={colors.dark.blackCoral}
                fontWeight="bold"
              />
              <FlatList
                data={dataCategoryList?.data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={numColumn}
                contentContainerStyle={{
                  gap,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingBottom: 16
                }}
                columnWrapperStyle={{ gap }}
                getItemLayout={(_, index) => ({
                  length: heightCard,
                  offset: heightCard * index,
                  index
                })}
                scrollEnabled={false}
              />
            </View>

            {dataCollections?.data && dataCollections?.data.length > 0 && (
              <View>
                <CollectionSection
                  data={dataCollections?.data.filter((item) => Boolean(item.image_link)) || []}
                  label={
                    <StyledHeading
                      label={'Special Collections'}
                      variant="small"
                      color={colors.dark.blackCoral}
                      fontWeight="bold"
                      style={{ padding: 0 }}
                    />
                  }
                  bannerOnPress={handleOnDetailBanner}
                  labelStyle={{ paddingLeft: 16 }}
                  isLoading={loadingCollections || fetchingCollections}
                  borderRadius={12}
                  spacing={16}
                />
              </View>
            )}

            <View style={{ flex: 1 }} />

            {!accountState.account && (
              <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
                <AuthButton />
              </View>
            )}
          </ScrollView>
        </CategoriesContainer>
      )}
    </LayoutScreen>
  );
};

export default CategoriesScreen;
