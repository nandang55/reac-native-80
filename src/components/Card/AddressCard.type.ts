import { ResponseAddressInfo } from 'interfaces/AddressInterface';
import { SettingsAddressInterface } from 'screens/CheckoutPickAddressScreen';

export type AddressScreenVariant = 'account' | 'checkout' | 'checkout_delivery';

export interface CheckoutPickAddressInterface extends ResponseAddressInfo {}

export type AddressIconTypes = {
  variant: AddressScreenVariant;
  isPrimary: boolean;
  onPress?: () => void;
  selected?: CheckoutPickAddressInterface;
};

export interface AddressCardInterface extends ResponseAddressInfo {
  variant?: AddressScreenVariant;
  selected?: CheckoutPickAddressInterface;
  onSettings?: SettingsAddressInterface;
  onPress?: () => void;
  onPressEdit: (id: string, isPrimary: boolean) => void;
}
