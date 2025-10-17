/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable camelcase */
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQueryClient } from '@tanstack/react-query';
import { BackButton } from 'components/BackButton';
import { Button } from 'components/Button';
import { InputPhoneNumber, InputText } from 'components/Input';
import { InputTextArea } from 'components/Input/TextArea';
import { LayoutScreen } from 'components/layouts';
import { ModalAlert } from 'components/Modal';
import { Spacer } from 'components/Spacer';
import { Text } from 'components/Text';
import { LoadingContext } from 'contexts/AppLoadingContext';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import { useFormik } from 'formik';
import { useGetAddressSuggestion } from 'hooks/useGetAddressSuggestion';
import useGetShippingAddressDetail from 'hooks/useGetShippingAddressDetail';
import { usePutModifyShippingAddress } from 'hooks/usePutModifyShippingAddress';
import { BaseAddressInterface } from 'interfaces/AddressInterface';
import { AddressStackParamList } from 'navigators/AddressStackNavigator';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, Dimensions, View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import styled from 'styled-components/native';
import colors from 'styles/colors';
import { validationNumberFormat } from 'utils/phoneNumber';
import * as Yup from 'yup';

interface ConfirmModal {
  open: boolean;
  title: string;
  description: string;
  onOk: () => void;
}

const initialConfirmModal: ConfirmModal = {
  open: false,
  title: '',
  description: '',
  onOk: () => undefined
};

const { width } = Dimensions.get('window');

const AddressContainer = styled(View)`
  align-items: center;
  background-color: ${colors.light.whiteSolid};
  flex: 1;
  padding: 24px 24px 100px 24px;
`;

const Heading = styled(View)`
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
  width: 100%;
`;

const FormList = styled(View)`
  display: flex;
  gap: 16px;
  padding-top: 8px;
  width: 100%;
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
  border: 0.5px solid ${colors.dark.bermudaGrey};
`;

const CheckboxContainer = styled(View)`
  padding: 0 24px;
  width: ${width};
`;

type ModifyAddressScreenNavigationProps = StackNavigationProp<RootStackParamList>;
type ModifyAddressScreenRouteProps = RouteProp<AddressStackParamList, 'ModifyAddress'>;

