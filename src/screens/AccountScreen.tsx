import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQueryClient } from '@tanstack/react-query';
import { LayoutScreen } from 'components/layouts';
import { MenuList } from 'components/MenuList';
import { MenuListInterface } from 'components/MenuList/MenuList.type';
import { ModalAlert } from 'components/Modal';
import { NoLogin } from 'components/NoLogin';
import { AccountContext } from 'contexts/AppAccountContext';
import { LoadingContext } from 'contexts/AppLoadingContext';
import useAuth from 'hooks/useAuth';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';
import styled from 'styled-components';
import colors from 'styles/colors';

const AccountContainer = styled(View)`
  background-color: ${colors.light.whiteSolid};
  flex: 1;
  gap: 16px;
`;

type AccountScreenNavigationProps = StackNavigationProp<RootStackParamList>;

const AccountScreen = () => {
  const navigation = useNavigation<AccountScreenNavigationProps>();
  const { state: accountState } = useContext(AccountContext);
  const { setLoading } = useContext(LoadingContext);
  const { t } = useTranslation('account');
  const queryClient = useQueryClient();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { signOut } = useAuth();

  const { id, isTester } = accountState.account || {};

  const AUTHENTICATED_DATA_MENU_LIST: Array<MenuListInterface> = [
    {
      type: 'primary',
      icon: 'account',
      iconCard: true,
      // eslint-disable-next-line sonarjs/no-duplicate-string
      iconCardBackground: 'rgba(255, 71, 161, 0.1)',
      iconProps: { color: colors.secondary },
      label: 'Profile',
      onPress: () => navigation.navigate('AccountStack', { screen: 'ProfileDetail' }),
      rightIcon: 'chevronRight',
      rightIconProps: {
        color: colors.light.whiteSolid,
        stroke: colors.dark.bermudaGrey
      }
    },
    {
      type: 'primary',
      icon: 'distance',
      iconCard: true,
      iconCardBackground: 'rgba(255, 71, 161, 0.1)',
      iconProps: { color: colors.secondary },
      label: t('deliveryAddress'),
      onPress: () => navigation.navigate('AddressStack', { screen: 'Address' }),
      rightIcon: 'chevronRight',
      rightIconProps: {
        color: colors.light.whiteSolid,
        stroke: colors.dark.bermudaGrey
      }
    },
    {
      type: 'primary',
      icon: 'logout',
      iconCard: true,
      iconCardBackground: 'rgba(255, 71, 161, 0.1)',
      iconProps: { fill: 'rgba(255, 71, 161, 0.1)', color: colors.secondary },
      label: t('logout'),
      onPress: () => setShowLogoutModal(true)
    }
  ];

  if (isTester) {
    const index = AUTHENTICATED_DATA_MENU_LIST.findIndex((item) => item.label === t('logout'));
    if (index !== -1) {
      AUTHENTICATED_DATA_MENU_LIST.splice(index, 0, {
        type: 'primary',
        icon: 'infoCircle',
        iconCard: true,
        iconCardBackground: 'rgba(255, 71, 161, 0.1)',
        iconProps: { color: colors.secondary },
        label: 'ENV Configuration',
        onPress: () => navigation.navigate('ENVConfiguration'),
        rightIcon: 'chevronRight',
        rightIconProps: {
          color: colors.light.whiteSolid,
          stroke: colors.dark.bermudaGrey
        }
      });
    }
  }

  const renderItem = ({ item }: { item: MenuListInterface }) => {
    return <MenuList {...item} />;
  };

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      signOut();
      queryClient.clear();
    }, 1000);
  };

  return (
    <>
      <LayoutScreen statusBarColor={colors.primary} isNoPadding>
        <AccountContainer>
          {!id ? (
            <NoLogin />
          ) : (
            <FlatList
              data={AUTHENTICATED_DATA_MENU_LIST}
              renderItem={renderItem}
              keyExtractor={(item) => item.label}
              contentContainerStyle={{ paddingTop: 13 }}
            />
          )}
        </AccountContainer>
      </LayoutScreen>

      <ModalAlert
        title={t('logoutConfirmation')}
        description={t('logoutDesc')}
        isVisible={showLogoutModal}
        onCloseModal={() => setShowLogoutModal(false)}
        onPressYes={handleLogout}
      />
    </>
  );
};

export default AccountScreen;
