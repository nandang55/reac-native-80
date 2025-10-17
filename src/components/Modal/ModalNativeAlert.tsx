import { OverlayStyled } from 'components/Overlay';
import React from 'react';
import { Modal, TouchableWithoutFeedback, View } from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';

import Text from '../Text/Text';
import { ModalNativeAlertProps } from './ModalNativeAlert.type';

const ContentContainerStyled = styled(View)`
  background-color: ${colors.light.whiteSolid};
  border-radius: 4px;
  padding: 20px;
  width: 100%;
`;

export const ModalNativeAlert = ({
  isVisible,
  onCloseModal,
  title,
  description,
  confirmButton
}: ModalNativeAlertProps) => {
  return (
    <Modal animationType="fade" transparent={true} visible={isVisible} statusBarTranslucent>
      <OverlayStyled />

      <View style={{ flex: 1, justifyContent: 'center', margin: 33 }}>
        <ContentContainerStyled>
          <View style={{ marginBottom: 8 }}>
            <Text
              color={colors.dark.blackSolid}
              label={title}
              fontWeight="semi-bold"
              variant="extra-large"
            />
          </View>

          <Text
            color={colors.dark.blackSolid}
            label={description}
            textAlign="left"
            variant="large"
          />
          <View style={{ flexDirection: 'row', marginTop: 32, justifyContent: 'flex-end' }}>
            <TouchableWithoutFeedback onPress={onCloseModal}>
              <Text
                color={colors.green.persianGreen}
                label={confirmButton}
                fontWeight="semi-bold"
              />
            </TouchableWithoutFeedback>
          </View>
        </ContentContainerStyled>
      </View>
    </Modal>
  );
};
