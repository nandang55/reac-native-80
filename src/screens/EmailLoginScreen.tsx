import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import EmailLogin from 'assets/images/emailLogin.svg';
import { Button } from 'components/Button';
import { InputText } from 'components/Input';
import { LayoutScreen } from 'components/layouts';
import { Spacer } from 'components/Spacer';
import { Text } from 'components/Text';
import { LoadingContext } from 'contexts/AppLoadingContext';
import { useFormik } from 'formik';
import { useEmailLogin } from 'hooks/usePostLogin';
import { ErrorLoginInterface } from 'interfaces/LoginInterface';
import { LanguageType } from 'interfaces/TranslationInterface';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import colors from 'styles/colors';
import { maskEmailAddress } from 'utils/maskHelper';
import * as Yup from 'yup';

type EmailLoginScreenNavigationProps = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const EmailLoginContainer = styled(View)`
  align-items: center;
  background-color: ${colors.light.whiteSolid};
  flex: 1;
`;

const FormContainer = styled(View)`
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  width: 100%;
`;

const SubmitContainer = styled(View)`
  display: flex;
  gap: 16px;
  padding: 0 24px;
  width: ${width};
`;

const EmailLoginScreen = () => {
  const navigation = useNavigation<EmailLoginScreenNavigationProps>();
  const { setLoading } = useContext(LoadingContext);
  const { t, i18n } = useTranslation(['login', 'common']);

  const RegisterValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('login:loginByEmail.invalid'))
      .required(t('login:loginByEmail.invalid'))
  });

  const { mutate: login } = useEmailLogin({
    onSuccess: async (data, payload) => {
      if (!data.error) {
        navigation.navigate('AuthenticationStack', {
          screen: 'Verify',
          params: {
            from: 'email',
            method: 'login',
            email: payload.email,
            textDescription: t('login:emailDescription', {
              emailAddress: maskEmailAddress(payload?.email ?? '')
            })
          }
        });
      }
    },
    onError: (error) => {
      const res = error.response?.data;
      if (res?.error) {
        const emailErrors = res.data as ErrorLoginInterface;
        formik.setErrors({ email: emailErrors?.email?.[0] });
      }
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: RegisterValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      handleOnSubmit(values.email);
    }
  });

  const handleOnSubmit = (email: string) => {
    login({ email, lang: i18n.language as LanguageType });
  };

  return (
    <>
      <LayoutScreen backgroundColor={colors.light.whiteSolid} isNoPadding isFooter>
        <EmailLoginContainer>
          <Spacer h={40} />
          <EmailLogin width="100%" fill={colors.yellow.lightYellow} />
          <Spacer h={32} />
          <View style={{ marginHorizontal: 24 }}>
            <Text
              label={t('login:loginByEmail.desc')}
              fontWeight="regular"
              variant="large"
              color={colors.dark.gumbo}
              textAlign="center"
            />
          </View>
          <FormContainer>
            <InputText
              label={t('login:loginByEmail.label')}
              value={formik.values.email}
              onChange={(value) => formik.setFieldValue('email', value)}
              placeholder={t('login:loginByEmail.placeholder')}
              isError={formik.touched.email && !!formik.errors.email}
              errorText={formik.errors.email}
            />
          </FormContainer>
          <SubmitContainer>
            <Button
              label={t('common:next')}
              onPress={() => formik.handleSubmit()}
              isDisableColor={colors.light.whiteSmoke}
              isDisableBorderColor={colors.dark.silver}
              height={48}
              fontSize="large"
              fontWeight="semi-bold"
              isDisableTextColor={colors.dark.solitude}
              borderRadius="48px"
              variant="background"
              color={colors.secondary}
              isDisable={!formik.dirty}
            />
          </SubmitContainer>
          <Spacer h={24} />
          <View style={{ flexDirection: 'row' }}>
            <Text
              label={`${t('login:loginByEmail.unregistered')} `}
              fontWeight="regular"
              variant="small"
              color={colors.dark.gumbo}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('AuthenticationStack', { screen: 'Register' })}
            >
              <Text
                label={t('login:register')}
                fontWeight="semi-bold"
                textDecoration="underline"
                variant="small"
                color={colors.dark.darkGray}
              />
            </TouchableOpacity>
          </View>
        </EmailLoginContainer>
      </LayoutScreen>
    </>
  );
};

export default EmailLoginScreen;
