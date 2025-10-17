// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import { CommonActions, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LogoHorizontalGradientGray from 'assets/images/Logo/horizontal-logo-gradient-gray.svg';
import { Button } from 'components/Button';
import { Icon } from 'components/Icon';
import { InputPhoneNumber, InputText } from 'components/Input';
import { LayoutScreen } from 'components/layouts';
import { Spacer } from 'components/Spacer';
import { Text } from 'components/Text';
import { FormRegisterContext } from 'contexts/AppFormRegisterContext';
import { LoadingContext } from 'contexts/AppLoadingContext';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import { useFormik } from 'formik';
import { usePostRegister } from 'hooks/usePostRegister';
import { RegisterInterface } from 'interfaces/RegisterInterface';
import { LanguageType } from 'interfaces/TranslationInterface';
import { AuthenticationStackParamList } from 'navigators/AuthenticationStackNavigator';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Animated,
  Dimensions,
  Image,
  Keyboard,
  Platform,
  ScrollView,
  TouchableOpacity,
  View
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import styled from 'styled-components/native';
import colors from 'styles/colors';
import { validationNumberFormat } from 'utils/phoneNumber';

type RegisterScreenNavigationProps = StackNavigationProp<
  AuthenticationStackParamList & RootStackParamList
>;
type RegisterScreenRouteProps = RouteProp<AuthenticationStackParamList, 'Register'>;

const { height, width } = Dimensions.get('screen');

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

