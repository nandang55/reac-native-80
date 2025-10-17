import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Sentry from '@sentry/react-native';
import WhatsAppLogin from 'assets/images/whatsappLoginSricandy.svg';
import { Button } from 'components/Button';
import { InputPhoneNumber } from 'components/Input';
import { LayoutScreen } from 'components/layouts';
import { Spacer } from 'components/Spacer';
import { Text } from 'components/Text';
import config from 'config';
import { LoadingContext } from 'contexts/AppLoadingContext';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import { useFormik } from 'formik';
import { usePostErrorLogFirebase } from 'hooks/usePostErrorFirebase';
import { usePhoneLogin } from 'hooks/usePostLogin';
import { ErrorLoginInterface } from 'interfaces/LoginInterface';
import { LanguageType } from 'interfaces/TranslationInterface';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import colors from 'styles/colors';
import { maskPhoneNumber } from 'utils/maskHelper';
import { validationNumberFormat } from 'utils/phoneNumber';

type WhatsAppLoginScreenNavigationProps = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const WhatsAppLoginContainer = styled(View)`
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

const WhatsAppLoginScreen = () => {
  const otpType = config.otpType;
  const navigation = useNavigation<WhatsAppLoginScreenNavigationProps>();
  const { t, i18n } = useTranslation(['login', 'common']);

  const [isLoading, setIsLoading] = useState(false);
  const [isSendingPhoneNumberToFirebase, setIsSendingPhoneNumberToFirebase] = useState(false);
  const { setIsShowToast, setToastMessage, setType } = useContext(ModalToastContext);
  const { setLoading } = useContext(LoadingContext);

  const { mutate: login } = usePhoneLogin({
    onSuccess: async (data, payload) => {
      if (!data.error) {
        if (otpType === 'SMS') {
          await signInWithFirebase(payload.phone as string);
        } else {
          navigation.navigate('AuthenticationStack', {
            screen: 'Verify',
            params: {
              from: 'whatsApp',
              method: 'login',
              phoneCode: formik.values.code,
              phone: formik.values.phoneNumber,
              textDescription: data.data as string
            }
          });
        }
      }
    },
    onError: (error) => {
      const res = error.response?.data;
      if (res?.error) {
        const emailErrors = res.data as ErrorLoginInterface;
        formik.setErrors({ phoneNumber: emailErrors?.phone?.[0] });
      }
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });

  const { mutate: logError, isLoading: isLogErrorLoading } = usePostErrorLogFirebase({
    onSuccess: () => {
      setIsShowToast(true);
      setToastMessage(t('login:verification.errorGeneral'));
      setType('error');
    }
  });

  const formik = useFormik({
    initialValues: {
      code: '',
      phoneNumber: ''
    },
    onSubmit: (values) => {
      setIsLoading(true);
      login({ phone: '+' + values.code + values.phoneNumber, lang: i18n.language as LanguageType });
    }
  });

  const signInWithFirebase = async (phoneNumber: string) => {
    setIsSendingPhoneNumberToFirebase(true);
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      if (confirmation.verificationId) {
        setIsSendingPhoneNumberToFirebase(false);
        navigation.navigate('AuthenticationStack', {
          screen: 'Verify',
          params: {
            from: 'whatsApp',
            method: 'login',
            phoneCode: formik.values.code,
            phone: formik.values.phoneNumber,
            verificationId: confirmation.verificationId,
            textDescription: t('login:smsDescription', {
              phoneNumber: maskPhoneNumber(phoneNumber)
            })
          }
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setIsSendingPhoneNumberToFirebase(false);
      const errorCode = error.code;
      const errorMessage = error.message;
      // eslint-disable-next-line camelcase
      logError({ phone: phoneNumber, error_message: `${errorCode} ${errorMessage}` });
      Sentry.withScope((scope) => {
        scope.setTag('user_phone', phoneNumber);
        scope.setTag('error_type', 'Request OTP');
        Sentry.captureException(error);
      });
    }
    setIsSendingPhoneNumberToFirebase(false);
  };

  useEffect(
    () => setLoading(isLoading || isSendingPhoneNumberToFirebase || isLogErrorLoading),
    [isLoading, isSendingPhoneNumberToFirebase, isLogErrorLoading, setLoading]
  );

  return (
    <>
      <LayoutScreen backgroundColor={colors.light.whiteSolid} isNoPadding isFooter>
        <WhatsAppLoginContainer>
          <Spacer h={40} />
          <WhatsAppLogin width="100%" fill={colors.yellow.lightYellow} />
          <Spacer h={32} />
          <View style={{ paddingHorizontal: 50 }}>
            <Text
              label={t('login:loginByPhone.desc')}
              fontWeight="regular"
              variant="medium"
              color={colors.dark.gumbo}
              textAlign="center"
            />
          </View>
          <FormContainer>
            <InputPhoneNumber
              valueCode={formik.values.code}
              valuePhone={formik.values.phoneNumber}
              onChangePhone={(value) => {
                formik.setFieldValue('phoneNumber', validationNumberFormat(value));
              }}
              onChangeCode={(value) => formik.setFieldValue('code', value)}
              isError={
                (formik.touched.phoneNumber && !!formik.errors.phoneNumber) ||
                (formik.touched.code && !!formik.errors.code)
              }
              errorText={formik.errors.phoneNumber || formik.errors.code}
              label={t('login:loginByPhone.label')}
            />
          </FormContainer>
          <SubmitContainer>
            <Button
              label={t('common:next')}
              borderRadius="48px"
              isDisableColor={colors.light.whiteSmoke}
              isDisableTextColor={colors.dark.solitude}
              onPress={() => formik.handleSubmit()}
              variant="background"
              color={colors.secondary}
              isDisable={
                !(
                  formik.dirty &&
                  formik.values.code.length > 0 &&
                  formik.values.phoneNumber.length >= 6
                )
              }
            />
          </SubmitContainer>
          <Spacer h={24} />
          <View style={{ flexDirection: 'row' }}>
            <Text
              label={`${t('login:loginByPhone.unregistered')} `}
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
        </WhatsAppLoginContainer>
      </LayoutScreen>
    </>
  );
};

export default WhatsAppLoginScreen;
