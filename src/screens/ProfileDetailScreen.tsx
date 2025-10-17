import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from 'components/Button';
import { LayoutScreen } from 'components/layouts';
import { MenuList } from 'components/MenuList';
import { MenuListInterface } from 'components/MenuList/MenuList.type';
import { ModalAlert } from 'components/Modal';
import { AccountContext } from 'contexts/AppAccountContext';
import { LoadingContext } from 'contexts/AppLoadingContext';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import useAuth from 'hooks/useAuth';
import { useDeleteProfile } from 'hooks/useDeleteProfile';
import useGetProfile from 'hooks/useGetProfile';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, FlatList, View } from 'react-native';
import styled from 'styled-components';
import colors from 'styles/colors';

const { width } = Dimensions.get('window');

const ProfileDetailContainer = styled(View)`
  background-color: white;
  flex: 1;
  padding: 16px;
`;

const FooterContainer = styled(View)`
  background-color: ${colors.light.whiteSolid};
  bottom: 0;
  display: flex;
  position: absolute;
  width: ${width};
`;

const FooterButton = styled(View)`
  padding: 16px 28px;
`;

const Border = styled(View)`
  border: 1px solid ${colors.dark.silver};
`;

type ProfileDetailNavigationScreen = StackNavigationProp<RootStackParamList>;

const ProfileDetailScreen = () => {
  const navigation = useNavigation<ProfileDetailNavigationScreen>();
  const { t } = useTranslation(['profileDetail']);
  const { signOut } = useAuth();
  const queryClient = useQueryClient();

  const { state: accountState, dispatch } = useContext(AccountContext);
  const { setIsShowToast, setToastMessage, setType } = useContext(ModalToastContext);
  const { setLoading } = useContext(LoadingContext);

  const { id } = accountState.account || {};

  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
    onSuccess: (data) => {
      if (!data.error) {
        setShowConfirmModal(false);
        signOut();
        setIsShowToast(true);
        setToastMessage(data.message);
        setType('success');
        queryClient.clear();
      } else {
        setIsShowToast(true);
        setToastMessage(data.message);
        setType('error');
      }
    }
  });

  const { firstName, lastName, phone, email } = accountState.account || {};

  useEffect(() => {
    if (!isLoadingGetProfile && dataProfile?.data && dataProfile.data.id) {
      dispatch({ type: 'SetAccount', payload: dataProfile.data });
    }
    dispatch({ type: 'RemoveCloseAccount' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataProfile?.data]);

  const AUTHENTICATED_DATA_MENU_LIST: Array<MenuListInterface> = [
    {
      type: 'secondary',
      icon: 'account',
      iconCard: true,
      iconProps: { color: colors.secondary },
      iconCardBackground: 'rgba(255, 71, 161, 0.1)',
      label: t('profileDetail:name'),
      description: firstName || lastName ? `${firstName} ${lastName || ''}` : '-',
      onPress: () => navigation.navigate('AccountStack', { screen: 'ChangeFullName' }),
      rightIcon: 'edit',
      rightIconProps: {
        color: colors.dark.bermudaGrey,
        size: '16px'
      }
    },
    {
      type: 'secondary',
      icon: 'handPhone',
      iconCard: true,
      iconProps: { color: colors.secondary },
      iconCardBackground: 'rgba(255, 71, 161, 0.1)',
      label: t('profileDetail:phoneNumber'),
      description: phone || '-',
      onPress: () => navigation.navigate('AccountStack', { screen: 'ChangePhoneNumber' }),
      rightIcon: 'edit',
      rightIconProps: {
        color: colors.dark.bermudaGrey,
        size: '16px'
      }
    },
    {
      type: 'secondary',
      icon: 'email',
      iconCard: true,
      iconProps: { color: colors.secondary },
      iconCardBackground: 'rgba(255, 71, 161, 0.1)',
      label: t('profileDetail:emailAddress'),
      description: email || '-',
      onPress: () => navigation.navigate('AccountStack', { screen: 'ChangeEmail' }),
      rightIcon: 'edit',
      rightIconProps: {
        color: colors.dark.bermudaGrey,
        size: '16px'
      }
    }
  ];

  const renderItem = ({ item }: { item: MenuListInterface }) => {
    return <MenuList {...item} />;
  };

  const handleConfirmCloseAccount = () => {
    deleteProfile({ id: id || '' });
  };

  useEffect(() => setLoading(isLoading), [isLoading, setLoading]);

  return (
    <>
      <LayoutScreen statusBarColor={colors.primary} isNoPadding>
        <ProfileDetailContainer>
          <FlatList
            data={AUTHENTICATED_DATA_MENU_LIST}
            renderItem={renderItem}
            keyExtractor={(item) => item.label}
            contentContainerStyle={{ paddingTop: 13 }}
          />
          <FooterContainer>
            <Border />
            <FooterButton>
              <Button
                label="Delete Account"
                onPress={() => navigation.navigate('AccountStack', { screen: 'DeleteAccount' })}
                variant="secondary"
                borderRadius="88px"
              />
            </FooterButton>
          </FooterContainer>
        </ProfileDetailContainer>
      </LayoutScreen>

      <ModalAlert
        title="Delete Account"
        description="Are you sure you want to delete your account?"
        isVisible={showConfirmModal}
        onCloseModal={() => setShowConfirmModal(false)}
        onPressYes={handleConfirmCloseAccount}
      />
    </>
  );
};

export default ProfileDetailScreen;
