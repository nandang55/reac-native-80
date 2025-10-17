import { Button } from 'components/Button';
import React from 'react';
import { BackHandler, Modal, View } from 'react-native';
import styled from 'styled-components';
import colors from 'styles/colors';

import { OverlayStyled } from '../Overlay';
import { Text } from '../Text';
import { NewVersionConfirmationProps } from './NewVersionConfirmation.type';

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

export const NewVersionConfirmation = ({
  isVisible,
  title,
  isMandatory,
  description,
  onPressUpdate,
  onPressClose
}: NewVersionConfirmationProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      statusBarTranslucent
      onRequestClose={() => {
        BackHandler.exitApp();
      }}
    >
      <OverlayStyled />

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
          <Text color={colors.dark.blackCoral} label={description} textAlign="center" />
          <View style={{ flexDirection: 'row', marginTop: 16, gap: 16 }}>
            {!isMandatory && (
              <Button
                onPress={onPressClose}
                size="small"
                fontWeight="semi-bold"
                label="Update Later"
                variant="plain"
                borderRadius="12px"
              />
            )}
            <Button
              onPress={onPressUpdate}
              size="small"
              fontWeight="semi-bold"
              label="Update Now"
              variant="background"
              color={colors.secondary}
              borderRadius="12px"
            />
          </View>
        </ContentContainerStyled>
      </View>
    </Modal>
  );
};
