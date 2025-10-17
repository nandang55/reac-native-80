// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import { ResponseAddressInfo } from 'interfaces/AddressInterface';
import React, { createContext, useState } from 'react';

export const initialPickAddressValues = {
  id: '',
  address: '',
  is_primary: false,
  label: '',
  postal_code: '',
  receipt_name: '',
  receipt_phone: '',
  receipt_phone_cc: '',
  floor_or_unit: ''
};

type PickAddressContextType = {
  address: ResponseAddressInfo;
  setAddress: React.Dispatch<React.SetStateAction<ResponseAddressInfo>>;
};

export const PickAddressContext = createContext<PickAddressContextType>({
  address: initialPickAddressValues,
  setAddress: () => undefined
});

const AppPickAddressContext = ({ children }: { children: React.ReactNode }) => {
  const [address, setAddress] = useState<ResponseAddressInfo>(initialPickAddressValues);
  return (
    <PickAddressContext.Provider value={{ address, setAddress }}>
      {children}
    </PickAddressContext.Provider>
  );
};

export default AppPickAddressContext;
