/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable camelcase */
import auth from '@react-native-firebase/auth';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Sentry from '@sentry/react-native';
import { BackButton } from 'components/BackButton';
import { Button } from 'components/Button';
import { InputPhoneNumber, InputText } from 'components/Input';
import { LayoutScreen } from 'components/layouts';
import { ModalAlert } from 'components/Modal';
import config from 'config';
import { AccountContext } from 'contexts/AppAccountContext';
import { LoadingContext } from 'contexts/AppLoadingContext';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import { useFormik } from 'formik';
import { usePostErrorLogFirebase } from 'hooks/usePostErrorFirebase';
import { usePutFirebaseModifyPhone, usePutModifyPhone } from 'hooks/usePutModifyPhone';
import { ErrorModifyInterface } from 'interfaces/ProfileInterface';
import { LanguageType } from 'interfaces/TranslationInterface';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, Dimensions, View } from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';
import { maskPhoneNumber } from 'utils/maskHelper';
import { validationNumberFormat } from 'utils/phoneNumber';

type ChangePhoneNumberNavigationScreen = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const ChangePhoneNumberContainer = styled(View)`
  align-items: center;
  background-color: ${colors.light.whiteSolid};
  display: flex;
  flex: 1;
  justify-content: space-between;
  padding-bottom: 32px;
`;

const FormContainer = styled(View)`
  display: flex;
  gap: 24px;
  padding: 0 24px;
  width: ${width};
`;

const FooterContainer = styled(View)`
  display: flex;
  gap: 16px;
  padding: 0 24px;
  width: ${width};
`;