// eslint-disable-next-line sonarjs/cognitive-complexity
const RegisterScreen = () => {
  const translateY = useRef(new Animated.Value(0)).current;
  const trY = useRef(new Animated.Value(0)).current;
  const translateYText = useRef(new Animated.Value(0)).current;

  const { t, i18n } = useTranslation(['register', 'login']);
  const navigation = useNavigation<RegisterScreenNavigationProps>();
  const route = useRoute<RegisterScreenRouteProps>();

  const { email, phoneCode, phoneNumber } = route.params || {};

  const { setIsShowToast, setToastMessage, setType } = useContext(ModalToastContext);
  const { setFormValues } = useContext(FormRegisterContext);
  const { setLoading } = useContext(LoadingContext);

  const [isLoadingGuest, setIsLoadingGuest] = useState(false);

  const { mutateAsync: register, isLoading: loadingRegister } = usePostRegister({
    onSuccess: (data, payload) => {
      if (!data.error) {
        setFormValues((prevValues) => ({
          ...prevValues,
          fullname: payload.fullname,
          phone_cc: payload.phone_cc,
          phone: payload.phone,
          email: payload.email,
          is_email_notification: payload.is_email_notification
        }));
        formik.resetForm();
        navigation.navigate('Login');
      } else {
        setIsShowToast(true);
        setToastMessage(data.message);
        setType('error');
      }
    },
    onError: (res) => {
      let currentError = {};
      const errorMessage = res.response?.data.data;
      if (errorMessage) {
        for (let i = 0; i < Object.keys(errorMessage).length; i++) {
          currentError = {
            ...currentError,
            [Object.keys(errorMessage)[i]]: Object.values(errorMessage)[i]
          };
        }

        formik.setErrors(currentError);
      }
      if (res.code == 'ECONNABORTED' || res.response?.status == null) {
        setIsShowToast(true);
        setToastMessage(t('register:failedInfo'));
        setType('error');
      }
    }
  });

  const formik = useFormik<RegisterInterface>({
    initialValues: {
      fullname: '',
      phone: phoneNumber || '',
      phone_cc: phoneCode || '',
      email: email || '',
      lang: i18n.language as LanguageType,
      is_email_notification: false
    },
    onSubmit: async (values) => {
      await register(values);
    }
  });

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
      }
    }, 500);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingGuest]);

  useEffect(
    () => setLoading(loadingRegister || isLoadingGuest),
    [loadingRegister, isLoadingGuest, setLoading]
  );

  useEffect(() => {
    const isShowKeyboard = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const isHideKeyboard = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const keyboardDidShowListener = Keyboard.addListener(isShowKeyboard, (event) => {
      Animated.timing(trY, {
        toValue: -event.endCoordinates.height / 5, // Sesuaikan tinggi slide up
        duration: 300,
        useNativeDriver: true
      }).start();
      Animated.timing(translateY, {
        toValue: -event.endCoordinates.height / 2, // Sesuaikan tinggi slide up
        duration: 300,
        useNativeDriver: true
      }).start();
      Animated.timing(translateYText, {
        toValue: event.endCoordinates.height / 5, // Sesuaikan tinggi slide up
        duration: 300,
        useNativeDriver: true
      }).start();
    });

    const keyboardDidHideListener = Keyboard.addListener(isHideKeyboard, () => {
      Animated.timing(trY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();
      Animated.timing(translateYText, {
        toValue: 0, // Sesuaikan tinggi slide up
        duration: 300,
        useNativeDriver: true
      }).start();
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translateY]);

  return (
    <>
      <LayoutScreen
        backgroundColor={colors.light.whiteSolid}
        statusBarColor="transparent"
        isNoPadding
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            <Animated.View
              style={{
                flex: 1
              }}
            >
              <Image
                source={require('../assets/images/register-header.png')}
                style={{
                  width: width,
                  height: width * (251 / 360)
                }}
              />
              <TouchableOpacity
                style={{ position: 'absolute', top: (height / 812) * 46, left: 16 }}
                onPress={() => navigation.pop()}
              >
                <Icon name="chevronLeft" size="24" fill={colors.dark.gumbo} />
              </TouchableOpacity>
              <Animated.View
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
              </Animated.View>
            </Animated.View>
            <Animated.View
              style={{
                padding: 16,
                flex: 1
              }}
            >
              <LogoHorizontalGradientGray
                width="155px"
                height="40px"
                style={{ marginRight: 'auto' }}
              />
              <Spacer h={16} />
              <Text
                label={t('register:title')}
                fontWeight="semi-bold"
                variant="medium"
                color={colors.dark.blackCoral}
                textAlign="left"
              />
              <Spacer h={16} />
              <InputText
                label={t('register:nameLabel')}
                value={formik.values.fullname}
                onChange={(value) => formik.setFieldValue('fullname', value)}
                placeholder={t('register:namePlaceholder')}
                isError={formik.touched.fullname && !!formik.errors.fullname}
                errorText={formik.errors.fullname}
              />
              <Spacer h={12} />
              <InputPhoneNumber
                label={t('register:phoneLabel')}
                valueCode={formik.values.phone_cc}
                valuePhone={formik.values.phone}
                onChangeCode={(value) => formik.setFieldValue('phone_cc', value)}
                onChangePhone={(value) => {
                  formik.setFieldValue('phone', validationNumberFormat(value));
                }}
                isError={
                  (formik.touched.phone && !!formik.errors.phone) ||
                  (formik.touched.phone_cc && !!formik.errors.phone_cc)
                }
                errorText={formik.errors.phone || formik.errors.phone_cc}
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
                label={t('register:emailLabel')}
                value={formik.values.email}
                onChange={(value) => {
                  formik.setFieldValue('email', value);
                  if (value.length === 0) formik.setFieldValue('is_email_notification', false);
                }}
                placeholder={t('register:emailPlaceholder')}
                isError={formik.touched.email && !!formik.errors.email}
                errorText={formik.errors.email}
              />
              <Spacer h={12} />
              <BouncyCheckbox
                size={18}
                fillColor={colors.secondary}
                isChecked={formik.values.is_email_notification}
                onPress={(checked) => formik.setFieldValue('is_email_notification', checked)}
                iconStyle={{ borderRadius: 2 }}
                innerIconStyle={{
                  borderRadius: 2,
                  borderWidth: 2,
                  borderColor: !(formik.isValid && formik.values.email.length > 0)
                    ? colors.dark.solitude
                    : formik.values.is_email_notification
                      ? colors.secondary
                      : colors.dark.gumbo,
                  backgroundColor: !(formik.isValid && formik.values.email.length > 0)
                    ? colors.light.whiteSmoke
                    : formik.values.is_email_notification
                      ? colors.secondary
                      : colors.light.whiteSolid
                }}
                iconImageStyle={{ width: 12, height: 12 }}
                disabled={!(formik.isValid && formik.values.email.length > 0)}
                textComponent={
                  <Text
                    variant="small"
                    label="I agree to receive email regarding orders, updates, and offers."
                    color={
                      formik.isValid && formik.values.email.length > 0
                        ? colors.dark.blackCoral
                        : colors.dark.bermudaGrey
                    }
                    style={{ flex: 1 }}
                  />
                }
                style={{ gap: 8, marginHorizontal: 12 }}
              />
              <Spacer h={12} />
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
        <FooterContainer>
          <ActionRow>
            <Text
              label={`By continuing, I agree to${' '}`}
              fontWeight="regular"
              variant="extra-small"
              color={colors.dark.gumbo}
            />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('WebViewWithHeader', {
                  uri: 'https://www.sricandy.com/term-conditions'
                })
              }
            >
              <Text
                label="Terms of use"
                fontWeight="semi-bold"
                variant="extra-small"
                color={colors.secondary}
              />
            </TouchableOpacity>
            <Text
              label={`${' '}&${' '}`}
              fontWeight="regular"
              variant="extra-small"
              color={colors.dark.gumbo}
            />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('WebViewWithHeader', {
                  uri: 'https://www.sricandy.com/privacy-policy'
                })
              }
            >
              <Text
                label="Privacy Policy"
                fontWeight="semi-bold"
                variant="extra-small"
                color={colors.secondary}
              />
            </TouchableOpacity>
          </ActionRow>
          <Button
            label={t('login:register')}
            borderRadius="48px"
            height={40}
            isDisableColor={colors.light.whiteSmoke}
            isDisableTextColor={colors.dark.solitude}
            onPress={() => formik.handleSubmit()}
            variant="background"
            color={colors.secondary}
            isDisable={
              !(
                formik.values.email.length > 0 ||
                (formik.values.phone_cc.length > 0 && formik.values.phone.length >= 6)
              )
            }
          />
          <ActionRow>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text
                label={t('register:logIn')}
                fontWeight="semi-bold"
                variant="small"
                color={colors.secondary}
                style={{ textDecorationColor: colors.secondary }}
              />
            </TouchableOpacity>
            <Text label={' or '} fontWeight="regular" variant="small" color={colors.dark.gumbo} />
            <TouchableOpacity onPress={() => setIsLoadingGuest(true)}>
              <Text
                label="Explore as Guest"
                fontWeight="semi-bold"
                variant="small"
                color={colors.secondary}
                style={{ textDecorationColor: colors.secondary }}
              />
            </TouchableOpacity>
          </ActionRow>
        </FooterContainer>
      </LayoutScreen>
    </>
  );
};

export default RegisterScreen;