const ModifyAddressScreen = () => {
  const { t } = useTranslation(['address']);
  const route = useRoute<ModifyAddressScreenRouteProps>();
  const navigation = useNavigation<ModifyAddressScreenNavigationProps>();
  const queryClient = useQueryClient();

  const { setIsShowToast, setToastMessage, setType } = useContext(ModalToastContext);
  const { setLoading } = useContext(LoadingContext);

  const { id, isPrimary } = route.params;

  const [showConfirmModal, setShowConfirmModal] = useState<ConfirmModal>(initialConfirmModal);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [isAddressFromSuggestion, setIsAddressFromSuggestion] = useState(false);
  const [isPostalCodeFilled, setIsPostalCodeFilled] = useState(false);

  const fillColor = isPrimary ? colors.dark.bermudaGrey : colors.secondary;

  const { data: dataShippingAddressDetailDetail, isFetching: loadingShippingAddressDetail } =
    useGetShippingAddressDetail({
      id: id as string,
      options: {
        enabled: !!id,
        refetchOnWindowFocus: false
      }
    });

  const {
    postal_code,
    receipt_name,
    receipt_phone,
    receipt_phone_cc,
    label,
    address,
    floor_or_unit,
    is_primary
  } = dataShippingAddressDetailDetail?.data || {};

  const { mutate: changeShippingAddress, isLoading: loadingChangeShippingAddress } =
    usePutModifyShippingAddress(id as string, {
      onSuccess: async (data) => {
        if (!data.error) {
          if (queryClient.getQueryData(['useGetShippingAddressList'])) {
            queryClient.invalidateQueries(['useGetShippingAddressList']);
          }
          setToastMessage(data.message);
        }
      },
      onError: (error) => {
        const res = error.response?.data;
        if (res?.message) {
          setIsShowToast(true);
          setToastMessage(res.message);
          setType('error');
        }
      },
      onSettled: (data) => {
        if (!data?.error) {
          setTimeout(() => {
            navigation.pop();
            setIsShowToast(true);
            setType('success');
          }, 500);
        }
      }
    });

  const formik = useFormik<BaseAddressInterface>({
    enableReinitialize: true,
    initialValues: {
      receipt_name: receipt_name || '',
      receipt_phone: receipt_phone?.replace(new RegExp(`^\\+${receipt_phone_cc}`), '') || '',
      receipt_phone_cc: receipt_phone_cc || '',
      label: label || '',
      address: address || '',
      postal_code: postal_code || '',
      floor_or_unit: floor_or_unit || '',
      is_primary: is_primary || false
    },
    validationSchema: Yup.object().shape({
      receipt_name: Yup.string().required(),
      receipt_phone: Yup.string().min(8, t('address:common.phoneDigitMin')).max(16).required(),
      receipt_phone_cc: Yup.string().min(1, t('address:common.phoneDigitMin')).max(4).required(),
      label: Yup.string().required(),
      address: Yup.string().required(),
      //TODO: get error validation from response api
      postal_code: Yup.string()
        .min(6, 'Postal Code should be 6 digits number.')
        .required('Postal Code should be 6 digits number.'),
      floor_or_unit: Yup.string().optional(),
      is_primary: Yup.boolean().optional()
    }),
    validateOnMount: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      if (isPrimary !== formik.values.is_primary) {
        setShowConfirmModal({
          open: true,
          title: t('address:modify.confirmChangeTitle'),
          description: t('address:modify.confirmChangeDescription'),
          onOk: () => {
            changeShippingAddress(values);
          }
        });
      } else {
        changeShippingAddress(values);
      }
    }
  });

  const { data: addressSuggestionData } = useGetAddressSuggestion({
    params: { postalCode: formik.values.postal_code },
    options: { enabled: formik.values.postal_code.length === 6 }
  });

  useEffect(() => {
    if (
      formik.values.postal_code.length === 6 &&
      addressSuggestionData?.data?.address &&
      isPostalCodeFilled
    ) {
      setShowSuggestion(true);
    }
  }, [
    formik.values.postal_code,
    formik.touched.postal_code,
    addressSuggestionData?.data,
    isPostalCodeFilled
  ]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleBackButton();
      return true;
    });

    return () => backHandler.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton onPress={handleBackButton} tintColor="white" />
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const handleBackButton = () => {
    if (formik.isValid || formik.dirty) {
      setShowConfirmModal({
        open: true,
        title: t('address:common.confirmLeaveTitle'),
        description: t('address:common.confirmLeaveDescription'),
        onOk: () => {
          navigation.goBack();
        }
      });
    } else {
      navigation.goBack();
    }
  };

  useEffect(() => setIsAddressFromSuggestion(true), []);

  useEffect(
    () => setLoading(loadingShippingAddressDetail || loadingChangeShippingAddress),
    [loadingShippingAddressDetail, loadingChangeShippingAddress, setLoading]
  );

  return (
    <>
      <LayoutScreen isScrollable isNoPadding hasForm>
        <AddressContainer>
          <Heading>
            <Text
              label={t('address:common.contact')}
              variant="large"
              textAlign="left"
              color={colors.dark.blackCoral}
              fontWeight="semi-bold"
            />
            <Border />
          </Heading>
          <FormList>
            <InputText
              value={formik.values.receipt_name}
              onChange={(val) => formik.setFieldValue('receipt_name', val)}
              onFocus={() => setShowSuggestion(false)}
              placeholder={t('address:common.namePlaceholder')}
              isError={formik.touched.receipt_name && !!formik.errors.receipt_name}
              errorText={formik.errors.receipt_name}
            />
            <InputPhoneNumber
              valueCode={formik.values.receipt_phone_cc}
              valuePhone={formik.values.receipt_phone}
              onChangeCode={(data) => formik.setFieldValue('receipt_phone_cc', data)}
              onChangePhone={(data) => {
                formik.setFieldValue('receipt_phone', validationNumberFormat(data));
              }}
              onFocusCode={() => setShowSuggestion(false)}
              onFocusPhone={() => setShowSuggestion(false)}
              isError={
                (formik.touched.receipt_phone && !!formik.errors.receipt_phone) ||
                (formik.touched.receipt_phone_cc && !!formik.errors.receipt_phone_cc)
              }
              errorText={formik.errors.receipt_phone || formik.errors.receipt_phone_cc}
            />
          </FormList>
          <Spacer h={50} />
          <Heading>
            <Text
              label={t('address:common.addressInfo')}
              variant="large"
              textAlign="left"
              color={colors.dark.blackCoral}
              fontWeight="semi-bold"
            />
            <Border />
          </Heading>
          <FormList>
            <InputText
              value={formik.values.label}
              onChange={(val) => formik.setFieldValue('label', val)}
              onFocus={() => setShowSuggestion(false)}
              placeholder={t('address:common.addressPlaceholder')}
              isError={formik.touched.label && !!formik.errors.label}
              errorText={formik.errors.label}
              helperText={t('address:common.maxChar')}
              maxLength={30}
            />
            <InputText
              keyboardType="number-pad"
              value={formik.values.postal_code}
              onChange={(val) => {
                formik.setFieldValue('postal_code', val);

                if (val.length < 6) {
                  setShowSuggestion(false);
                  formik.setFieldTouched('postal_code', false);
                }

                if (val.length === 6) {
                  setIsPostalCodeFilled(true);
                  formik.setFieldError('postal_code', undefined);
                }
              }}
              onBlur={() => formik.setFieldTouched('postal_code')}
              placeholder={t('address:common.postalCodePlaceholder')}
              isError={formik.touched.postal_code && !!formik.errors.postal_code}
              errorText={formik.errors.postal_code}
              maxLength={6}
            />
            <View style={{ zIndex: 1 }}>
              <InputTextArea
                value={formik.values.address}
                onChange={(val) => {
                  if (isAddressFromSuggestion) return;

                  formik.setFieldValue('address', val);
                  setShowSuggestion(false);

                  if (val.length === 0) {
                    formik.setFieldValue('postal_code', '');
                    formik.setFieldError('postal_code', undefined);
                    formik.setFieldTouched('postal_code', false);
                  }
                }}
                onFocus={() => {
                  setIsAddressFromSuggestion(false);
                  setShowSuggestion(false);
                  setIsPostalCodeFilled(false);
                }}
                placeholder={'Address'}
                isError={formik.touched.address && !!formik.errors.address}
                errorText={formik.errors.address}
                numberOfLines={4}
                maxLength={100}
                showSuggestions={showSuggestion}
                suggestionData={addressSuggestionData ? [addressSuggestionData?.data] : []}
                suggestionOnPress={(value) => {
                  formik.setFieldValue('address', value);
                  setIsAddressFromSuggestion(true);
                  setShowSuggestion(false);
                  setIsPostalCodeFilled(false);
                }}
              />
            </View>
            <View style={{ zIndex: 0 }}>
              <InputTextArea
                value={formik.values.floor_or_unit}
                onChange={(val) => formik.setFieldValue('floor_or_unit', val)}
                onFocus={() => setShowSuggestion(false)}
                placeholder={'Floor/unit (optional)'}
                isError={formik.touched.floor_or_unit && !!formik.errors.floor_or_unit}
                errorText={formik.errors.floor_or_unit}
                numberOfLines={4}
                maxLength={100}
              />
            </View>
          </FormList>
          <Spacer h={28} />
          <View style={{ width: '100%' }}>
            <Border />
          </View>
          <Spacer h={16} />
          <CheckboxContainer>
            <BouncyCheckbox
              size={16}
              fillColor={fillColor}
              isChecked={formik.values.is_primary}
              onPress={(checked) => formik.setFieldValue('is_primary', checked)}
              iconStyle={{ borderRadius: 2 }}
              innerIconStyle={{
                borderRadius: 2,
                borderWidth: 2,
                borderColor: formik.values.is_primary ? fillColor : colors.dark.gumbo
              }}
              disabled={isPrimary}
              textComponent={
                <Text label={t('address:common.asPrimary')} color={colors.dark.gumbo} />
              }
              style={{ gap: 8 }}
            />
          </CheckboxContainer>
        </AddressContainer>
      </LayoutScreen>

      <FooterContainer>
        <Border />
        <FooterButton>
          <Button
            label={t('address:modify.save')}
            onPress={() => formik.handleSubmit()}
            variant="background"
            color={colors.secondary}
            isDisable={!formik.isValid || !formik.values.postal_code}
            borderRadius="88px"
          />
        </FooterButton>
      </FooterContainer>

      <ModalAlert
        title={showConfirmModal.title}
        description={showConfirmModal.description}
        isVisible={showConfirmModal.open}
        onCloseModal={() => setShowConfirmModal(initialConfirmModal)}
        onPressYes={showConfirmModal.onOk}
      />
    </>
  );
};

export default ModifyAddressScreen;
