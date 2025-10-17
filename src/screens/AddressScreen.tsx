import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomDrawerList } from 'components/BottomDrawer';
import { Button } from 'components/Button';
import { AddressCard } from 'components/Card';
import { LayoutScreen } from 'components/layouts';
import { ModalAlert } from 'components/Modal';
import { LoadingContext } from 'contexts/AppLoadingContext';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import { initialPickAddressValues, PickAddressContext } from 'contexts/AppPickAddressContext';
import { useDeleteShippingAddress } from 'hooks/useDeleteShippingAddress';
import useGetShippingAddressList from 'hooks/useGetShippingAddressList';
import { ResponseAddressInfo } from 'interfaces/AddressInterface';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, FlatList, View } from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';

const { width } = Dimensions.get('window');

const AddressContainer = styled(View)`
  align-items: center;
  background-color: ${colors.light.whiteSolid};
  display: flex;
  flex: 1;
  padding-top: 40px;
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
  border: 1px solid ${colors.dark.silver};
`;

type AddressScreenNavigationProps = StackNavigationProp<RootStackParamList>;

const AddressScreen = () => {
  const { t } = useTranslation(['address']);
  const navigation = useNavigation<AddressScreenNavigationProps>();
  const moreOptionsRef = useRef<BottomSheet>(null);
  const sortBySnapPoints = useMemo(() => ['18%'], []);
  const { setIsShowToast, setToastMessage, setType } = useContext(ModalToastContext);
  const { address, setAddress } = useContext(PickAddressContext);
  const { setLoading } = useContext(LoadingContext);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modifyAddressSelected, setModifyAddressSelected] = useState<{
    id: string;
    isPrimary: boolean;
  }>();

  const {
    data: dataShippingAddress,
    isLoading: loadingShippingAddress,
    refetch
  } = useGetShippingAddressList({
    options: { enabled: false }
  });

  const { mutate: deleteShippingAddress, isLoading: loadingDelete } = useDeleteShippingAddress({
    onSuccess: async (data, payload) => {
      if (!data.error) {
        refetch();
        setIsShowToast(true);
        setToastMessage(data.message);
        setType('success');
        if (payload.addressId === address.id) setAddress(initialPickAddressValues);
      } else {
        setIsShowToast(true);
        setToastMessage(data.message);
        setType('error');
      }
    },
    onError: (error) => {
      const res = error.response?.data;
      if (res?.message) {
        setIsShowToast(true);
        setToastMessage(res.message);
        setType('error');
      }
    }
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const renderItem = ({ item, index }: { item: ResponseAddressInfo; index: number }) => (
    <AddressCard key={index} {...item} onPressEdit={handleEditAddress} />
  );

  const moreOptionData = [
    {
      id: 'modify',
      value: t('address:modify.title')
    },
    {
      id: 'remove',
      value: 'Delete Address'
    }
  ];

  const handleAddAddress = () => {
    navigation.push('AddressStack', { screen: 'NewAddress', params: { isPrimary: true } });
  };

  const handleAddMoreAddress = () => {
    navigation.push('AddressStack', { screen: 'NewAddress', params: { isPrimary: false } });
  };

  const handleEditAddress = (id: string, isPrimary: boolean) => {
    setModifyAddressSelected({ id, isPrimary });
    moreOptionsRef.current?.snapToIndex(0);
  };

  const handleDrawerListOption = (id: string | number) => {
    if (id === 'remove') {
      setShowConfirmModal(true);
    } else {
      navigation.push('AddressStack', {
        screen: 'ModifyAddress',
        params: {
          id: modifyAddressSelected?.id,
          isPrimary: modifyAddressSelected?.isPrimary as boolean
        }
      });
    }
  };

  const handleDeleteShippingAddress = () => {
    deleteShippingAddress({ addressId: modifyAddressSelected?.id as string });
  };

  useEffect(() => {
    setLoading(loadingShippingAddress || loadingDelete);
  }, [loadingDelete, loadingShippingAddress, setLoading]);

  return (
    <>
      <LayoutScreen isNoPadding>
        <AddressContainer>
          <FlatList
            data={dataShippingAddress?.data || []}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ width, paddingHorizontal: 24, gap: 16 }}
            ListEmptyComponent={
              <Button
                label={t('address:delivery.newAddress')}
                onPress={handleAddAddress}
                variant="background"
                color={colors.secondary}
                borderRadius="88px"
              />
            }
          />
          {dataShippingAddress?.data && dataShippingAddress?.data.length > 0 && (
            <FooterContainer>
              <Border />
              <FooterButton>
                <Button
                  label={t('address:delivery.newAddress')}
                  onPress={handleAddMoreAddress}
                  variant="background"
                  color={colors.secondary}
                  isDisable={dataShippingAddress?.data.length === 2}
                  borderRadius="88px"
                />
              </FooterButton>
            </FooterContainer>
          )}
        </AddressContainer>
      </LayoutScreen>

      <BottomDrawerList
        selectedId={''}
        onChange={handleDrawerListOption}
        data={moreOptionData}
        title={t('address:delivery.settingsLabel')}
        bottomSheetRef={moreOptionsRef}
        snapPoints={sortBySnapPoints}
        snapPointsKeyboard={sortBySnapPoints}
        enablePanDownToClose
        enableContentPanningGesture
        enableHandlePanningGesture
        onClose={() => {
          moreOptionsRef.current?.close();
        }}
      />

      <ModalAlert
        title={t('address:delivery.confirmTitle')}
        description={t('address:delivery.confirmDescription')}
        isVisible={showConfirmModal}
        onCloseModal={() => setShowConfirmModal(false)}
        onPressYes={() => handleDeleteShippingAddress()}
      />
    </>
  );
};

export default AddressScreen;
