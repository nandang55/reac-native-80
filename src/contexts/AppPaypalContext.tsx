import React, { createContext, useState } from 'react';

interface PaypalContextInterface {
  orderId: string;
  setOrderId: React.Dispatch<React.SetStateAction<string>>;
}

export const PaypalContext = createContext<PaypalContextInterface>({
  orderId: '',
  setOrderId: () => undefined
});

const AppPaypalContext = ({ children }: { children: React.ReactNode }) => {
  const [orderId, setOrderId] = useState<string>('');
  return (
    <PaypalContext.Provider value={{ orderId, setOrderId }}>{children}</PaypalContext.Provider>
  );
};

export default AppPaypalContext;
