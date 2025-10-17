import { Button } from 'components/Button';
import { OverlayStyled } from 'components/Overlay';
import { Text } from 'components/Text';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, TouchableWithoutFeedback, View } from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';

import { ModalAlertProps } from './ModalAlert.type';

const TitleContainerStyled = styled(View)`
  background-color: ${colors.primary};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 16px;
  width: 100%;
`;

const ContentContainerStyled = styled(View)`
  align-items: center;
  background-color: ${colors.light.whiteSolid};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  display: flex;
  padding: 16px;
  width: 100%;
`;

export const ModalAlert = ({
  isVisible,
  onCloseModal,
  onPressYes,
  title,
  description,
  singleBtnLabel,
  reverse,
  children
}: ModalAlertProps) => {
  const { t } = useTranslation(['common']);

  return (
    <Modal animationType="fade" transparent={true} visible={isVisible} statusBarTranslucent>
      <TouchableWithoutFeedback>
        <OverlayStyled />
      </TouchableWithoutFeedback>

      <View style={{ flex: 1, justifyContent: 'center', margin: 32 }}>
        <TitleContainerStyled
          style={{ borderBottomWidth: 1, borderBottomColor: colors.dark.solitude }}
        >
          <Text
            color={colors.dark.blackCoral}
            label={title}
            fontWeight="semi-bold"
            textAlign="center"
            variant="large"
          />
        </TitleContainerStyled>
        <ContentContainerStyled>
          {children ?? (
            <Text color={colors.dark.blackCoral} label={description} textAlign="center" />
          )}
          {onPressYes ? (
            <View
              style={{ flexDirection: reverse ? 'row-reverse' : 'row', marginTop: 16, gap: 16 }}
            >
              {!singleBtnLabel && (
                <Button
                  leftIcon="closeCircleOutline"
                  iconColor={colors.red.fireEngineRed}
                  onPress={onCloseModal}
                  height={32}
                  width={74}
                  iconSize={'12px'}
                  size="small"
                  fontWeight="semi-bold"
                  label={t('common:no')}
                  variant="plain"
                  color={colors.dark.blackCoral}
                  borderRadius="12px"
                />
              )}
              {singleBtnLabel ? (
                <Button
                  onPress={() => {
                    onPressYes();
                    setTimeout(() => {
                      onCloseModal();
                    }, 200);
                  }}
                  height={32}
                  width={74}
                  fontWeight="semi-bold"
                  size="small"
                  label={singleBtnLabel}
                  variant="plain"
                  color={colors.dark.blackCoral}
                  borderRadius="12px"
                />
              ) : (
                <Button
                  leftIcon="checkCircleOutline"
                  iconColor={colors.green.kellyGreen}
                  onPress={() => {
                    onPressYes();
                    setTimeout(() => {
                      onCloseModal();
                    }, 200);
                  }}
                  height={32}
                  width={74}
                  iconSize={'12px'}
                  fontWeight="semi-bold"
                  size="small"
                  label={t('common:yes')}
                  variant="plain"
                  color={colors.dark.blackCoral}
                  borderRadius="12px"
                />
              )}
            </View>
          ) : (
            <View style={{ flexDirection: 'row', marginTop: 16 }}>
              <Button
                onPress={onCloseModal}
                label={t('common:close')}
                variant="plain"
                color={colors.dark.blackCoral}
                borderRadius="12px"
              />
            </View>
          )}
        </ContentContainerStyled>
      </View>
    </Modal>
  );
};
