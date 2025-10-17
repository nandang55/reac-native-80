import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQueryClient } from '@tanstack/react-query';
import Logo from 'assets/images/logo-sricandy.svg';
import { Button } from 'components/Button';
import { LayoutScreen } from 'components/layouts';
import { MenuList } from 'components/MenuList';
import { MenuListInterface } from 'components/MenuList/MenuList.type';
import { ModalAlert } from 'components/Modal';
import { Text } from 'components/Text';
import { AccountContext } from 'contexts/AppAccountContext';
import { LoadingContext } from 'contexts/AppLoadingContext';
import useAuth from 'hooks/useAuth';
import { useDeleteProfile } from 'hooks/useDeleteProfile';
import useGetProfile from 'hooks/useGetProfile';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';
import styled from 'styled-components';
import colors from 'styles/colors';

const AccountContainer = styled(View)`
  background-color: white;
  flex: 1;
  padding: 16px;
`;

type CloseAccountScreenNavigationProps = StackNavigationProp<RootStackParamList>;

const CloseAccountScreen = () => {
  const navigation = useNavigation<CloseAccountScreenNavigationProps>();
  const { state: accountState, dispatch } = useContext(AccountContext);
  const { setLoading } = useContext(LoadingContext);
  const { t } = useTranslation(['account', 'profileDetail']);
  const { signOut } = useAuth();

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const queryClient = useQueryClient();

  const { id, firstName, lastName, email, phone } = accountState.account || {};

  const AUTHENTICATED_DATA_MENU_LIST: Array<MenuListInterface> = [
    {
      type: 'secondary',
      icon: 'account',
      iconCard: true,
      label: t('profileDetail:name'),
      description: `${firstName} ${lastName}`,
      onPress: () => undefined
    },
    {
      type: 'secondary',
      icon: 'handPhone',
      iconCard: true,
      iconProps: { fill: colors.light.whiteSolid },
      label: t('profileDetail:phoneNumber'),
      description: phone,
      onPress: () => undefined
    },
    {
      type: 'secondary',
      icon: 'email',
      iconCard: true,
      iconProps: { color: colors.dark.gumbo },
      label: t('profileDetail:emailAddress'),
      description: email,
      onPress: () => undefined
    }
  ];

  const { data: dataProfile, isLoading: isLoadingGetProfile } = useGetProfile({
    options: {
      onError: (error) => {
        const res = error.response?.data;
        if (res?.error) {
          signOut();
        }
      }
    }
  });

  const { mutate: deleteProfile, isLoading } = useDeleteProfile({
    onSuccess: () => {
      setShowConfirmationModal(false);
      signOut();
      queryClient.clear();
    }
  });

  useEffect(() => {
    if (!isLoadingGetProfile && dataProfile?.data && dataProfile.data.id) {
      dispatch({ type: 'SetAccount', payload: dataProfile.data });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataProfile?.data]);

  const renderItem = ({ item }: { item: MenuListInterface }) => {
    return <MenuList {...item} />;
  };

  const handleConfirmCloseAccount = () => {
    deleteProfile({ id: id || '' });
  };

  useEffect(() => {
    dispatch({ type: 'CloseAccount', payload: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => setLoading(isLoading), [isLoading, setLoading]);

  return (
    <>
      <LayoutScreen statusBarColor={colors.primary} isNoPadding>
        <AccountContainer>
          {!id && (
            <>
              <Logo width="100%" />
              <Text
                label={'Log in to close your account'}
                variant="large"
                color={colors.dark.blackCoral}
                fontWeight="bold"
                textAlign="center"
                style={{ paddingVertical: 24 }}
              />
              <Button
                label={t('login')}
                variant="background"
                color={colors.secondary}
                onPress={() =>
                  navigation.navigate('AuthenticationStack', {
                    screen: 'Login'
                  })
                }
                borderRadius="88px"
                fontSize="large"
              />
            </>
          )}

          {id && (
            <View style={{ gap: 24 }}>
              <FlatList
                data={AUTHENTICATED_DATA_MENU_LIST}
                renderItem={renderItem}
                keyExtractor={(item) => item.label}
                contentContainerStyle={{ paddingTop: 13 }}
              />

              <Button
                label="Close Account"
                variant="background"
                borderRadius="88px"
                color={colors.secondary}
                onPress={() => setShowConfirmationModal(true)}
              />
            </View>
          )}
        </AccountContainer>
      </LayoutScreen>

      <ModalAlert
        title={'Close Account'}
        description={'Are you sure you want to close your Account?'}
        isVisible={showConfirmationModal}
        onCloseModal={() => setShowConfirmationModal(false)}
        onPressYes={handleConfirmCloseAccount}
        reverse
      />
    </>
  );
};

export default CloseAccountScreen;
