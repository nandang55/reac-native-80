import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LogoOrderEmpty from 'assets/images/order-empty-sricandy.svg';
import { OrderCard } from 'components/Card';
import { OrderCardBaseInterface } from 'components/Card/OrderCard.type';
import { LayoutScreen } from 'components/layouts';
import { NoLogin } from 'components/NoLogin';
import { Text } from 'components/Text';
import { AccountContext } from 'contexts/AppAccountContext';
import { LoadingContext } from 'contexts/AppLoadingContext';
import { useGetOrderList } from 'hooks/useGetOrderList';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';

type OrderScreenNavigationProps = StackNavigationProp<RootStackParamList>;

const OrderContainer = styled(View)`
  background-color: ${colors.light.whiteSolid};
  flex: 1;
  gap: 24px;
`;

const OrderEmptyContainer = styled(View)`
  background-color: ${colors.light.whiteSolid};
  flex: 1;
  justify-content: center;
  padding: 24px 50px;
`;

const OrderScreen = () => {
  const navigation = useNavigation<OrderScreenNavigationProps>();
  const { t } = useTranslation(['order']);

  const { state: accountState } = useContext(AccountContext);

  const { id } = accountState.account || {};

  const { setLoading } = useContext(LoadingContext);

  const {
    data: dataOrderList,
    isLoading,
    isFetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetOrderList({
    options: { enabled: !!id },
    // eslint-disable-next-line camelcase
    params: { page: 1, per_page: 10 }
  });

  const onRefreshProductCategoryData = () => {
    refetch();
  };

  const renderItem = ({ item }: { item: OrderCardBaseInterface }) => {
    return (
      <OrderCard
        {...item}
        onPressCard={() =>
          navigation.navigate('OrderStack', { screen: 'OrderDetail', params: { id: item.id } })
        }
      />
    );
  };

  const renderEmpty = () => {
    return (
      <OrderEmptyContainer>
        <LogoOrderEmpty width="100%" />
        <Text
          label={t('order:emptyOrder')}
          color={colors.dark.gumbo}
          textAlign="center"
          style={{ marginTop: 16 }}
        />
      </OrderEmptyContainer>
    );
  };

  useEffect(() => setLoading(isFetching), [isFetching, setLoading]);

  return (
    <>
      <LayoutScreen isNoPadding>
        <OrderContainer>
          {!id ? (
            <NoLogin />
          ) : (
            <FlatList
              data={dataOrderList?.pages.flatMap((item) => item.data) || []}
              renderItem={renderItem}
              keyExtractor={(_, index) => index.toString()}
              contentContainerStyle={{
                flexGrow: 1,
                gap: 8,
                paddingHorizontal: 16,
                paddingTop: 18,
                paddingBottom: 20
              }}
              ListEmptyComponent={isLoading || isFetching ? null : renderEmpty}
              showsVerticalScrollIndicator={false}
              extraData={dataOrderList}
              onEndReached={() => {
                if (hasNextPage) {
                  fetchNextPage();
                }
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
              refreshControl={
                <RefreshControl refreshing={isFetching} onRefresh={onRefreshProductCategoryData} />
              }
            />
          )}
        </OrderContainer>
      </LayoutScreen>
    </>
  );
};

export default OrderScreen;
