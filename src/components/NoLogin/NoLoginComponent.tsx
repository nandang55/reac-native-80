import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LogoVerticallGradientGray from 'assets/images/Logo/vertical-logo-gradient-gray.svg';
import { Button } from 'components/Button';
import { Text } from 'components/Text';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { styled } from 'styled-components';
import colors from 'styles/colors';

const ButtonWrapper = styled(View)`
  display: flex;
  gap: 16px;
  justify-content: center;
  width: 100%;
`;

const Container = styled(View)`
  flex: 1;
  margin-left: 24px;
  margin-right: 24px;
  margin-top: 16px;
`;

type AccountScreenNavigationProps = StackNavigationProp<RootStackParamList>;

const NoLoginComponent = () => {
  const { t } = useTranslation('account');
  const navigation = useNavigation<AccountScreenNavigationProps>();

  return (
    <Container>
      <LogoVerticallGradientGray width="100%" height="120px" style={{ margin: 'auto' }} />
      <Text
        label={t('heading')}
        variant="large"
        color={colors.dark.blackCoral}
        fontWeight="bold"
        textAlign="center"
        style={{ paddingVertical: 24 }}
      />
      <ButtonWrapper>
        <Button
          label={t('login')}
          variant="background"
          color={colors.secondary}
          onPress={() => navigation.navigate('AuthenticationStack', { screen: 'Login' })}
          borderRadius="88px"
          fontSize="large"
        />
        <Button
          label={t('register')}
          variant="secondary"
          onPress={() => navigation.navigate('AuthenticationStack', { screen: 'Register' })}
          borderRadius="88px"
          fontSize="large"
          textColor={colors.dark.gumbo}
          borderColor={colors.dark.gumbo}
        />
      </ButtonWrapper>
    </Container>
  );
};

export default NoLoginComponent;
