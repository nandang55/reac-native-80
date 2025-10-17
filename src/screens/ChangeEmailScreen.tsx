import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQueryClient } from '@tanstack/react-query';
import { BackButton } from 'components/BackButton';
import { Button } from 'components/Button';
import { InputText } from 'components/Input';
import { LayoutScreen } from 'components/layouts';
import { ModalAlert } from 'components/Modal';
import { SwitchToggle } from 'components/SwitchToggle';
import { Text } from 'components/Text';
import { AccountContext } from 'contexts/AppAccountContext';
import { LoadingContext } from 'contexts/AppLoadingContext';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import { useFormik } from 'formik';
import { usePostModifySubscribeEmail } from 'hooks/usePostModifySubscribeEmail';
import { usePutModifyEmail } from 'hooks/usePutModifyEmail';
import { ErrorModifyInterface } from 'interfaces/ProfileInterface';
import { LanguageType } from 'interfaces/TranslationInterface';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, Dimensions, View } from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';

type ChangeEmailNavigationScreen = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const ChangeEmailContainer = styled(View)`
  align-items: center;
  background-color: ${colors.light.whiteSolid};
  display: flex;
  flex: 1;
  justify-content: space-between;
  padding: 0px 24px 32px 24px;
  width: 100%;
`;

const FormContainer = styled(View)`
  display: flex;
  gap: 24px;
`;

const RowContainer = styled(View)`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const Border = styled(View)`
  border: 1px solid ${colors.dark.solitude};
`;

const FooterContainer = styled(View)`
  display: flex;
  gap: 16px;
  padding: 0 24px;
  width: ${width};
`;

const ChangeEmailScreen = () => {
  const navigation = useNavigation<ChangeEmailNavigationScreen>();
  const queryClient = useQueryClient();
  const isFocused = useIsFocused();
  const { t, i18n } = useTranslation(['profileDetail', 'common']);
  const { state: accountState } = useContext(AccountContext);
  const { setLoading } = useContext(LoadingContext);
  const { setIsShowToast, setToastMessage, setType } = useContext(ModalToastContext);

  const { email, isEmailNotification } = accountState.account || {};

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toggleNotification, setToggleNotification] = useState(isEmailNotification || false);

  const { mutate: modifyEmail } = usePutModifyEmail({
    onSuccess: async (data, payload) => {
      if (!data.error) {
        navigation.navigate('AuthenticationStack', {
          screen: 'Verify',
          params: {
            from: 'email',
            method: 'change',
            email: payload.new_email,
            textDescription: data.message as string
          }
        });
      }
    },
    onError: (error) => {
      const res = error.response?.data;
      if (res?.error) {
        const emailErrors = res.data as ErrorModifyInterface;
        formik.setErrors({ email: emailErrors?.new_email?.[0] });
      }
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  const { mutate: modifySubscribeEMail } = usePostModifySubscribeEmail({
    onSuccess: (res) => {
      if (!res.error) {
        setIsShowToast(true);
        setType('success');
        setToastMessage(res.message || '');
      }
    },
    // eslint-disable-next-line camelcase
    onMutate: async ({ is_email_notification }) => {
      const previousValue = toggleNotification;

      setToggleNotification(is_email_notification);
      return previousValue;
    },
    onError: (_err, _variable, previousValue) => {
      setToggleNotification(previousValue as boolean);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['useGetProfile']);
    }
  });

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    onSubmit: async (values) => {
      setLoading(true);
      handleOnSubmit(values.email);
    }
  });

  useEffect(() => {
    if (!isFocused) return;

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleBackButton();
      return true;
    });

    return () => backHandler.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.dirty, formik.isValid, navigation, isFocused]);

  useEffect(() => {
    setToggleNotification(isEmailNotification as boolean);
  }, [isEmailNotification]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton onPress={handleBackButton} />
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.dirty, formik.isValid, navigation]);

  const handleOnSubmit = (newEmail: string) => {
    // eslint-disable-next-line camelcase
    modifyEmail({ new_email: newEmail, lang: i18n.language as LanguageType });
  };

  const handleBackButton = () => {
    if (formik.isValid && formik.dirty) {
      setShowConfirmModal(true);
    } else {
      navigation.goBack();
    }
  };

  return (
    <>
      <LayoutScreen isNoPadding hasForm>
        <ChangeEmailContainer>
          <View style={{ alignItems: 'center', paddingTop: 40 }}>
            <FormContainer>
              <View style={{ gap: 12 }}>
                <InputText
                  label={t('profileDetail:currentEmailAddress')}
                  value={email || '-'}
                  readonly
                />
                <RowContainer>
                  <SwitchToggle
                    onPress={() =>
                      modifySubscribeEMail({
                        // eslint-disable-next-line camelcase
                        is_email_notification: !toggleNotification
                      })
                    }
                    switchOn={toggleNotification as boolean}
                    containerStyle={{
                      width: 36,
                      height: 20,
                      borderRadius: 100,
                      padding: 2
                    }}
                    circleStyle={{
                      width: 16,
                      height: 16,
                      borderRadius: 100
                    }}
                    circleColorOff={colors.light.whiteSolid}
                    circleColorOn={colors.light.whiteSolid}
                    backgroundColorOn={colors.secondary}
                    backgroundColorOff={email ? colors.dark.gumbo : colors.dark.solitude}
                    disabled={!email}
                  />
                  <Text
                    variant="extra-small"
                    label="I agree to receive email regarding orders, updates, and offers."
                    color={email ? colors.dark.gumbo : colors.dark.bermudaGrey}
                    style={{ flex: 1 }}
                  />
                </RowContainer>
              </View>
              <Border />
              <InputText
                label={t('profileDetail:newEmailAddress')}
                value={formik.values.email}
                onChange={(value) => formik.setFieldValue('email', value)}
                placeholder={t('profileDetail:enterYourEmailAddress')}
                isError={formik.touched.email && !!formik.errors.email}
                errorText={formik.errors.email}
                helperText={t('profileDetail:sendOTPEmail')}
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
              isDisable={!formik.dirty}
            />
          </FooterContainer>
        </ChangeEmailContainer>
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

export default ChangeEmailScreen;
