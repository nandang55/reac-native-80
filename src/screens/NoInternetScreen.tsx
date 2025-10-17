import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LogoNoInternet from 'assets/images/no-internet.svg';
import { Button } from 'components/Button';
import { LayoutScreen } from 'components/layouts';
import { Spacer } from 'components/Spacer';
import { Text } from 'components/Text';
import useCheckConnection from 'hooks/useCheckConnection';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import styled from 'styled-components';
import colors from 'styles/colors';

const NoInternetContainer = styled(View)`
  background-color: ${colors.light.whiteSolid};
  flex: 1;
  justify-content: center;
  padding: 24px;
`;

type NavigationOfflineModalScreenProp = StackNavigationProp<RootStackParamList, 'NoInternet'>;

const NoInternetScreen = () => {
  const navigation = useNavigation<NavigationOfflineModalScreenProp>();
  const { t } = useTranslation(['noInternet']);
  const { isConnected } = useCheckConnection();

  return (
    <LayoutScreen isNoPadding>
      <NoInternetContainer>
        <LogoNoInternet width="100%" />
        <Spacer h={48} />
        <Text
          label={t('title')}
          color={colors.dark.blackCoral}
          variant="large"
          fontWeight="bold"
          textAlign="center"
        />
        <Spacer h={16} />
        <Text
          label={t('description')}
          color={colors.dark.blackCoral}
          variant="small"
          textAlign="center"
        />
        <Spacer h={48} />
        <Button
          borderRadius="58px"
          label={t('reload')}
          fontSize="large"
          fontWeight="semi-bold"
          onPress={() => isConnected && navigation.goBack()}
          variant="background"
          color={colors.secondary}
        />
      </NoInternetContainer>
    </LayoutScreen>
  );
};

export default NoInternetScreen;
