import { Button } from 'components/Button';
import { OverlayStyled } from 'components/Overlay';
import { Text } from 'components/Text';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, TouchableWithoutFeedback, View } from 'react-native';
import ProgressCircle from 'react-native-progress-circle';
import styled from 'styled-components/native';
import colors from 'styles/colors';

import { ModalCountdownProps } from './ModalCountdown.type';

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

export const ModalCountdown = ({
  countTimer,
  isVisible,
  title,
  description,
  onCloseModal,
  onPressRefresh
}: ModalCountdownProps) => {
  const { t } = useTranslation(['common']);
  const [countdown, setCountDown] = useState<number>(1);
  const [percentage, setPercentage] = useState<number>(1);

  useEffect(() => {
    if (isVisible) {
      resetState();
    }
  }, [isVisible]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (countdown !== 1) {
        setCountDown(countdown - 1);
        setPercentage(percentage + 1);
      } else {
        onRefresh();
      }
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown, percentage]);

  const startCountdown = () => {
    setCountDown(countTimer);
  };

  const onRefresh = () => {
    if (isVisible) {
      onCloseModal();
      resetState();
      onPressRefresh();
    }
  };

  const resetState = () => {
    setPercentage(1);
  };

  return (
    <Modal
      onShow={() => startCountdown()}
      animationType="fade"
      transparent={true}
      visible={isVisible}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onCloseModal}>
        <OverlayStyled />
      </TouchableWithoutFeedback>

      <View style={{ flex: 1, justifyContent: 'center', margin: 16 }}>
        <TitleContainerStyled>
          <Text
            color={colors.light.whiteSolid}
            label={title}
            fontWeight="semi-bold"
            textAlign="center"
            variant="large"
          />
        </TitleContainerStyled>
        <ContentContainerStyled>
          <Text color={colors.dark.blackCoral} label={description} textAlign="center" />

          <View style={{ marginTop: 16 }}>
            <ProgressCircle
              percent={(percentage / countTimer) * 100}
              radius={32}
              borderWidth={8}
              color={colors.primary}
              shadowColor={colors.dark.solitude}
              bgColor={colors.light.whiteSolid}
            >
              <Text color={colors.dark.blackCoral} label={`${countdown}`} fontWeight="semi-bold" />
            </ProgressCircle>
          </View>

          <View style={{ flexDirection: 'row', marginTop: 16 }}>
            <Button
              onPress={onRefresh}
              label={t('common:refresh')}
              variant="plain"
              color={colors.dark.blackCoral}
            />
          </View>
        </ContentContainerStyled>
      </View>
    </Modal>
  );
};
