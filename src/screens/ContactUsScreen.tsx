// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from 'components/Button';
import { InputPhoneNumber, InputText } from 'components/Input';
import { InputTextArea } from 'components/Input/TextArea';
import { LayoutScreen } from 'components/layouts';
import { ModalAlert } from 'components/Modal';
import { AccountContext } from 'contexts/AppAccountContext';
import { FormRegisterContext } from 'contexts/AppFormRegisterContext';
import { LoadingContext } from 'contexts/AppLoadingContext';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import { useFormik } from 'formik';
import { usePostContactUs } from 'hooks/usePostContactUs';
import { ContactUsInterface } from 'interfaces/ContactUsInterface';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, View } from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';
import { validationNumberFormat } from 'utils/phoneNumber';

const { width } = Dimensions.get('window');

interface ConfirmModal {
  open: boolean;
  onOk?: () => void;
}

const initialConfirmModal: ConfirmModal = {
  open: false,
  onOk: () => undefined
};

const Container = styled(View)`
  display: flex;
  flex: 1;
  gap: 8px;
`;

const FormContainer = styled(View)`
  background-color: ${colors.light.whiteSolid};
  display: flex;
  gap: 12px;
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
  flex-direction: column;
  padding: 16px 28px;
`;

const Border = styled(View)`
  border: 0.8px solid ${colors.dark.silver};
`;

type ContactUsScreenNavigationProps = StackNavigationProp<RootStackParamList>;

const ContactUsScreen = () => {
  const navigation = useNavigation<ContactUsScreenNavigationProps>();
  const { t } = useTranslation(['register']);

  const { state: accountState } = useContext(AccountContext);
  const { setIsShowToast, setToastMessage, setType } = useContext(ModalToastContext);
  const { formValues } = useContext(FormRegisterContext);
  const { setLoading } = useContext(LoadingContext);

  const [showConfirmModal, setShowConfirmModal] = useState<ConfirmModal>(initialConfirmModal);

  const phone = accountState.account?.phone?.slice(1);

  const { mutate: postContactUs, isLoading: isLoadingPostContactUs } = usePostContactUs({
    onSuccess: (res) => {
      if (!res.error) {
        navigation.pop();
        setIsShowToast(true);
        setToastMessage(res.message);
        setType('success');
      } else {
        if (res.errorType === 'FAILED') {
          setIsShowToast(true);
          setType('error');
          setToastMessage(res.message);
        } else if (res.errorType === 'TOO_MANY_REQUEST') {
          setShowConfirmModal({
            open: true,
            onOk: () => setShowConfirmModal(initialConfirmModal)
          });
        }
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
    }
  });

  const formik = useFormik<ContactUsInterface>({
    initialValues: {
      name:
        accountState.account?.firstName || accountState.account?.lastName
          ? `${accountState.account?.firstName} ${accountState.account?.lastName || ''}`
          : formValues.fullname || '',
      phone_cc: accountState.account?.phoneCC || formValues.phone_cc || '',
      phone: phone?.slice(accountState.account?.phoneCC.length) || formValues.phone || '',
      email: accountState.account?.email || formValues.email || '',
      subject: '',
      issue: ''
    },
    onSubmit: (values) => {
      const payload = {
        name: values.name,
        phone: values.phone_cc && values.phone ? `+${values.phone_cc} ${values.phone}` : '',
        email: values.email,
        subject: values.subject,
        issue: values.issue
      };

      postContactUs(payload);
    }
  });

  const isButtonDisabled =
    !formik.values.name ||
    !formik.values.phone_cc ||
    !formik.values.phone ||
    !formik.values.email ||
    !formik.values.subject ||
    !formik.values.issue ||
    formik.values.issue.length < 20;

  useEffect(() => setLoading(isLoadingPostContactUs), [isLoadingPostContactUs, setLoading]);

  return (
    <>
      <LayoutScreen isNoPadding hasForm isScrollable>
        <Container>
          <FormContainer>
            <InputText
              label="Name"
              value={formik.values.name}
              onChange={(value) => formik.setFieldValue('name', value)}
              placeholder="Enter your name"
              isError={formik.touched.name && !!formik.errors.name}
              errorText={formik.errors.name}
            />
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
            <InputText
              label={t('register:emailLabel')}
              value={formik.values.email}
              onChange={(value) => formik.setFieldValue('email', value)}
              placeholder={t('register:emailPlaceholder')}
              isError={formik.touched.email && !!formik.errors.email}
              errorText={formik.errors.email}
            />
          </FormContainer>
          <FormContainer>
            <InputTextArea
              label="Subject"
              value={formik.values.subject}
              onChange={(value) => formik.setFieldValue('subject', value)}
              placeholder="Enter subject"
              isError={formik.touched.subject && !!formik.errors.subject}
              errorText={formik.errors.subject}
              helperText="Max. 100 characters."
              maxLength={100}
              numberOfLines={4}
              isNotTextArea={true}
            />
            <InputTextArea
              label="Issues/Questions"
              value={formik.values.issue}
              onChange={(value) => formik.setFieldValue('issue', value)}
              placeholder="Enter your issues or questions"
              numberOfLines={7}
              isError={formik.touched.issue && !!formik.errors.issue}
              errorText={formik.errors.issue}
              maxLength={250}
              helperText="20-250 characters."
              borderStyle={{ paddingBottom: 16 }}
            />
          </FormContainer>
        </Container>
      </LayoutScreen>
      <FooterContainer>
        <Border />
        <FooterButton>
          <View style={{ flex: 1 }}>
            <Button
              label="Submit"
              onPress={() => formik.handleSubmit()}
              variant={'background'}
              color={colors.secondary}
              borderRadius="28px"
              height={40}
              isDisableColor={colors.light.whiteSmoke}
              isDisableTextColor={colors.dark.solitude}
              isDisableBorderColor={colors.dark.silver}
              isDisable={isButtonDisabled}
            />
          </View>
        </FooterButton>
      </FooterContainer>

      <ModalAlert
        title={'Unable to Submit'}
        description={'You have been reached maximum\nrequest limit.'}
        singleBtnLabel={'Close'}
        isVisible={showConfirmModal.open}
        onCloseModal={() => setShowConfirmModal(initialConfirmModal)}
        onPressYes={showConfirmModal.onOk}
      />
    </>
  );
};

export default ContactUsScreen;
