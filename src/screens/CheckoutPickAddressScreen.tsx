import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQueryClient } from '@tanstack/react-query';
import { BottomDrawerList } from 'components/BottomDrawer';
import { Button } from 'components/Button';
import { AddressCard } from 'components/Card';
import { CheckoutPickAddressInterface } from 'components/Card/AddressCard.type';
import { LayoutScreen } from 'components/layouts';
import { ModalAlert } from 'components/Modal';
import { LoadingContext } from 'contexts/AppLoadingContext';
import { ModalToastContext } from 'contexts/AppModalToastContext';
import { initialPickAddressValues, PickAddressContext } from 'contexts/AppPickAddressContext';
import { useDeleteShippingAddress } from 'hooks/useDeleteShippingAddress';
import useGetShippingAddressList from 'hooks/useGetShippingAddressList';
import { navigationRef, RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, View } from 'react-native';
import styled from 'styled-components';
import colors from 'styles/colors';

const { width } = Dimensions.get('window');

const FooterContainer = styled(View)`
  background-color: ${colors.light.whiteSolid};
  bottom: 0;
  display: flex;
  position: absolute;
  width: ${width};
`;
const FooterButton = styled(View)`
  flex-direction: row;
  gap: 8px;
  justify-content: space-around;
  padding: 18px 16px;
`;

const Border = styled(View)<{ color?: string }>`
  border: 0.8px solid ${(props) => props.color || colors.dark.silver};
`;

interface ModifyAddressInterface {
  id: string;
  isPrimary: boolean;
}

export interface SettingsAddressInterface {
  ref: React.RefObject<BottomSheetMethods>;
  setModifyAddress: React.Dispatch<React.SetStateAction<ModifyAddressInterface>>;
}

interface AddressScreenNavigationProps extends StackNavigationProp<RootStackParamList> {}

interface DeliveryAddress extends Array<CheckoutPickAddressInterface> {}

