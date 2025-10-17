import { useQueryClient } from '@tanstack/react-query';
import { Button } from 'components/Button';
import { InputTextArea } from 'components/Input/TextArea';
import { LayoutScreen } from 'components/layouts';
import { ModalAlert } from 'components/Modal';
import { Text } from 'components/Text';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import { useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import { useDeleteAccount } from 'hooks/useDeleteAccount';
import useGetDeleteReasonList from 'hooks/useGetDeleteReasonList';
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, FlatList, View } from 'react-native';
import { RadioButton } from 'react-native-radio-buttons-group';
import styled from 'styled-components';
import colors from 'styles/colors';

const { width } = Dimensions.get('window');

const NOTE_DATA = [
  "Deleting your account will permanently remove all related data and can't be restored.",
  'Your account can only be deleted when there is no ongoing transaction related to it.',
  "You won't be able to log in or view the transaction history of the deleted account.",
  'You can reregister a completely new account using the same email/phone number of the deleted account.'
];

const DeleteAccountContainer = styled(View)`
  flex: 1;
  gap: 8;
  padding-bottom: 90px;
`;

const FooterContainer = styled(View)`
  background-color: ${colors.light.whiteSolid};
  bottom: 0;
  display: flex;
  position: absolute;
  width: ${width};
`;

const FooterButton = styled(View)`
  padding: 16px 28px;
`;

const Border = styled(View)`
  background-color: ${colors.dark.solitude};
  height: 1px;
`;

const CardNoteContainer = styled(View)`
  background-color: ${colors.light.whiteSolid};
  gap: 12px;
  padding: 16px;
`;

const CardReasonContainer = styled(View)`
  background-color: ${colors.light.whiteSolid};
  gap: 12px;
  padding: 16px 16px 0 16px;
`;

const NoteItemContainer = styled(View)`
  flex: 1;
  flex-direction: row;
  gap: 4px;
`;

const ReasonItemContainer = styled(View)`
  align-items: center;
  flex: 1;
  flex-direction: row;
`;

const DEFAULT_REASONS = ['Others'];

