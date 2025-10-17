import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView
} from '@gorhom/bottom-sheet';
import { Button } from 'components/Button';
import { Skeleton } from 'components/Skeleton';
import { Spacer } from 'components/Spacer';
import { Text } from 'components/Text';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, Image, View } from 'react-native';
import styled from 'styled-components';
import colors from 'styles/colors';

import { BottomDrawerCartProps } from './BottomDrawerCart.type';

const Border = styled(View)`
  border: 0.5px solid ${colors.dark.bermudaGrey};
  margin-top: 16px;
`;

export const BottomDrawerCart = ({
  bottomSheetRef,
  enablePanDownToClose = true,
  enableContentPanningGesture = true,
  enableHandlePanningGesture = true,
  onClose,
  onPressAddToCart,
  labelAddToCart,
  isLoading,
  isMutating,
  children,
  productTitle,
  productImage,
  price,
  stock
}: BottomDrawerCartProps) => {
  const [isShowBackDrop, setIsShowBackDrop] = useState<boolean>(false);
  const { t } = useTranslation('productDetail');

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
    onClose();
  };

  const onBackPress = () => {
    onClose();
    onCloseBottomSheet();
    return true;
  };

  return (
    <BottomSheet
      backdropComponent={renderBackdrop}
      ref={bottomSheetRef}
      index={-1}
      enablePanDownToClose={enablePanDownToClose}
      enableContentPanningGesture={enableContentPanningGesture}
      enableHandlePanningGesture={enableHandlePanningGesture}
      onAnimate={onOpenBottomSheet}
      onClose={onCloseBottomSheet}
      enableDynamicSizing
    >
      <BottomSheetView style={{ paddingTop: 24, paddingBottom: 40, minHeight: 200 }}>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 12, paddingHorizontal: 16 }}>
              <Image
                source={{ uri: productImage }}
                style={{ aspectRatio: 1, objectFit: 'cover', borderRadius: 8 }}
                width={72}
              />
              <View style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text
                  label={productTitle}
                  variant="small"
                  color={colors.dark.blackCoral}
                  fontWeight="light"
                />
                <View style={{ display: 'flex', gap: 6 }}>
                  <Text label={price} color={colors.dark.blackCoral} fontWeight="bold" />
                  <Text
                    label={`${t('stock')}: ${stock}`}
                    color={colors.dark.bermudaGrey}
                    variant="extra-small"
                  />
                </View>
              </View>
            </View>
            <View style={{ paddingHorizontal: 16 }}>
              <Border />
            </View>
            <View style={{ paddingTop: 18, paddingHorizontal: 16 }}>{children}</View>
            <View
              style={{
                backgroundColor: colors.light.whiteSolid,
                borderTopColor: colors.dark.bermudaGrey,
                borderTopWidth: 0.5,
                padding: 16,
                marginTop: 16
              }}
            >
              <View style={{ flex: 1 }}>
                <Button
                  onPress={onPressAddToCart}
                  label={labelAddToCart}
                  variant="background"
                  fontSize="medium"
                  fontWeight="semi-bold"
                  color={colors.secondary}
                  height={40}
                  borderRadius="28px"
                  borderColor={colors.secondary}
                  borderWidth="1px"
                  isDisable={isMutating || stock === 0 || stock === '-'}
                />
              </View>
            </View>
          </>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
};

const Loading = () => {
  return (
    <View style={{ paddingHorizontal: 12 }}>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Skeleton height={60} width={60} />
        <View>
          <Skeleton height={14} width={'100%'} />
          <Spacer h={8} />
          <Skeleton height={18} width={122} />
        </View>
      </View>
      <Spacer h={16} />
      <View style={{ borderWidth: 0.6, borderColor: colors.dark.bermudaGrey }} />
      <Spacer h={16} />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Skeleton height={18} width={114} />
        <Skeleton height={18} width={114} />
      </View>
      <Spacer h={24} />
      <Skeleton height={18} width={114} />
      <Spacer h={24} />
      <Skeleton height={36} width={'100%'} />
    </View>
  );
};
