import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView
} from '@gorhom/bottom-sheet';
import { Text } from 'components/Text';
import { useKeyboardState } from 'hooks/useKeyboardState';
import React, { useCallback, useEffect, useState } from 'react';
import { BackHandler, View } from 'react-native';
import styled from 'styled-components';
import colors from 'styles/colors';

import { BottomDrawerContaninerProps } from './BottomDrawerContainer.type';

const TitleContainerStyled = styled(View)`
  border-bottom-color: ${colors.dark.solitude};
  border-bottom-width: 1px;
  display: flex;
  padding: 19px 24px;
`;

export const BottomDrawerContainer = ({
  title,
  bottomSheetRef,
  enablePanDownToClose = true,
  enableContentPanningGesture = true,
  enableHandlePanningGesture = true,
  footerComponent,
  onClose,
  onChange,
  children
}: BottomDrawerContaninerProps) => {
  const [isShowBackDrop, setIsShowBackDrop] = useState<boolean>(false);
  const { keyboardHeight } = useKeyboardState();
  const [handleHeight, setHandleHeight] = useState(0);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} pressBehavior="close" opacity={0.5} disappearsOnIndex={-1} />
    ),
    []
  );

  const onOpenBottomSheet = () => {
    if (!isShowBackDrop) {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      setIsShowBackDrop(true);
    } else {
      setIsShowBackDrop(false);
    }
  };

  const onCloseBottomSheet = () => {
    BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    setIsShowBackDrop(false);
  };

  const onBackPress = () => {
    onClose();
    onCloseBottomSheet();
    return true;
  };

  useEffect(() => {
    setHandleHeight(keyboardHeight + 20);
  }, [keyboardHeight]);

  return (
    <BottomSheet
      backdropComponent={renderBackdrop}
      ref={bottomSheetRef}
      index={-1}
      enablePanDownToClose={enablePanDownToClose}
      enableContentPanningGesture={enableContentPanningGesture}
      enableHandlePanningGesture={enableHandlePanningGesture}
      enableDynamicSizing
      handleHeight={handleHeight}
      onChange={onChange}
      onAnimate={onOpenBottomSheet}
      onClose={onCloseBottomSheet}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
    >
      <BottomSheetScrollView>
        <TitleContainerStyled>
          <Text
            variant="large"
            color={colors.dark.blackCoral}
            label={title}
            textAlign="center"
            fontWeight="semi-bold"
          />
        </TitleContainerStyled>
        <View>{children}</View>
        <View>{footerComponent}</View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};
