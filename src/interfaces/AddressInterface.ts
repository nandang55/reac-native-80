export interface AddressListInterface {
  id: string;
  name: string;
}

export interface AddressSuggestionInterface {
  address: string;
}

export interface BaseAddressInterface {
  label: string;
  receipt_name: string;
  receipt_phone: string;
  receipt_phone_cc: string;
  address: string;
  postal_code: string;
  floor_or_unit: string;
  is_primary: boolean;
}

export interface PostBodyAddressInterface extends BaseAddressInterface {
  province_id: string;
  area_id: string;
  city_id: string;
}

export interface ResponseAddNewAddressInterface {
  id: string;
}

interface AddressStateInterface {
  province_name: string;
  city_name: string;
  area_name: string;
  province_id: string;
  city_id: string;
  area_id: string;
}

export interface ResponseAddressInfo
  extends BaseAddressInterface,
    ResponseAddNewAddressInterface,
    Partial<AddressStateInterface> {}

export interface PrimaryAdressInterface
  extends ResponseAddressInfo,
    ResponseAddNewAddressInterface {}
