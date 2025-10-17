// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import { RouteProp, useRoute } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from 'components/Button';
import { InputPhoneNumber, InputText } from 'components/Input';
import { InputTextArea } from 'components/Input/TextArea';
import { LayoutScreen } from 'components/layouts';
import { Text } from 'components/Text';
import { LoadingContext } from 'contexts/AppLoadingContext';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import { useFormik } from 'formik';
import useGetProfile from 'hooks/useGetProfile';
import { usePostOrderInquiry } from 'hooks/usePostOrderInquiry';
import { OrderInquiryInterface } from 'interfaces/OrderInterface';
import { ProfileInterface } from 'interfaces/ProfileInterface';
import { OrderStackParamList } from 'navigators/OrderStackNavigator';
import { navigationRef } from 'navigators/RootStackNavigator';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';
import { validationNumberFormat } from 'utils/phoneNumber';

const { width } = Dimensions.get('window');

const Container = styled(View)`
  background-color: ${colors.light.whiteSolid};
  display: flex;
  flex: 1;
  gap: 24px;
`;

const Heading = styled(View)`
  display: flex;
  gap: 24px;
`;

const FormContainer = styled(View)`
  display: flex;
  gap: 12px;
`;

const FooterContainer = styled(View)`
  background-color: ${colors.light.whiteSolid};
  bottom: 0;
  position: absolute;
  width: ${width};
`;

const FooterButton = styled(View)`
  flex: 1;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
  padding: 16px;
`;

const Border = styled(View)`
  border: 0.8px solid ${colors.dark.solitude};
`;

type OrderDetailScreenRouteProps = RouteProp<OrderStackParamList, 'OrderInquiry'>;

const OrderInquiryScreen = () => {
  const queryClient = useQueryClient();
  const route = useRoute<OrderDetailScreenRouteProps>();
  const { t } = useTranslation(['register', 'profileDetail', 'orderDetail']);
  const { setIsShowToast, setToastMessage, setType } = useContext(ModalToastContext);
  const { setLoading } = useContext(LoadingContext);

  const { data, isSuccess } = useGetProfile({});
  const me = isSuccess ? data?.data : ({} as ProfileInterface);

  const { mutate: postOrderInquiry, isLoading: isLoadingPostOrderInquiry } = usePostOrderInquiry({
    onSuccess: (res) => {
      if (res.error) {
        setIsShowToast(true);
        setType('error');
        setToastMessage(res.message);
      } else {
        setIsShowToast(true);
        setType('success');
        setToastMessage(res.message);
        navigationRef.goBack();
        queryClient.invalidateQueries(['useGetOrderDetail']);
      }
    },
    onError: (res) => {
      let currentError = {};
      const errorMessage = res.response?.data.errors;

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

  const formik = useFormik<OrderInquiryInterface>({
    initialValues: {
      phone: me?.phone?.slice(3, me?.phone.length),
      phone_cc: me?.phoneCC ?? '',
      email: me?.email || '',
      inquiry: ''
    },
    onSubmit: (values) => {
      const payload = {
        id: route.params.id,
        phone: `+${values.phone_cc}${values.phone}`,
        email: values.email,
        inquiry: values.inquiry
      };

      if (values.phone && values.phone_cc) {
        postOrderInquiry(payload);
      }
    }
  });

  const isButtonDisabled =
    !formik.values.phone_cc ||
    !formik.values.phone ||
    !formik.values.email ||
    !formik.values.inquiry;

  useEffect(() => setLoading(isLoadingPostOrderInquiry), [isLoadingPostOrderInquiry, setLoading]);

  return (
    <>
      <LayoutScreen isNoPadding>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <Container style={{ paddingTop: 32, paddingHorizontal: 24 }}>
            <Heading>
              <Text
                label={t('orderDetail:orderInquiry')}
                color={colors.dark.gumbo}
                variant="extra-large"
                fontWeight="semi-bold"
                textAlign="center"
              />
              <Text
                label={t('orderDetail:orderInquiryScreenDesc')}
                color={colors.dark.gumbo}
                style={{ paddingHorizontal: 28 }}
                variant="small"
                fontWeight="regular"
                textAlign="center"
              />
            </Heading>
            <FormContainer>
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
              <InputTextArea
                label={t('orderDetail:inquiry')}
                value={formik.values.inquiry}
                onChange={(value) => formik.setFieldValue('inquiry', value)}
                placeholder={t('orderDetail:inquiryPlaceholder')}
                numberOfLines={7}
                maxLength={250}
                helperText={t('orderDetail:inquiryMaxChar')}
              />
            </FormContainer>
            <FooterContainer>
              <Border />
              <FooterButton>
                <View style={{ flex: 1 }}>
                  <Button
                    label={t('orderDetail:submitInquiry')}
                    onPress={() => formik.handleSubmit()}
                    variant={!formik.values.phone ? 'background' : 'secondary'}
                    color={colors.light.whiteSolid}
                    textColor={colors.dark.gumbo}
                    borderColor={colors.dark.gumbo}
                    borderRadius="28px"
                    height={48}
                    isDisableColor={colors.light.whiteSmoke}
                    isDisableTextColor={colors.dark.solitude}
                    isDisableBorderColor={colors.dark.silver}
                    isDisable={isButtonDisabled}
                  />
                </View>
              </FooterButton>
            </FooterContainer>
          </Container>
        </TouchableWithoutFeedback>
      </LayoutScreen>
    </>
  );
};

export default OrderInquiryScreen;
