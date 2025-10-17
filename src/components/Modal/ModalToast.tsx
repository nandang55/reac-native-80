import { Icon, IconType } from 'components/Icon';
import { Text } from 'components/Text';
import React from 'react';
import { Modal, SafeAreaView, View } from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';

import { ModalToastProps, ModalToastType } from './ModalToast.type';

const ModalContainerStyled = styled(View)<{ bgColor: string; marginTop: string }>`
  align-items: flex-start;
  background-color: ${(props) => props.bgColor};
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-left: 16px;
  margin-right: 16px;
  margin-top: ${(props) => props.marginTop};
  padding: 16px;
`;

export const ModalToast = ({
  isVisible,
  message,
  type,
  icon,
  onCloseModal,
  marginTop = '16px'
}: ModalToastProps) => {
  const modalBackgroundMapper: Record<ModalToastType, string> = {
    success: colors.secondary,
    error: colors.red.deepRed
  };

  const modalIconMapper: Record<ModalToastType, IconType> = {
    success: 'checkCircleOutline',
    error: 'infoCircle'
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onShow={() => {
        setTimeout(() => {
          onCloseModal();
        }, 2000);
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ModalContainerStyled bgColor={modalBackgroundMapper[type]} marginTop={marginTop}>
          <View style={{ marginTop: 2 }}>
            <Icon
              name={icon || modalIconMapper[type]}
              color={colors.light.whiteSolid}
              size={'16px'}
            />
          </View>
          <Text
            style={{ marginRight: 16 }}
            color={colors.light.whiteSolid}
            label={message}
            fontWeight="bold"
          />
        </ModalContainerStyled>
      </SafeAreaView>
    </Modal>
  );
};