const ChangePhoneNumberScreen = () => {
  const otpType = config.otpType;

  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSendingPhoneNumberToFirebase, setIsSendingPhoneNumberToFirebase] = useState(false);

  const navigation = useNavigation<ChangePhoneNumberNavigationScreen>();
  const { state: accountState } = useContext(AccountContext);
  const { setIsShowToast, setToastMessage, setType } = useContext(ModalToastContext);
  const { setLoading } = useContext(LoadingContext);
  const isFocused = useIsFocused();
  const { t, i18n } = useTranslation(['profileDetail', 'common', 'login']);

  const { phone } = accountState.account || {};

  const { mutate: modifyPhone } = usePutModifyPhone({
    onSuccess: async (data, payload) => {
      if (!data.error) {
        navigation.navigate('AuthenticationStack', {
          screen: 'Verify',
          params: {
            from: 'whatsApp',
            method: 'change',
            phone: payload.new_phone,
            textDescription: data.message as string
          }
        });
      }
    },
    onError: (error) => {
      const res = error.response?.data;
      if (res?.error) {
        const phoneErrors = res.data as ErrorModifyInterface;
        formik.setErrors({ new_phone: phoneErrors?.new_phone?.[0] });
      }
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });

  const { mutate: firebaseModifyPhone } = usePutFirebaseModifyPhone({
    onSuccess: async (data, payload) => {
      if (!data.error && payload.phone_cc) {
        await signInWithFirebase(payload.phone_cc, payload.new_phone);
      }
    },
    onError: (error) => {
      let currentError = {};
      const errorMessage = error.response?.data.data;

      if (errorMessage) {
        for (let i = 0; i < Object.keys(errorMessage).length; i++) {
          currentError = {
            ...currentError,
            [Object.keys(errorMessage)[i]]: Object.values(errorMessage)[i]
          };
        }

        formik.setErrors(currentError);
      }
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });

  const formik = useFormik({
    initialValues: {
      new_phone: '',
      phone_cc: ''
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      handleOnSubmit(values.phone_cc, values.new_phone);
    }
  });

  const { mutate: logError, isLoading: isLogErrorLoading } = usePostErrorLogFirebase({
    onSuccess: () => {
      setIsShowToast(true);
      setToastMessage(t('login:verification.errorGeneral'));
      setType('error');
    }
  });

  const signInWithFirebase = async (phoneCode: string, phoneNumber: string) => {
    setIsSendingPhoneNumberToFirebase(true);
    const currentUser = auth().currentUser;
    if (currentUser) {
      auth().signOut();
    }
    try {
      const confirmation = await auth().signInWithPhoneNumber(`+${phoneCode}${phoneNumber}`, true);
      if (confirmation.verificationId) {
        setIsSendingPhoneNumberToFirebase(false);

        navigation.navigate('AuthenticationStack', {
          screen: 'Verify',
          params: {
            from: 'whatsApp',
            method: 'change',
            phone: phoneNumber,
            phoneCode: phoneCode,
            verificationId: confirmation.verificationId,
            textDescription: t('login:smsDescription', {
              phoneNumber: maskPhoneNumber(phoneNumber)
            })
          }
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      logError({ phone: phone || '', error_message: `${errorCode} ${errorMessage}` });
      Sentry.withScope((scope) => {
        scope.setTag('user_phone', phoneNumber);
        scope.setTag('error_type', 'Request OTP from change phone number');
        Sentry.captureException(error);
      });
    }
    setIsSendingPhoneNumberToFirebase(false);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isFocused) return;

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleBackButton();
      return true;
    });

    return () => backHandler.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.dirty, formik.isValid, navigation, isFocused]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton onPress={handleBackButton} />
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.dirty, formik.isValid, navigation]);

  const handleOnSubmit = (newPhoneCode: string, newPhone: string) => {
    const payload = {
      new_phone: newPhone,
      phone_cc: newPhoneCode,
      lang: i18n.language as LanguageType
    };
    otpType === 'SMS' ? firebaseModifyPhone(payload) : modifyPhone(payload);
  };

  const handleBackButton = () => {
    if (formik.isValid && formik.dirty) {
      setShowConfirmModal(true);
    } else {
      navigation.goBack();
    }
  };

  useEffect(
    () => setLoading(isLoading || isSendingPhoneNumberToFirebase || isLogErrorLoading),
    [isLoading, isSendingPhoneNumberToFirebase, isLogErrorLoading, setLoading]
  );

  return (
    <>
      <LayoutScreen isNoPadding hasForm>
        <ChangePhoneNumberContainer>
          <View style={{ alignItems: 'center', paddingTop: 40 }}>
            <FormContainer>
              <InputText
                label={t('profileDetail:currentPhoneNumber')}
                value={phone || '-'}
                readonly
              />
              <InputPhoneNumber
                label={t('profileDetail:newPhoneNumber')}
                helperText={t('profileDetail:sendOTPPhoneNumber')}
                valueCode={formik.values.phone_cc}
                valuePhone={formik.values.new_phone}
                onChangeCode={(value) => formik.setFieldValue('phone_cc', value)}
                onChangePhone={(value) => {
                  formik.setFieldValue('new_phone', validationNumberFormat(value));
                }}
                isError={
                  (formik.touched.new_phone && !!formik.errors.new_phone) ||
                  (formik.touched.phone_cc && !!formik.errors.phone_cc)
                }
                errorText={formik.errors.new_phone || formik.errors.phone_cc}
              />
            </FormContainer>
          </View>
          <FooterContainer>
            <Button
              label={t('profileDetail:next')}
              onPress={() => formik.handleSubmit()}
              variant="background"
              borderRadius="88px"
              color={colors.secondary}
              isDisable={!(formik.dirty && formik.isValid && formik.values.new_phone.length >= 6)}
            />
          </FooterContainer>
        </ChangePhoneNumberContainer>
      </LayoutScreen>

      <ModalAlert
        title={t('common:leaveConfirmation')}
        description={t('common:leaveConfirmationDescChange')}
        isVisible={showConfirmModal}
        onCloseModal={() => setShowConfirmModal(false)}
        onPressYes={() => {
          navigation.goBack();
        }}
      />
    </>
  );
};

export default ChangePhoneNumberScreen;