const DeleteAccountScreen = () => {
  const queryClient = useQueryClient();
  const { signOut } = useAuth();
  const { setIsShowToast, setToastMessage, setType } = useContext(ModalToastContext);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [reasonList, setReasonList] = useState<Array<string>>(DEFAULT_REASONS);

  const { data: dataDeleteReason } = useGetDeleteReasonList({});

  const { mutateAsync: deleteAccount } = useDeleteAccount({
    onSuccess: (res) => {
      if (!res.error) {
        setShowConfirmModal(false);
        signOut();
        setIsShowToast(true);
        setToastMessage(res.message);
        setType('success');
        queryClient.clear();
      } else {
        setToastMessage(res.message);
        setIsShowToast(true);
        setType('error');
      }
    },
    onError: (error) => {
      const res = error.response?.data;
      if (res?.message) {
        setToastMessage(res.message);
        setIsShowToast(true);
        setType('error');
      }
    }
  });

  const formik = useFormik<{ reason: string; otherReason: string }>({
    initialValues: {
      reason: '',
      otherReason: ''
    },
    onSubmit: async (values) => {
      const payload = {
        reason:
          values.reason === 'Others'
            ? values.otherReason
            : reasonList.find((item) => item === values.reason)
      };
      await deleteAccount({ reason: payload.reason as string });
    }
  });

  useEffect(() => {
    if (dataDeleteReason?.data) {
      const uniqueReasons = Array.from(new Set([...dataDeleteReason.data, ...DEFAULT_REASONS]));
      setReasonList(uniqueReasons);
    }
  }, [dataDeleteReason?.data]);

  const renderItemNote = ({ item, index }: { item: string; index: number }) => (
    <NoteItemContainer>
      <Text
        label={`${index + 1}.`}
        fontWeight="regular"
        variant="medium"
        color={colors.dark.gumbo}
      />
      <Text
        label={item}
        fontWeight="regular"
        variant="medium"
        color={colors.dark.gumbo}
        style={{ flex: 1 }}
      />
    </NoteItemContainer>
  );

  const renderItemReason = ({ item, index }: { item: string; index: number }) => (
    <ReasonItemContainer key={index}>
      <RadioButton
        id={item}
        onPress={(id) => {
          formik.setFieldValue('reason', id);
          if (id !== 'Others') {
            formik.setFieldValue('otherReason', '');
          }
        }}
        selected={item === formik.values.reason}
        size={16}
        containerStyle={{
          marginLeft: 0,
          paddingVertical: 16,
          paddingRight: 8
        }}
        borderColor={item === formik.values.reason ? colors.secondary : colors.dark.gumbo}
        color={colors.secondary}
      />
      <Text
        label={item}
        fontWeight="regular"
        variant="medium"
        color={colors.dark.gumbo}
        style={{ marginLeft: -8, flex: 1 }}
      />
    </ReasonItemContainer>
  );

  const isOthersSelected = formik.values.reason === 'Others';
  const isButtonDisabled =
    !formik.values.reason || (isOthersSelected && !formik.values.otherReason.trim());
  return (
    <>
      <LayoutScreen statusBarColor={colors.primary} isNoPadding isScrollable isRefreshing={false}>
        <DeleteAccountContainer>
          <CardNoteContainer>
            <Text
              label="Please Note"
              fontWeight="semi-bold"
              variant="medium"
              color={colors.dark.blackCoral}
            />
            <FlatList
              data={NOTE_DATA}
              renderItem={renderItemNote}
              keyExtractor={(item) => item}
              style={{ paddingHorizontal: 8 }}
              contentContainerStyle={{ gap: 14 }}
              scrollEnabled={false}
            />
          </CardNoteContainer>
          <CardReasonContainer>
            <Text
              label="Reason"
              fontWeight="semi-bold"
              variant="medium"
              color={colors.dark.blackCoral}
            />
            <View>
              <FlatList
                data={reasonList}
                renderItem={renderItemReason}
                keyExtractor={(item) => item}
                ItemSeparatorComponent={() => <Border />}
                scrollEnabled={false}
              />
              {isOthersSelected && (
                <View style={{ marginBottom: 16 }}>
                  <InputTextArea
                    label="Reason"
                    labelStyle={{ variant: 'small' }}
                    isRequired
                    value={formik.values.otherReason}
                    onChange={(value) => formik.setFieldValue('otherReason', value)}
                    placeholder="Enter your reason"
                    numberOfLines={5}
                    maxLength={250}
                    helperText="Max. 250 chars."
                    helperTextStyle={{ variant: 'small' }}
                    borderStyle={{ paddingBottom: 16 }}
                  />
                </View>
              )}
            </View>
          </CardReasonContainer>
        </DeleteAccountContainer>
      </LayoutScreen>
      <FooterContainer>
        <Border />
        <FooterButton>
          <Button
            isDisable={isButtonDisabled}
            isDisableColor={colors.light.whiteSmoke}
            isDisableBorderColor={colors.dark.silver}
            isDisableTextColor={colors.dark.solitude}
            textColor={colors.dark.gumbo}
            label="Continue"
            onPress={() => setShowConfirmModal(true)}
            variant="secondary"
            fontWeight="semi-bold"
            borderRadius="28px"
          />
        </FooterButton>
      </FooterContainer>

      <ModalAlert
        title="Delete Confirmation"
        description=""
        isVisible={showConfirmModal}
        onCloseModal={() => setShowConfirmModal(false)}
        onPressYes={formik.handleSubmit}
      >
        <View style={{ marginBottom: 12 }}>
          <Text
            label="Deleting your account will"
            fontWeight="regular"
            variant="medium"
            color={colors.dark.blackCoral}
            textAlign="center"
          />
          <Text
            label="permanently remove all data related"
            fontWeight="regular"
            variant="medium"
            color={colors.dark.blackCoral}
            textAlign="center"
          />
          <Text
            label="to that account."
            fontWeight="regular"
            variant="medium"
            color={colors.dark.blackCoral}
            textAlign="center"
          />
        </View>
        <Text
          label="Are you sure you want to delete your account?"
          fontWeight="regular"
          variant="medium"
          color={colors.dark.blackCoral}
          textAlign="center"
        />
      </ModalAlert>
    </>
  );
};

export default DeleteAccountScreen;
