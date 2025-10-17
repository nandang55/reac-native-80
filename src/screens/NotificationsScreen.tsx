import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import LogoNotificationsEmpty from 'assets/images/notification-empty.svg';
import { NotificationCard } from 'components/Card';
import { LayoutScreen } from 'components/layouts';
import { NoLogin } from 'components/NoLogin';
import { Text } from 'components/Text';
import { AccountContext } from 'contexts/AppAccountContext';
import { useGetNotificationList } from 'hooks/useGetNotificationList';
import { usePutNotificationRead } from 'hooks/usePutNotificationRead';
import { NotificationInterface } from 'interfaces/NotificationInterface';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  Linking,
  RefreshControl,
  View
} from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';

const CartContainer = styled(View)`
  background-color: ${colors.light.whiteSolid};
  flex: 1;
  gap: 24px;
`;

const EmptyContainer = styled(View)`
  background-color: ${colors.light.whiteSolid};
  flex: 1;
  justify-content: center;
  padding: 40px;
`;

const NotificationsScreen = () => {
  const queryClient = useQueryClient();
  const { state: accountState } = useContext(AccountContext);
  const navigation = useNavigation();

  const { id } = accountState.account || {};

  const {
    data: dataNotificationList,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isLoading: isRefreshNotificationList,
    refetch: refreshNotificationList
  } = useGetNotificationList({
    // eslint-disable-next-line camelcase
    params: { page: 1, per_page: 10 },
    options: { enabled: !!id }
  });

  const { mutate: changeReadNotification } = usePutNotificationRead(() => {
    queryClient.invalidateQueries({ queryKey: ['useGetNotificationList'] });
    queryClient.invalidateQueries({ queryKey: ['useGetNotificationCount'] });
  });

  const notifications = dataNotificationList?.pages.flatMap((item) => item?.data) || [];

  const handlerOnPressItem = (item: NotificationInterface) => {
    if (item.is_read === false) {
      changeReadNotification(item.id);
    }
    Linking.canOpenURL(item.action_url).then((supported) => {
      if (supported) {
        Linking.openURL(item.action_url);
      }
    });
  };

  const handlerOnPressFooter = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleBackButton();
      return true;
    });

    return () => backHandler.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const handleBackButton = () => {
    navigation.goBack();
  };

  return (
    <>
      <LayoutScreen isNoPadding>
        <CartContainer>
          {!id ? (
            <NoLogin />
          ) : (
            <FlatList
              data={notifications}
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Item data={item} onPress={() => handlerOnPressItem(item)} />
              )}
              ListEmptyComponent={<Empty isVisible={!isRefreshNotificationList} />}
              onEndReachedThreshold={0.5}
              onEndReached={handlerOnPressFooter}
              ListFooterComponent={isFetching ? <ActivityIndicator /> : <></>}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshNotificationList}
                  onRefresh={refreshNotificationList}
                />
              }
            />
          )}
        </CartContainer>
      </LayoutScreen>
    </>
  );
};

function Item({ data, onPress }: { data: NotificationInterface; onPress: () => void }) {
  return <NotificationCard {...data} onPress={onPress} />;
}

function Empty({ isVisible }: { isVisible: boolean }) {
  const { t } = useTranslation(['notification']);

  if (!isVisible) {
    return null;
  }

  return (
    <EmptyContainer>
      <LogoNotificationsEmpty width="100%" />
      <Text
        label={t('notification:empty')}
        color={colors.dark.gumbo}
        variant="medium"
        textAlign="center"
        style={{ marginTop: 16 }}
      />
    </EmptyContainer>
  );
}

export default NotificationsScreen;
