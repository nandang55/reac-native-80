import auth from '@react-native-firebase/auth';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Sentry from '@sentry/react-native';
import LogoHorizontalGradientGray from 'assets/images/Logo/horizontal-logo-gradient-gray.svg';
import { Button } from 'components/Button';
import { Icon } from 'components/Icon';
import { InputPhoneNumber, InputText } from 'components/Input';
import { LayoutScreen } from 'components/layouts';
import { ModalAlert } from 'components/Modal';
import { Spacer } from 'components/Spacer';
import { Text } from 'components/Text';
import config from 'config';
import { AccountContext } from 'contexts/AppAccountContext';
import { LoadingContext } from 'contexts/AppLoadingContext';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import { _retrieveLocalStorageItem, _storeLocalStorageItem } from 'core/utils/localStorage';
import { useFormik } from 'formik';
import { usePostErrorLogFirebase } from 'hooks/usePostErrorFirebase';
import { useCheckUserByPhoneLogin, useEmailLogin, usePhoneLogin } from 'hooks/usePostLogin';
import { ErrorLoginInterface } from 'interfaces/LoginInterface';
import { LanguageType } from 'interfaces/TranslationInterface';
import { reset, RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  Text as TextReactNative,
  TouchableOpacity,
  View
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import styled from 'styled-components/native';
import colors from 'styles/colors';
import { maskEmailAddress, maskPhoneNumber } from 'utils/maskHelper';
import { validationNumberFormat } from 'utils/phoneNumber';
import * as Yup from 'yup';

type LoginScreenNavigationProps = StackNavigationProp<RootStackParamList>;

const OrContainer = styled(View)`
  align-items: center;
  flex-direction: row;
  gap: 5px;
  justify-content: space-between;
`;

const Border = styled(View)`
  background-color: ${colors.dark.solitude};
  flex: 1;
  height: 1px;
`;

const FooterContainer = styled(View)`
  background-color: ${colors.light.whiteSolid};
  display: flex;
  gap: 8px;
  padding: 16px;
  width: 100%;
`;

const ActionRow = styled(View)`
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

interface ConfirmModal {
  open: boolean;
  title: string;
  value: string;
  type?: 'email' | 'phone number';
  onOk?: () => void;
}

const initialConfirmModal: ConfirmModal = {
  open: false,
  title: '',
  value: '',
  type: undefined,
  onOk: () => undefined
};

const { height, width } = Dimensions.get('screen');

const LoginScreen = () => {
  const otpType = config.otpType;
  const navigation = useNavigation<LoginScreenNavigationProps>();
  const { t, i18n } = useTranslation(['login']);

  const { setIsShowToast, setToastMessage, setType } = useContext(ModalToastContext);
  const { setLoading } = useContext(LoadingContext);
  const { dispatch } = useContext(AccountContext);

  const [showConfirmModal, setShowConfirmModal] = useState<ConfirmModal>(initialConfirmModal);
  const [isSendingPhoneNumberToFirebase, setIsSendingPhoneNumberToFirebase] = useState(false);
  const [isLoadingGuest, setIsLoadingGuest] = useState(false);

  const { mutate: emailLogin, isLoading: loadingEmailLogin } = useEmailLogin({
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
      } else {
        if (data.errorType === 'UNREGISTERED') {
          setShowConfirmModal({
            open: true,
            title: 'Unable to Log In',
            value: payload.email as string,
            type: 'email',
            onOk: () => {
              navigation.navigate('AuthenticationStack', {
                screen: 'Register',
                params: { email: payload.email }
              });
              formik.resetForm();
            }
          });
        }
      }
    },
    onError: (error) => {
      const res = error.response?.data;
      if (res?.error) {
        const emailErrors = res.data as ErrorLoginInterface;
        formik.setErrors({ email: emailErrors?.email?.[0] });
      }
    }
  });

  const { mutate: checkUserByPhoneLogin, isLoading: loadingCheckUserByPhoneLogin } =
    useCheckUserByPhoneLogin({
      onSuccess: async (data, payload) => {
        if (!data.error) {
          phoneLogin({
            phone: payload.phone,
            lang: i18n.language as LanguageType
          });
        } else {
          if (data.errorType === 'UNREGISTERED') {
            setShowConfirmModal({
              open: true,
              title: 'Unable to Log In',
              value: `+${formik.values.code} ${formik.values.phoneNumber}`,
              type: 'phone number',
              onOk: () => {
                navigation.navigate('AuthenticationStack', {
                  screen: 'Register',
                  params: {
                    phoneCode: formik.values.code,
                    phoneNumber: formik.values.phoneNumber
                  }
                });
                formik.resetForm();
              }
            });
          }
        }
      }
    });

  const { mutate: phoneLogin, isLoading: loadingPhoneLogin } = usePhoneLogin({
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
    }
  });

  const { mutate: logError, isLoading: isLogErrorLoading } = usePostErrorLogFirebase({
    onSuccess: () => {
      setIsShowToast(true);
      setToastMessage(t('login:verification.errorGeneral'));
      setType('error');
    }
  });

  const RegisterValidationSchema = Yup.object().shape({
    email: Yup.string().email(t('login:loginByEmail.invalid'))
  });

  const formik = useFormik({
    initialValues: {
      code: '',
      phoneNumber: '',
      email: ''
    },
    validationSchema: RegisterValidationSchema,
    onSubmit: (values) => {
      if (values.email) {
        emailLogin({ email: values.email, lang: i18n.language as LanguageType });
      } else {
        checkUserByPhoneLogin({
          phone: '+' + values.code + values.phoneNumber,
          lang: i18n.language as LanguageType
        });
      }
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

  useEffect(() => {
    const retrieveIntroViewed = async () => await _retrieveLocalStorageItem('IntroViewed');

    const setIntroViewed = async () => {
      const introViewed = await retrieveIntroViewed();
      if (introViewed !== 'yes') {
        await _storeLocalStorageItem({ storageKey: 'IntroViewed', storageValue: 'yes' });
      }
    };

    setIntroViewed();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoadingGuest) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'MainBottomTabNavigator' }]
          })
        );
        setIsLoadingGuest(false);
        dispatch({ type: 'RemoveCloseAccount' });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingGuest]);

  useEffect(
    () =>
      setLoading(
        loadingEmailLogin ||
          isLogErrorLoading ||
          loadingPhoneLogin ||
          loadingCheckUserByPhoneLogin ||
          isSendingPhoneNumberToFirebase ||
          isLoadingGuest
      ),
    [
      loadingEmailLogin,
      isLogErrorLoading,
      loadingPhoneLogin,
      loadingCheckUserByPhoneLogin,
      isSendingPhoneNumberToFirebase,
      isLoadingGuest,
      setLoading
    ]
  );

  return (
    <>
      <LayoutScreen
        isNoPadding
        statusBarColor="transparent"
        backgroundColor={colors.light.whiteSolid}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            <View
              style={{
                flex: 1
              }}
            >
              <Image
                source={require('../assets/images/login-header.png')}
                style={{ width: width, height: width * (351 / 360) }}
              />
              <TouchableOpacity
                style={{ position: 'absolute', top: (height / 812) * 46, left: 16 }}
                onPress={() => {
                  navigation.canGoBack() ? navigation.pop() : reset('MainBottomTabNavigator');
                  dispatch({ type: 'RemoveCloseAccount' });
                }}
              >
                <Icon name="chevronLeft" size="24" fill={colors.dark.gumbo} />
              </TouchableOpacity>
              <View
                style={{
                  position: 'absolute',
                  alignItems: 'center',
                  top: '65%',
                  left: 0,
                  right: 0,
                  width: '100%'
                }}
              >
                <Text
                  label="Endless unique designs"
                  variant="large"
                  fontWeight="regular"
                  color={colors.dark.color1}
                  textAlign="center"
                />
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                  <Text
                    label={`just for${' '}`}
                    variant="large"
                    fontWeight="regular"
                    color={colors.dark.color1}
                    textAlign="center"
                  />
                  <Text
                    label="YOU"
                    fontWeight="bold"
                    variant="large"
                    color={colors.dark.color1}
                    textAlign="center"
                  />
                </View>
              </View>
            </View>
            <View
              style={{
                padding: 16,
                position: 'relative'
              }}
            >
              <LogoHorizontalGradientGray
                width="155px"
                height="40px"
                style={{ marginRight: 'auto' }}
              />
              <Spacer h={16} />
              <Text
                label={t('login:login')}
                fontWeight="semi-bold"
                variant="medium"
                color={colors.dark.blackCoral}
                textAlign="left"
              />
              <Spacer h={16} />
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
                isDisabled={!!formik.values.email}
              />
              <Spacer h={12} />
              <OrContainer>
                <Border />
                <Text
                  label="OR"
                  fontWeight="semi-bold"
                  variant="small"
                  color={colors.secondary}
                  textAlign="center"
                />
                <Border />
              </OrContainer>
              <Spacer h={12} />
              <InputText
                label={t('login:loginByEmail.label')}
                value={formik.values.email}
                onChange={(value) => formik.setFieldValue('email', value)}
                placeholder={t('login:loginByEmail.placeholder')}
                isError={formik.touched.email && !!formik.errors.email}
                errorText={formik.errors.email}
                isDisabled={!!formik.values.code || !!formik.values.phoneNumber}
              />
              <Spacer h={16} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <FooterContainer>
          <Button
            label={t('login:login')}
            borderRadius="48px"
            height={40}
            isDisableColor={colors.light.whiteSmoke}
            isDisableTextColor={colors.dark.solitude}
            onPress={() => formik.handleSubmit()}
            variant="background"
            color={colors.secondary}
            isDisable={
              !(
                formik.dirty &&
                ((formik.values.email.length > 0 && formik.isValid) ||
                  (formik.values.code.length > 0 && formik.values.phoneNumber.length >= 6))
              )
            }
          />
          <ActionRow>
            <Text
              label={`${t('login:loginByPhone.unregistered')} `}
              fontWeight="regular"
              variant="small"
              color={colors.dark.gumbo}
            />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AuthenticationStack', { screen: 'Register' });
                dispatch({ type: 'RemoveCloseAccount' });
              }}
            >
              <Text
                label={t('login:register')}
                fontWeight="semi-bold"
                variant="small"
                color={colors.secondary}
              />
            </TouchableOpacity>
            <Text
              label={`${' '}or${' '}`}
              fontWeight="regular"
              variant="small"
              color={colors.dark.gumbo}
            />
            <TouchableOpacity
              onPress={() => {
                setIsLoadingGuest(true);
              }}
            >
              <Text
                label="Explore as Guest"
                fontWeight="semi-bold"
                variant="small"
                color={colors.secondary}
              />
            </TouchableOpacity>
          </ActionRow>
        </FooterContainer>
      </LayoutScreen>
      <ModalAlert
        title={showConfirmModal.title}
        description={''}
        isVisible={showConfirmModal.open}
        onCloseModal={() => setShowConfirmModal(initialConfirmModal)}
        onPressYes={showConfirmModal.onOk}
      >
        <TextReactNative
          style={{
            width: '100%',
            flexDirection: 'row',
            textAlign: 'center',
            marginBottom: 8
          }}
        >
          <Text
            label={showConfirmModal.value}
            fontWeight="bold"
            variant="medium"
            color={colors.dark.blackCoral}
            textAlign="center"
          />
          <Text
            label={`${' '} has not been registered.`}
            fontWeight="regular"
            variant="medium"
            color={colors.dark.blackCoral}
            textAlign="center"
          />
        </TextReactNative>
        <Text
          label={`Register this ${showConfirmModal.type} to continue?`}
          fontWeight="regular"
          variant="medium"
          color={colors.dark.blackCoral}
          textAlign="center"
        />
      </ModalAlert>
    </>
  );
};

export default LoginScreen;
