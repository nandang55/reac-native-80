import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetFooterProps
} from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import { Button } from 'components/Button';
import { Icon } from 'components/Icon';
import { Text } from 'components/Text';
import { useKeyboardState } from 'hooks/useKeyboardState';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';

import { BottomDrawerListInterface, BottomDrawerProps } from './BottomDrawerList.type';

const CloseIconStyled = styled(TouchableOpacity)`
  position: absolute;
  right: 19px;
  top: 19px;
`;

const TitleContainerStyled = styled(View)<{ isSearchable: boolean }>`
  border-bottom-color: ${colors.dark.bermudaGrey};
  border-bottom-width: 0.5px;
  margin-bottom: ${(props) => (props.isSearchable ? '16px' : '0px')};
  padding-bottom: ${(props) => (props.isSearchable ? '16px' : '12px')};
  padding-top: ${(props) => (props.isSearchable ? '20px' : '16px')};
`;

const ItemListStyled = styled(TouchableOpacity)<{ isSearchable: boolean; isSelected?: boolean }>`
  background-color: ${(props) =>
    props.isSelected ? colors.light.whiteSmoke : colors.light.whiteSolid};
  padding: 16px 0px;
  ${(props) =>
    props.isSearchable && {
      borderBottomWidth: 1,
      borderBottomColor: colors.dark.solitude,
      paddingLeft: 16,
      paddingRight: 16
    }}
`;

export const BottomDrawerList = ({
  selectedId,
  data,
  title,
  bottomSheetRef,
  snapPoints,
  snapPointsKeyboard,
  handleComponent,
  onChange,
  enablePanDownToClose = false,
  enableContentPanningGesture = false,
  enableHandlePanningGesture = false,
  isSearchable,
  onClose,
  isShowConfirmation // searchPlaceholder
}: BottomDrawerProps) => {
  const { t } = useTranslation(['common']);
  const [dataItem, setDataItem] = useState<Array<BottomDrawerListInterface> | []>([]);
  const [selectedIdItem, setSelectedIdItem] = useState<string>('');
  const [searchData, setSearchData] = useState<string>('');

  const { isKeyboardVisible } = useKeyboardState();

  const snapPointMemo = useMemo(() => {
    return isKeyboardVisible ? [...snapPointsKeyboard] : [...snapPoints];
  }, [isKeyboardVisible, snapPoints, snapPointsKeyboard]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} pressBehavior="close" opacity={0.5} disappearsOnIndex={-1} />
    ),
    []
  );

  useEffect(() => {
    if (searchData !== '') {
      const newData = data.filter((item) => {
        const itemData = `${item.value.toUpperCase()}`;
        const textData = searchData.toUpperCase();

        return itemData.indexOf(textData) > -1;
      });
      setDataItem(newData);
    } else {
      setDataItem(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchData]);

  const onSelectItem = (item: BottomDrawerListInterface) => {
    if (isShowConfirmation) {
      setSelectedIdItem(item.id);
      if (isSearchable) {
        setSearchData(item.value);
      }
    } else {
      onChange?.(item.id ?? '');
      onClose();
    }
  };

  const onOpenBottomSheet = () => {
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    if (searchData === '') {
      setDataItem(data);
    }
  };

  const onCloseBottomSheet = () => {
    BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    setSelectedIdItem('');
    setSearchData('');
  };

  const onBackPress = () => {
    onClose();
    onCloseBottomSheet();
    return true;
  };

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) =>
      isShowConfirmation && !isKeyboardVisible ? (
        <BottomSheetFooter {...props}>
          <View style={{ borderTopWidth: 1, borderTopColor: colors.dark.silver }} />
          <View
            style={{ flexDirection: 'row', padding: 16, backgroundColor: colors.light.whiteSolid }}
          >
            <View style={{ flex: 1, paddingRight: 7 }}>
              <Button
                onPress={onClose}
                label={t('common:cancel')}
                variant="plain"
                color={colors.dark.blackCoral}
              />
            </View>
            <View style={{ flex: 1, paddingLeft: 7 }}>
              <Button
                onPress={() => {
                  if (selectedIdItem !== '') {
                    onChange?.(selectedIdItem);
                  }
                  onClose();
                }}
                label={t('common:select')}
                variant="background"
              />
            </View>
          </View>
        </BottomSheetFooter>
      ) : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedIdItem, isShowConfirmation, isKeyboardVisible]
  );

  return (
    <Portal>
      <BottomSheet
        // FIXME bottom drawer cannot clicked on content
        backdropComponent={renderBackdrop}
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPointMemo}
        handleComponent={handleComponent ? handleComponent : null}
        enablePanDownToClose={enablePanDownToClose}
        enableContentPanningGesture={enableContentPanningGesture}
        enableHandlePanningGesture={enableHandlePanningGesture}
        onAnimate={onOpenBottomSheet}
        onClose={onCloseBottomSheet}
        footerComponent={renderFooter}
      >
        <View style={{ flexGrow: 1 }}>
          <>
            <TitleContainerStyled isSearchable={isSearchable ?? false}>
              <Text
                variant={'large'}
                color={colors.dark.blackCoral}
                label={title}
                textAlign="center"
                fontWeight="semi-bold"
              />
            </TitleContainerStyled>
            {isSearchable && (
              <View style={{ marginHorizontal: 32 }}>
                <Text label="pengganti form input" />
              </View>
            )}
            {isSearchable && (
              <CloseIconStyled onPress={onClose}>
                <Icon name="closeCircleOutline" />
              </CloseIconStyled>
            )}
          </>

          {data.length === 0 || dataItem.length === 0 ? (
            <View style={{ paddingHorizontal: 32 }}>
              <ItemListStyled isSearchable={isSearchable || false}>
                <Text label={t('common:noResult')} textAlign={isSearchable ? 'left' : 'center'} />
              </ItemListStyled>
            </View>
          ) : (
            <BottomSheetFlatList
              data={dataItem}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => {
                return (
                  <ItemListStyled
                    isSearchable={isSearchable || false}
                    isSelected={item.id === (selectedIdItem ? selectedIdItem : selectedId)}
                    key={index}
                    onPress={() => onSelectItem(item)}
                  >
                    <Text
                      variant={'medium'}
                      color={
                        item.id === (selectedIdItem ? selectedIdItem : selectedId)
                          ? colors.dark.blackCoral
                          : colors.dark.bermudaGrey
                      }
                      label={item.value}
                      textAlign={isSearchable ? 'left' : 'center'}
                      fontWeight={
                        item.id === (selectedIdItem ? selectedIdItem : selectedId)
                          ? 'semi-bold'
                          : 'regular'
                      }
                    />
                  </ItemListStyled>
                );
              }}
              contentContainerStyle={{
                paddingBottom: isShowConfirmation ? 84 : 16,
                paddingHorizontal: isSearchable ? 32 : 0
              }}
            />
          )}
        </View>
      </BottomSheet>
    </Portal>
  );
};
