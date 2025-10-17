import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from 'components/Button';
import { InputText } from 'components/Input';
import { LayoutScreen } from 'components/layouts';
import { AccountContext } from 'contexts/AppAccountContext';
import { LoadingContext } from 'contexts/AppLoadingContext';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import { useFormik } from 'formik';
import { usePutModifyFullName } from 'hooks/usePutModifyFullName';
import { AccountStackParamList } from 'navigators/AccountStackNavigator';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, View } from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';
import * as Yup from 'yup';

type ChangeFullNameNavigationScreen = StackNavigationProp<AccountStackParamList>;

const ChangeFullNameValidationSchema = Yup.object().shape({
  fullName: Yup.string().required()
});

const { width } = Dimensions.get('window');

const ChangeFullNameContainer = styled(View)`
  align-items: center;
  background-color: ${colors.light.whiteSolid};
  display: flex;
  flex: 1;
  justify-content: space-between;
  padding-bottom: 32px;
`;

const FormContainer = styled(View)`
  display: flex;
  padding: 40px 24px;
  width: 100%;
`;

const FooterContainer = styled(View)`
  display: flex;
  gap: 16px;
  padding: 0 24px;
  width: ${width};
`;

const ChangeFullNameScreen = () => {
  const navigation = useNavigation<ChangeFullNameNavigationScreen>();
  const queryClient = useQueryClient();
  const { t } = useTranslation(['profileDetail', 'register']);

  const { state: accountState } = useContext(AccountContext);
  const { setIsShowToast, setToastMessage, setType } = useContext(ModalToastContext);
  const { setLoading } = useContext(LoadingContext);

  const { firstName, lastName } = accountState.account || {};

  const { mutate: modifyFullName } = usePutModifyFullName({
    onSuccess: async (data) => {
      if (!data.error) {
        queryClient.invalidateQueries(['useGetProfile']);
        navigation.navigate('ProfileDetail');
        setIsShowToast(true);
        setToastMessage(data.message);
        setType('success');
      }
    },
    onError: (error) => {
      const res = error.response?.data;
      if (res?.error) {
        setIsShowToast(true);
        setToastMessage(res.data.fullname?.[0]);
        setType('error');
      }
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  const formik = useFormik({
    initialValues: {
      fullName: firstName || lastName ? `${firstName} ${lastName || ''}` : ''
    },
    validationSchema: ChangeFullNameValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      modifyFullName({ fullname: values.fullName });
    }
  });

  return (
    <>
      <LayoutScreen isNoPadding hasForm>
        <ChangeFullNameContainer>
          <View style={{ alignItems: 'center' }}>
            <FormContainer>
              <InputText
                label={t('profileDetail:name')}
                value={formik.values.fullName}
                placeholder={t('register:namePlaceholder')}
                onChange={(value) => formik.setFieldValue('fullName', value)}
                isError={formik.touched.fullName && !!formik.errors.fullName}
                errorText={formik.errors.fullName}
              />
            </FormContainer>
          </View>
          <FooterContainer>
            <Button
              label={t('profileDetail:save')}
              onPress={() => formik.handleSubmit()}
              borderRadius="88px"
              variant="background"
              color={colors.secondary}
              isDisable={!(formik.isValid && formik.dirty)}
            />
          </FooterContainer>
        </ChangeFullNameContainer>
      </LayoutScreen>
    </>
  );
};

export default ChangeFullNameScreen;