function PickAddress() {
  const { t } = useTranslation(['address']);
  const navigation = useNavigation<AddressScreenNavigationProps>();
  const queryClient = useQueryClient();

  const { data: shippingAddressData, isLoading } = useGetShippingAddressList({});

  const { address, setAddress } = useContext(PickAddressContext);
  const { setLoading } = useContext(LoadingContext);
  const [selectedItem, setSelectedItem] = useState<CheckoutPickAddressInterface>(address);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const settingsRef = useRef<BottomSheet>(null);
  const sortBySnapPoints = useMemo(() => ['18%'], []);

  const [modifyAddress, setModifyAddress] = useState<ModifyAddressInterface>(
    {} as ModifyAddressInterface
  );

  const { setIsShowToast, setToastMessage, setType } = useContext(ModalToastContext);

  const { mutate: deleteShippingAddress } = useDeleteShippingAddress({
    onSuccess: async (deletedAddress, payload) => {
      if (!deletedAddress.error) {
        queryClient.invalidateQueries(['useGetShippingAddressList']);
        setIsShowToast(true);
        setToastMessage(deletedAddress.message);
        setType('success');
        if (payload.addressId === address.id) setAddress(initialPickAddressValues);
      } else {
        setIsShowToast(true);
        setToastMessage(deletedAddress.message);
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

  const handleModifyAddress = (id: string | number) => {
    if (id === 'remove') {
      setIsConfirmOpen(true);
    } else {
      navigation.push('AddressStack', {
        screen: 'ModifyAddress',
        params: { id: modifyAddress.id, isPrimary: modifyAddress.isPrimary }
      });
    }
    settingsRef.current?.close();
  };

  const handleRemoveAddress = () => {
    deleteShippingAddress({ addressId: modifyAddress.id });
  };

  const handleAddAddress = () => {
    navigation.push('AddressStack', {
      screen: 'NewAddress',
      params: {
        isPrimary: shippingAddressData?.data?.length === 0 ? true : false,
        from: 'checkout'
      }
    });
  };

  const moreOptionData = [
    {
      id: 'modify',
      value: t('delivery.modifyLabel')
    },
    {
      id: 'remove',
      value: t('delivery.deleteAddress')
    }
  ];

  useEffect(() => {
    if (address) setSelectedItem(address);
  }, [address]);

  useEffect(() => setLoading(isLoading), [isLoading, setLoading]);

  return (
    <>
      <LayoutScreen
        isScrollable
        scrollViewContentStyle={{ padding: 24 }}
        backgroundColor={colors.light.whiteSolid}
        isNoPadding
      >
        <ListAddress
          onSettings={{ ref: settingsRef, setModifyAddress }}
          selected={selectedItem}
          setSelected={setSelectedItem}
          data={shippingAddressData?.data || []}
          handleAddAddress={handleAddAddress}
        />
      </LayoutScreen>

      {shippingAddressData?.data && shippingAddressData?.data.length > 0 && (
        <FooterContainer>
          <Border />
          <FooterButton>
            <View
              style={{
                flex: 1,
                display:
                  shippingAddressData?.data && shippingAddressData?.data.length < 2
                    ? 'flex'
                    : 'none'
              }}
            >
              <Button
                label={t('add.title')}
                onPress={handleAddAddress}
                height={40}
                fontSize="large"
                fontWeight="semi-bold"
                borderRadius="48px"
                variant="secondary"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Button
                label={t('common.apply')}
                onPress={() => {
                  setAddress(selectedItem);
                  navigationRef.goBack();
                }}
                height={40}
                fontSize="large"
                fontWeight="semi-bold"
                borderRadius="48px"
                color={colors.secondary}
                variant="background"
              />
            </View>
          </FooterButton>
        </FooterContainer>
      )}

      <BottomDrawerList
        selectedId={''}
        onChange={handleModifyAddress}
        data={moreOptionData}
        title={t('common.settings')}
        bottomSheetRef={settingsRef}
        snapPoints={sortBySnapPoints}
        snapPointsKeyboard={sortBySnapPoints}
        enablePanDownToClose
        enableContentPanningGesture
        enableHandlePanningGesture
        onClose={() => {
          settingsRef.current?.close();
        }}
      />
      <ModalAlert
        title={t('delivery.confirmDeleteAddressTitle')}
        description={t('delivery.confirmDeleteAddressDescription')}
        isVisible={isConfirmOpen}
        onCloseModal={() => setIsConfirmOpen(false)}
        onPressYes={handleRemoveAddress}
      />
    </>
  );
}

function ListAddress({
  data,
  selected,
  setSelected,
  onSettings,
  handleAddAddress
}: {
  data?: DeliveryAddress;
  selected: CheckoutPickAddressInterface;
  setSelected: React.Dispatch<React.SetStateAction<CheckoutPickAddressInterface>>;
  onSettings: SettingsAddressInterface;
  handleAddAddress: () => void;
}) {
  const { t } = useTranslation(['address']);
  return (
    <View style={{ flexGrow: 1, gap: 16 }}>
      {data && data.length > 0 ? (
        <>
          {data.map((item, index) => (
            <React.Fragment key={index}>
              <AddressCard
                {...item}
                onSettings={onSettings}
                address={item.address}
                is_primary={item.is_primary}
                label={item.label}
                onPressEdit={() => undefined}
                onPress={() => {
                  if (selected.id !== item.id) {
                    setSelected(item);
                  }
                }}
                receipt_name={item.receipt_name}
                receipt_phone={item.receipt_phone}
                variant="checkout_delivery"
                selected={item.id === selected.id ? selected : undefined}
              />
            </React.Fragment>
          ))}
        </>
      ) : (
        <Button
          label={t('address:delivery.newAddress')}
          onPress={handleAddAddress}
          variant="background"
          color={colors.secondary}
          borderRadius="88px"
        />
      )}
    </View>
  );
}

export default PickAddress;
