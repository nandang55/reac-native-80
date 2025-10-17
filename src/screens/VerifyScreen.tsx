/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable camelcase */
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import {
  CommonActions,
  NavigationProp,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import { useQueryClient } from '@tanstack/react-query';
import { Countdown } from 'components/Countdown';
import { Icon } from 'components/Icon';
import { InputOTP } from 'components/Input';
import { LayoutScreen } from 'components/layouts';
import { Text } from 'components/Text';
import config from 'config';
import { AccountContext } from 'contexts/AppAccountContext';
import { LoadingContext } from 'contexts/AppLoadingContext';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import { useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import { usePostErrorLogFirebase } from 'hooks/usePostErrorFirebase';
import { useEmailLogin, useFirebaseLogin, usePhoneLogin } from 'hooks/usePostLogin';
import { usePutModifyEmail } from 'hooks/usePutModifyEmail';
import { usePutFirebaseModifyPhone, usePutModifyPhone } from 'hooks/usePutModifyPhone';
import { ErrorLoginInterface } from 'interfaces/LoginInterface';
import { LanguageType } from 'interfaces/TranslationInterface';
import { AuthenticationStackParamList } from 'navigators/AuthenticationStackNavigator';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AndroidSoftInputModes, KeyboardController } from 'react-native-keyboard-controller';
import styled from 'styled-components';
import colors from 'styles/colors';

type VerifyScreenNavigationProps = NavigationProp<RootStackParamList>;
type VerifyScreenRouteProps = RouteProp<AuthenticationStackParamList, 'Verify'>;

const VerifyContainer = styled(View)`
  align-items: center;
  background-color: ${colors.light.whiteSolid};
  flex: 1;
  padding: 48px 24px 36px;
`;

const IconRounded = styled(View)`
  background-color: rgba(255, 71, 161, 0.1);
  border-radius: 20px;
  margin: 0 auto;
  padding: 10px 10.5px 11px;
`;

const HeadingContainer = styled(View)`
  display: flex;
  gap: 8px;
  padding: 32px 0 24px;
`;

const OTPContainer = styled(View)`
  align-items: center;
  display: flex;
  gap: 16px;
  padding-bottom: 48px;
`;

const DATA_COUNTDOWN: number = 120;
const LENGTH = 6;

const VerifyScreen = () => {
  const otpType = config.otpType;
  const route = useRoute<VerifyScreenRouteProps>();
  const navigation = useNavigation<VerifyScreenNavigationProps>();
  const { signIn } = useAuth();
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation(['login', 'common']);

  const [isLoading, setIsLoading] = useState(false);
  const [isCountdown, setIsCountdown] = useState(true);
  const [isResendCode, setIsResendCode] = useState(false);
  const [newVerificationId, setNewVerificationId] = useState<string | null>(null);
  const [isSendingPhoneNumberToFirebase, setIsSendingPhoneNumberToFirebase] = useState(false);
  const { setIsShowToast, setToastMessage, setType } = useContext(ModalToastContext);
  const { state: closeAccount } = useContext(AccountContext);
  const { setLoading } = useContext(LoadingContext);

  const { from, method, email, phone, phoneCode, verificationId, textDescription } = route.params;

  const { mutate: emailLogin } = useEmailLogin({
    onSuccess: async (data) => {
      if (!data.error && data.access_token) {
        await signIn(data);

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: closeAccount.close ? 'AccountStack' : 'MainBottomTabNavigator' }]
          })
        );

        formik.resetForm();
      } else {
        setIsCountdown(true);
      }
    },
    onError: (error) => {
      const res = error.response?.data;
      if (res?.error) {
        const otpErrors = res.data as ErrorLoginInterface;
        formik.setErrors({ otp: otpErrors?.verification_code?.[0] });
      }
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });

  const { mutate: phoneLogin } = usePhoneLogin({
    onSuccess: async (data) => {
      if (!data.error && data.access_token) {
        await signIn(data);

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: closeAccount.close ? 'AccountStack' : 'MainBottomTabNavigator' }]
          })
        );

        formik.resetForm();
      } else {
        setIsCountdown(true);
      }
    },
    onError: (error) => {
      const res = error.response?.data;
      if (res?.error) {
        const otpErrors = res.data as ErrorLoginInterface;
        formik.setErrors({ otp: otpErrors?.verification_code?.[0] });
      }
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });

  const { mutate: firebaseLogin } = useFirebaseLogin({
    onSuccess: async (data) => {
      if (!data.error && data.access_token) {
        await signIn(data);

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: closeAccount.close ? 'AccountStack' : 'MainBottomTabNavigator' }]
          })
        );
      }
    },
    onError: (error) => {
      const res = error.response?.data;
      if (res?.error) {
        const otpErrors = res.data as ErrorLoginInterface;
        formik.setErrors({ otp: otpErrors?.verification_code?.[0] });
      }
    },
    onSettled: () => {
      formik.resetForm();
      setIsLoading(false);
    }
  });

  const { mutate: changeEmail } = usePutModifyEmail({
    onSuccess: async (data) => {
      if (!data.error && !isResendCode) {
        queryClient.invalidateQueries(['useGetProfile']);
        setIsShowToast(true);
        setToastMessage(data.message as string);
        setType('success');

        navigation.navigate('AccountStack', { screen: 'ProfileDetail' });
        formik.resetForm();
      } else {
        setIsCountdown(true);
        setIsResendCode(false);
      }
    },
    onError: (error) => {
      const res = error.response?.data;
      if (res?.error) {
        const otpErrors = res.data as ErrorLoginInterface;
        formik.setErrors({ otp: otpErrors?.verification_code?.[0] });
      }
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });

  const { mutate: changePhone } = usePutModifyPhone({
    onSuccess: async (data) => {
      if (!data.error && !isResendCode) {
        queryClient.invalidateQueries(['useGetProfile']);
        setIsShowToast(true);
        setToastMessage(data.message as string);
        setType('success');

        navigation.navigate('AccountStack', { screen: 'ProfileDetail' });
        formik.resetForm();
      } else {
        setIsCountdown(true);
        setIsResendCode(false);
      }
    },
    onError: (error) => {
      const res = error.response?.data;
      if (res?.error) {
        const otpErrors = res.data as ErrorLoginInterface;
        formik.setErrors({ otp: otpErrors?.verification_code?.[0] });
      }
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });

  const { mutate: firebaseModifyPhone } = usePutFirebaseModifyPhone({
    onSuccess: async (data) => {
      if (!data.error && !isResendCode) {
        queryClient.invalidateQueries(['useGetProfile']);
        setIsShowToast(true);
        setToastMessage(data.message as string);
        setType('success');

        navigation.navigate('AccountStack', { screen: 'ProfileDetail' });
        formik.resetForm();
      } else {
        setIsCountdown(true);
        setIsResendCode(false);
      }
    },
    onError: (error) => {
      const res = error.response?.data;
      if (res?.error) {
        const otpErrors = res.message as ErrorLoginInterface;
        formik.setErrors({ otp: otpErrors?.verification_code?.[0] });
      }
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });

  const { mutate: logError, isLoading: isLogErrorLoading } = usePostErrorLogFirebase({
    onSuccess: (_, payload) => {
      if (
        payload.error_message.includes('auth/invalid-verification-code') ||
        payload.error_message.includes('auth/invalid-credential') ||
        payload.error_message.includes('auth/session-expired')
      ) {
        formik.setErrors({ otp: t('login:verification.failed') });
      } else {
        setIsShowToast(true);
        setToastMessage(t('login:verification.errorGeneral'));
        setType('error');
      }
    }
  });

  const formik = useFormik({
    initialValues: {
      otp: ''
    },
    onSubmit: async (values) => {
      handleOnSubmit(values.otp);
    }
  });

  const sendOTP = async (otpInput: string) => {
    setIsSendingPhoneNumberToFirebase(true);
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        newVerificationId || (verificationId as string),
        otpInput
      );
      const match = await auth().signInWithCredential(credential);
      if (!match.user) {
        formik.resetForm();
        setIsSendingPhoneNumberToFirebase(false);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      logError({ phone: phone || '', error_message: `${errorCode} ${errorMessage}` });
      Sentry.withScope((scope) => {
        scope.setTag('user_phone', phone);
        scope.setTag('error_type', 'Verify OTP');
        Sentry.captureException(error);
      });
    }
    setIsLoading(false);
    setIsSendingPhoneNumberToFirebase(false);
  };

  const resendOtpWithFirebase = async (phoneNumber: string) => {
    setIsSendingPhoneNumberToFirebase(true);
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      firebase.auth().signOut();
    }
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber, true);
      if (confirmation.verificationId) {
        setNewVerificationId(confirmation.verificationId);
        setIsSendingPhoneNumberToFirebase(false);
        setIsResendCode(false);
        setIsCountdown(true);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      logError({ phone: phoneNumber, error_message: `${errorCode} ${errorMessage}` });
      Sentry.withScope((scope) => {
        scope.setTag('user_phone', phoneNumber);
        scope.setTag('error_type', 'Resend OTP');
        Sentry.captureException(error);
      });
    }
    setIsLoading(false);
    setIsSendingPhoneNumberToFirebase(false);
    setIsResendCode(false);
  };

  const handleOnSubmit = (otp: string) => {
    const loginAction = () => {
      if (from === 'email') {
        emailLogin({ email, verification_code: otp, lang: i18n.language as LanguageType });
      } else {
        otpType === 'SMS'
          ? sendOTP(otp)
          : phoneLogin({ phone, verification_code: otp, lang: i18n.language as LanguageType });
      }
    };

    const changeAction = () => {
      if (from === 'email') {
        changeEmail({
          new_email: email,
          verification_code: otp,
          lang: i18n.language as LanguageType
        });
      } else {
        otpType === 'SMS'
          ? sendOTP(otp)
          : changePhone({
              new_phone: phone,
              verification_code: otp,
              lang: i18n.language as LanguageType
            });
      }
    };

    method === 'login' ? loginAction() : changeAction();
  };

  const handleResendCode = () => {
    const loginResendAction = () => {
      if (from === 'email') {
        emailLogin({ email, lang: i18n.language as LanguageType });
      } else {
        otpType === 'SMS'
          ? resendOtpWithFirebase(`+${phoneCode}${phone}`)
          : phoneLogin({ phone, lang: i18n.language as LanguageType });
      }
    };

    const changeResendAction = () => {
      setIsResendCode(true);
      if (from === 'email') {
        changeEmail({ new_email: email, lang: i18n.language as LanguageType });
      } else {
        otpType === 'SMS'
          ? resendOtpWithFirebase(`+${phoneCode}${phone}`)
          : changePhone({ new_phone: phone, lang: i18n.language as LanguageType });
      }
    };

    if (!isCountdown) {
      setIsLoading(true);
      method === 'login' ? loginResendAction() : changeResendAction();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onAuthStateChanged = async (user: any) => {
    const loginAction = () =>
      firebaseLogin({
        firebase_id: user.uid,
        phone: `+${phoneCode}${phone}`,
        lang: i18n.language as LanguageType
      });

    const changeAction = () =>
      firebaseModifyPhone({
        firebase_id: user.uid,
        new_phone: phone as string,
        phone_cc: phoneCode
      });

    if (user) {
      method === 'login' ? loginAction() : changeAction();
    }
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(onAuthStateChanged);

    return () => unsubscribe();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (formik.values.otp.length === LENGTH) {
      setIsLoading(true);
      formik.handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.otp]);

  useFocusEffect(
    useCallback(() => {
      KeyboardController.setInputMode(AndroidSoftInputModes.SOFT_INPUT_ADJUST_NOTHING);

      return () => KeyboardController.setDefaultMode();
    }, [])
  );

  useEffect(
    () => setLoading(isLoading || isSendingPhoneNumberToFirebase || isLogErrorLoading),
    [isLoading, isSendingPhoneNumberToFirebase, isLogErrorLoading, setLoading]
  );

  return (
    <>
      <LayoutScreen backgroundColor={colors.light.whiteSolid} isNoPadding isFooter>
        <VerifyContainer>
          <IconRounded>
            <Icon
              name={from === 'email' ? 'emailFast' : 'phoneChat'}
              size="64"
              color={colors.secondary}
            />
          </IconRounded>
          <HeadingContainer>
            <Text
              label={t('login:verification.enterOTP')}
              fontWeight="semi-bold"
              variant="extra-larger"
              color={colors.dark.gumbo}
              textAlign="center"
            />
            <Text
              label={textDescription}
              fontWeight="regular"
              variant="medium"
              color={colors.dark.gumbo}
              textAlign="center"
            />
          </HeadingContainer>
          <OTPContainer>
            <InputOTP
              value={formik.values.otp}
              length={6}
              onOTPChange={(otp) => formik.setFieldValue('otp', otp)}
            />
            {!!formik.errors.otp && (
              <Text label={formik.errors.otp} color={colors.red.americanRed} />
            )}
            <TouchableOpacity onPress={handleResendCode} style={{ flexDirection: 'row' }}>
              <Text
                label={
                  isCountdown
                    ? `${t('login:verification.resendOTP')} ${t('common:in')} `
                    : t('login:verification.resendOTP')
                }
                fontWeight={isCountdown ? 'regular' : 'semi-bold'}
                variant={isCountdown ? 'small' : 'medium'}
                color={isCountdown ? colors.dark.gumbo : colors.secondary}
                textAlign="center"
                textDecoration={isCountdown ? 'none' : 'underline'}
                style={{ textDecorationColor: colors.secondary }}
              />
              {isCountdown && (
                <Countdown
                  initialSeconds={DATA_COUNTDOWN}
                  onComplete={() => setIsCountdown(false)}
                />
              )}
            </TouchableOpacity>
          </OTPContainer>
          {method === 'login' && (
            <TouchableOpacity
              onPress={() =>
                navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] }))
              }
            >
              <Text
                fontWeight="semi-bold"
                textDecoration="underline"
                label={t('login:verification.chooseAnotherLoginMethod')}
                variant="small"
                textAlign="center"
                color={colors.secondary}
                style={{ textDecorationColor: colors.secondary }}
              />
            </TouchableOpacity>
          )}
        </VerifyContainer>
      </LayoutScreen>
    </>
  );
};

export default VerifyScreen;
